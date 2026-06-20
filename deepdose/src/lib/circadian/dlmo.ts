// lib/circadian/dlmo.ts
// Smartphone / wearable DLMO proxy — free tier (Layer 3 / "smartphone_l3").
//
// Estimates Dim-Light Melatonin Onset (DLMO) without a clinical TipTraQ block by
// fusing two low-cost behavioural signals every patient can contribute for free:
//
//   1. Habitual sleep timing from phone / wearable sleep logs.
//      Burgess et al. (2016): habitual sleep onset sits ~2 h after DLMO, so
//      DLMO ≈ sleep onset − 120 min.
//   2. The Munich ChronoType Questionnaire mid-sleep proxy.
//      Roenneberg: DLMO ≈ MSFsc − 2.5 h.
//
// Confidence grows with the number of recent nights and with agreement between the
// two signals, but is deliberately capped well below clinical-grade TipTraQ MLux —
// this is a proxy, not a measurement.

export const POPULATION_MEAN_DLMO_MINUTES = 21 * 60 // 21:00

const SLEEP_ONSET_TO_DLMO_OFFSET = 120 // DLMO ≈ sleep onset − 2 h
const MSFSC_TO_DLMO_OFFSET_HOURS = 2.5 // DLMO ≈ MSFsc − 2.5 h
const MAX_NIGHTS_WEIGHTED = 14
const PROXY_CONFIDENCE_CEILING = 0.55 // smartphone proxy never claims clinical certainty

export const DLMO_PROXY_VERSION = 'dlmo-proxy-v1'

export interface SleepLogSample {
  /** ISO timestamp of sleep onset (local wall-clock preserved in the offset). */
  sleepOnset: string
  /** ISO timestamp of wake (local wall-clock preserved in the offset). */
  wake: string
}

export interface DlmoProxyInput {
  /** Recent phone / wearable sleep logs (any order). */
  sleepLogs: SleepLogSample[]
  /** MCTQ sleep-corrected mid-sleep on free days, decimal hours. */
  msfScHours?: number | null
}

export type DlmoConfidenceLabel = 'none' | 'low' | 'moderate'

export interface DlmoProxyResult {
  method: 'smartphone_l3'
  available: boolean
  /** "HH:MM" local wall-clock estimate, or null when no signal is available. */
  dlmoTime: string | null
  dlmoMinutes: number | null
  /** 0–1, matches dlmo_estimates.confidence NUMERIC(3,2). */
  confidence: number
  confidenceLabel: DlmoConfidenceLabel
  confidenceBandMinutes: number
  /** Deviation from the population mean DLMO (21:00), wrapped to ±720 min. */
  phaseOffsetMinutes: number | null
  chronotype: string | null
  nightsUsed: number
  sources: {
    behavioural: { dlmoMinutes: number; nights: number } | null
    questionnaire: { dlmoMinutes: number } | null
  }
  /** Absolute disagreement between the two signals, in minutes. */
  agreementMinutes: number | null
  version: string
}

export function normalizeMinutes(minutes: number): number {
  return ((minutes % 1440) + 1440) % 1440
}

function minutesToTime(minutes: number): string {
  const n = normalizeMinutes(Math.round(minutes))
  const h = Math.floor(n / 60)
  const m = n % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Pull the wall-clock minutes-from-midnight out of an ISO timestamp WITHOUT
 * converting through the server timezone. Oura/Whoop emit the patient's local
 * offset (e.g. "2024-01-01T23:30:00+13:00"), so the HH:MM in the string is the
 * patient's own clock — exactly the phase we care about.
 */
function isoLocalMinutes(iso: string): number | null {
  const match = /T(\d{2}):(\d{2})/.exec(iso)
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return normalizeMinutes(h * 60 + m)
}

/** Circular mean of clock minutes — correctly averages across the midnight wrap. */
function circularMeanMinutes(values: number[]): number | null {
  if (values.length === 0) return null
  let sinSum = 0
  let cosSum = 0
  for (const v of values) {
    const angle = (normalizeMinutes(v) / 1440) * 2 * Math.PI
    sinSum += Math.sin(angle)
    cosSum += Math.cos(angle)
  }
  if (Math.abs(sinSum) < 1e-9 && Math.abs(cosSum) < 1e-9) return null
  const meanAngle = Math.atan2(sinSum / values.length, cosSum / values.length)
  return normalizeMinutes((meanAngle / (2 * Math.PI)) * 1440)
}

/** Shortest signed difference a − b on a 24 h clock, in [-720, 720]. */
export function circularDiffMinutes(a: number, b: number): number {
  let diff = normalizeMinutes(a) - normalizeMinutes(b)
  if (diff > 720) diff -= 1440
  if (diff < -720) diff += 1440
  return diff
}

function classifyChronotype(dlmoMinutes: number): string {
  const n = normalizeMinutes(dlmoMinutes)
  if (n < 19 * 60) return 'Morning type'
  if (n > 21 * 60) return 'Evening type'
  return 'Intermediate type'
}

const EMPTY_RESULT: DlmoProxyResult = {
  method: 'smartphone_l3',
  available: false,
  dlmoTime: null,
  dlmoMinutes: null,
  confidence: 0,
  confidenceLabel: 'none',
  confidenceBandMinutes: 0,
  phaseOffsetMinutes: null,
  chronotype: null,
  nightsUsed: 0,
  sources: { behavioural: null, questionnaire: null },
  agreementMinutes: null,
  version: DLMO_PROXY_VERSION,
}

export function estimateDlmoProxy(input: DlmoProxyInput): DlmoProxyResult {
  // ── Signal 1: behavioural DLMO from habitual sleep onset ──
  const onsetMinutes = input.sleepLogs
    .map((log) => isoLocalMinutes(log.sleepOnset))
    .filter((v): v is number => v !== null)

  const nights = onsetMinutes.length
  const meanOnset = circularMeanMinutes(onsetMinutes)
  const behavioural =
    meanOnset !== null
      ? { dlmoMinutes: normalizeMinutes(meanOnset - SLEEP_ONSET_TO_DLMO_OFFSET), nights }
      : null

  // ── Signal 2: questionnaire DLMO from MCTQ MSFsc ──
  const questionnaire =
    input.msfScHours != null && Number.isFinite(input.msfScHours)
      ? {
          dlmoMinutes: normalizeMinutes(
            (input.msfScHours - MSFSC_TO_DLMO_OFFSET_HOURS) * 60
          ),
        }
      : null

  if (!behavioural && !questionnaire) {
    return EMPTY_RESULT
  }

  // ── Fuse the two signals ──
  // Behavioural evidence earns more weight as nights accumulate; the questionnaire
  // is a single steady snapshot.
  let fusedMinutes: number
  let agreementMinutes: number | null = null

  if (behavioural && questionnaire) {
    const behaviouralWeight = Math.min(MAX_NIGHTS_WEIGHTED, nights)
    const questionnaireWeight = 2
    // Average around the behavioural anchor to keep the midnight wrap correct.
    const delta = circularDiffMinutes(questionnaire.dlmoMinutes, behavioural.dlmoMinutes)
    fusedMinutes = normalizeMinutes(
      behavioural.dlmoMinutes +
        (delta * questionnaireWeight) / (behaviouralWeight + questionnaireWeight)
    )
    agreementMinutes = Math.abs(delta)
  } else if (behavioural) {
    fusedMinutes = behavioural.dlmoMinutes
  } else {
    fusedMinutes = questionnaire!.dlmoMinutes
  }

  // ── Confidence (0–1) ──
  let confidence = 0
  if (behavioural) confidence += Math.min(0.35, 0.1 + nights * 0.03)
  if (questionnaire) confidence += 0.12
  if (agreementMinutes !== null) {
    if (agreementMinutes <= 30) confidence += 0.1
    else if (agreementMinutes <= 60) confidence += 0.05
    else if (agreementMinutes > 120) confidence -= 0.05
  }
  confidence = Math.max(0.05, Math.min(PROXY_CONFIDENCE_CEILING, confidence))
  confidence = Math.round(confidence * 100) / 100

  const confidenceLabel: DlmoConfidenceLabel = confidence >= 0.45 ? 'moderate' : 'low'

  // Band narrows as confidence climbs.
  const confidenceBandMinutes = confidence >= 0.45 ? 60 : confidence >= 0.3 ? 75 : 90

  const phaseOffsetMinutes = circularDiffMinutes(fusedMinutes, POPULATION_MEAN_DLMO_MINUTES)

  return {
    method: 'smartphone_l3',
    available: true,
    dlmoTime: minutesToTime(fusedMinutes),
    dlmoMinutes: normalizeMinutes(Math.round(fusedMinutes)),
    confidence,
    confidenceLabel,
    confidenceBandMinutes,
    phaseOffsetMinutes,
    chronotype: classifyChronotype(fusedMinutes),
    nightsUsed: nights,
    sources: { behavioural, questionnaire },
    agreementMinutes,
    version: DLMO_PROXY_VERSION,
  }
}
