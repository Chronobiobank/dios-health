import { buildInsightsData, type BloodPanelSnapshot, type NightFlagsRow } from '@/lib/dashboard/insights-data'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { parseTimeToMinutes } from '@/lib/dashboard/time-utils'
import { getGominakRangeStatus, GOMINAK_TARGETS } from '@/lib/dashboard/blood-panel-gominak'
import { LAYER_BIT_BLOOD, LAYER_BIT_SMARTPHONE, LAYER_BIT_TIPTRAQ } from '@/lib/dashboard/dlmo-merge'
import type { PatientProfileRow } from '@/lib/auth/require-patient'
import type {
  BloodPanel,
  MeasureTileData,
  Medication,
  PatientSnapshot,
  RetinomicBaselineSummary,
  TiptraqSummary,
} from '@/lib/patient-dashboard/types'
import { buildPatientNextStepsBlock } from '@/lib/patient-dashboard/build-patient-next-steps'
import { formatCompletenessValue, formatOpenGapsLabel, tileSubhead } from '@/lib/patient-dashboard/tile-copy'
import { buildPatientCalibration } from '@/lib/patient-dashboard/calibration'
import { buildChronosomaticSpectrumNodes } from '@/lib/patient-dashboard/spectrum-nodes'
import { buildSnapshotStatNotes } from '@/lib/patient-dashboard/snapshot-stat-copy'
import {
  chronopenicBurdenScoreFromGapYears,
  photonicAgeFromCalendarAndGap,
} from '@/lib/product/chronopenic-burden'
import type { FeedFreshness } from '@/lib/retinomic/feed-retention'
import {
  parseStoredHardwareBaseline,
  type StoredHardwareBaseline,
} from '@/lib/retinomic/baseline-scan-summary'
import {
  isSeanJamesPatient,
  resolveChronologicalAge,
  seanJamesProfilePatch,
} from '@/lib/patient-dashboard/sean-james-profile'
import { computeSeanJamesSleepMetrics } from '@/lib/patient-dashboard/sean-james-tiptraq'

type InsightsMLuxProfile = MLuxProfileRow & {
  dominant_layer?: 'smartphone' | 'blood' | 'tiptraq' | null
  layers_active?: number | null
  mlux_score?: number | null
}

type BuildPatientSnapshotInput = {
  patient: PatientProfileRow
  mluxProfile: InsightsMLuxProfile | null
  tipTraqNightsCount: number
  bloodPanelsCount: number
  smartphoneActive: boolean
  latestNight: NightFlagsRow | null
  latestBloodPanel: BloodPanelSnapshot | null
  latestTiptraqDate: string | null
  sleepOnsetDelayMinutes: number | null
  /** Mean AHI from recent TipTraQ nights (e.g. last five). */
  meanTipTraqAhi?: number | null
  hardwareBaseline?: StoredHardwareBaseline | null
  feedFreshness?: FeedFreshness
  /** Live melanopic alignment 0–100 when phone feed is fresh */
  lightAlignmentOverride?: number | null
}

function buildRetinomicBaselineSummary(
  hardware: StoredHardwareBaseline | null | undefined
): RetinomicBaselineSummary | null {
  if (!hardware) return null
  const gclValues = [hardware.gclIplThicknessMicrons.leftEye, hardware.gclIplThicknessMicrons.rightEye].filter(
    (v): v is number => v != null && Number.isFinite(v)
  )
  const gclIplMicrons = gclValues.length > 0 ? Math.min(...gclValues) : null
  return {
    irisLabel: hardware.irisPigment === 'LIGHT' ? 'Light' : 'Dark',
    skinIta: hardware.skinITA,
    gclIplMicrons,
    hasOctThickness: gclIplMicrons != null,
  }
}

function resolveSpectrumTipTraq(input: BuildPatientSnapshotInput): {
  meanAhi: number | null
  tipTraqNightsCount: number
} {
  const nights = input.tipTraqNightsCount
  const fromDb = input.meanTipTraqAhi
  if (fromDb != null && !Number.isNaN(fromDb)) {
    return { meanAhi: fromDb, tipTraqNightsCount: nights }
  }
  if (isSeanJamesPatient(input.patient) && nights === 0) {
    const metrics = computeSeanJamesSleepMetrics()
    return { meanAhi: metrics.meanAhi, tipTraqNightsCount: metrics.nightsLoaded }
  }
  return { meanAhi: null, tipTraqNightsCount: nights }
}

const MED_COLOURS = [
  'var(--researcher-avatar-text)',
  'var(--color-brand)',
  'var(--calm-optimal)',
  'var(--aubergine-mid)',
  'var(--calm-critical)',
] as const

function parseMedicationDose(raw: string): { name: string; dose: string } {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(.+?)\s+(\d[\d./]*\s*\w+.*)$/i)
  if (match) return { name: match[1], dose: match[2] }
  return { name: trimmed, dose: '' }
}

function medicationStatus(time: string, now = new Date()): Medication['status'] {
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return 'upcoming'
  const medMinutes = h * 60 + m
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  if (medMinutes <= nowMinutes) return 'taken'
  if (medMinutes >= 18 * 60) return 'tonight'
  return 'upcoming'
}

function formatStudyDate(iso: string | null): string {
  if (!iso) return 'Pending'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Pending'
  return date.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })
}

function estimateDarkYearsHours(chronotypeQ1: string, chronotypeQ3: string): number {
  const wakeMinutes = parseTimeToMinutes(chronotypeQ1)
  const sleepMinutes = parseTimeToMinutes(chronotypeQ3)
  if (wakeMinutes === null || sleepMinutes === null) return 1.4
  const midpoint = normalizeMidpoint(sleepMinutes, wakeMinutes)
  const populationMidpoint = 3 * 60
  return Math.round((Math.abs(midpoint - populationMidpoint) / 60) * 10) / 10
}

function normalizeMidpoint(sleepMinutes: number, wakeMinutes: number): number {
  let sleep = sleepMinutes
  if (sleep < wakeMinutes) sleep += 24 * 60
  return Math.round((sleep + wakeMinutes + 24 * 60) / 2) % (24 * 60)
}

function buildMedications(
  currentMedications: string[] | null | undefined,
  insights: ReturnType<typeof buildInsightsData>
): Medication[] {
  if (insights.medicationWindows.length > 0) {
    return insights.medicationWindows.map((window, index) => {
      const timeMatch = window.diosWindow.match(/(\d{1,2}:\d{2})/)
      const time = timeMatch?.[1] ?? '21:00'
      return {
        name: window.name,
        dose: '',
        time,
        reason: window.explanation,
        status: medicationStatus(time),
        colour: MED_COLOURS[index % MED_COLOURS.length],
      }
    })
  }

  return (currentMedications ?? []).slice(0, 4).map((raw, index) => {
    const { name, dose } = parseMedicationDose(raw)
    const time = index % 2 === 0 ? '07:30' : '21:30'
    return {
      name,
      dose,
      time,
      reason: 'Timing aligned to your body clock window for best effect.',
      status: medicationStatus(time),
      colour: MED_COLOURS[index % MED_COLOURS.length],
    }
  })
}

function buildBloodPanel(latest: BloodPanelSnapshot | null): BloodPanel {
  if (!latest?.vitamin_d3_nmoll) {
    return {
      vitaminDLabel: 'Too low',
      vitaminDValue: null,
      vdrFlagUnresolved: true,
      collectedAt: latest?.collected_at ?? null,
    }
  }

  const status = getGominakRangeStatus(
    latest.vitamin_d3_nmoll,
    GOMINAK_TARGETS.vitaminD3.min,
    GOMINAK_TARGETS.vitaminD3.max
  )

  return {
    vitaminDLabel: status === 'low' ? 'Too low' : status === 'high' ? 'High' : 'In range',
    vitaminDValue: `${latest.vitamin_d3_nmoll} nmol/L`,
    vdrFlagUnresolved: status === 'low' || latest.vitamin_b12_pmoll == null,
    collectedAt: latest.collected_at,
  }
}

function buildMeasureTiles(input: {
  sleepDelay: number
  bloodPanel: BloodPanel
  tiptraq: TiptraqSummary
  completenessGaps: number
  darkYearsHours: number
  hasTipTraq: boolean
  hasRetinomicScan: boolean
  dlmoEstimate: string
  tipTraqNightsCount?: number
  meanSleepOnset?: string
}): MeasureTileData[] {
  const nights = input.tipTraqNightsCount ?? 0
  const sleepLabel = nights >= 2 ? 'Clock drift (night average)' : 'Clock drift'
  const sleepSubtitle = tileSubhead(
    input.sleepDelay > 0
      ? nights >= 2
        ? `Onset averaged ${input.sleepDelay} minutes late versus your DLMO sleep target.`
        : `You ran ${input.sleepDelay} minutes past your body clock target overnight.`
      : 'Sleep onset matched your body clock window with little drift.'
  )

  const vitdSubtitle = tileSubhead(
    input.bloodPanel.vdrFlagUnresolved
      ? input.bloodPanel.collectedAt
        ? 'Vitamin D is low and not activating clock genes well.'
        : 'No bloods yet; vitamin D and VDR unconfirmed for planning.'
      : 'Vitamin D in range, supporting circadian cofactors for your plan.'
  )

  const tiptraqSubtitle = tileSubhead(
    input.hasTipTraq
      ? nights >= 2
        ? `${nights} TipTraQ nights show sleep late versus your DLMO window.`
        : `TipTraq shows onset ${input.sleepDelay} minutes late versus your DLMO window.`
      : 'Connect TipTraq to track sleep rhythm against your body clock.'
  )

  const completenessSubtitle = tileSubhead(
    input.completenessGaps === 0
      ? input.hasRetinomicScan
        ? 'Eye scan, phone stream, and layers connected — plan runs on your biology.'
        : 'All data streams connected so your personalised plan runs precisely.'
      : input.completenessGaps === 1
        ? input.hasRetinomicScan
          ? 'Eye baseline on file — one stream gap still reduces timing precision.'
          : 'One data gap reduces Dark Years and medication timing precision.'
        : 'Two data gaps reduce Dark Years and medication timing precision.'
  )

  return [
    {
      id: 'sleep',
      value: `${input.sleepDelay} min`,
      label: sleepLabel,
      subtitle: sleepSubtitle,
      badge: 'Adding Dark Years',
      badgeTone: 'watch',
      source: input.hasRetinomicScan ? 'Retinomic scan + phone' : 'Smartphone stream',
      panelRows: [
        { key: 'Your body clock target', value: input.dlmoEstimate },
        { key: 'How far your clock slipped', value: `${input.sleepDelay} min` },
        {
          key: 'Dark Years added this week',
          value: `+${Math.round(input.darkYearsHours * 1.43 * 10) / 10} years`,
        },
      ],
      panelActions: [
        {
          label: 'How to recover ↗',
          prompt: 'How can I reduce my Dark Years and recover my clock tonight?',
        },
      ],
    },
    {
      id: 'vitd',
      value: input.bloodPanel.vitaminDLabel,
      label: 'Vitamin D not working',
      subtitle: vitdSubtitle,
      badge: 'Act now',
      badgeTone: 'act',
      source: input.bloodPanel.collectedAt ? 'Blood panel' : 'Awaiting bloods',
      panelRows: [
        { key: 'Vitamin D', value: input.bloodPanel.vitaminDValue ?? 'Not measured' },
        { key: 'VDR flag', value: input.bloodPanel.vdrFlagUnresolved ? 'Unresolved' : 'Clear' },
        { key: 'Dark Years contribution', value: '+0.8 Dark Years' },
      ],
      panelActions: [
        {
          label: 'Explain my vitamin D',
          prompt: 'Why is my vitamin D adding Dark Years to my Chronosomatic Age?',
        },
        { label: 'Open DIOS Coach', opensCoach: true },
      ],
    },
    {
      id: 'tiptraq',
      value: input.tiptraq.qualityLabel,
      label: 'Sleep quality',
      subtitle: tiptraqSubtitle,
      badge: input.tiptraq.lastStudyDate
        ? `Last study: ${formatStudyDate(input.tiptraq.lastStudyDate)}`
        : 'Last study',
      badgeTone: 'study',
      source: 'TipTraQ',
      panelRows: [
        { key: 'Quality', value: input.tiptraq.qualityLabel },
        { key: 'Clock drift (mean)', value: `${input.sleepDelay} min` },
        { key: 'Last study', value: formatStudyDate(input.tiptraq.lastStudyDate) },
      ],
      panelActions: [
        {
          label: 'Review sleep study',
          prompt: 'What did my latest TipTraQ night show about my Dark Years?',
        },
      ],
    },
    {
      id: 'completeness',
      value: formatCompletenessValue(input.completenessGaps),
      label: 'Data completeness',
      subtitle: completenessSubtitle,
      badge: input.completenessGaps > 0 ? 'Action needed' : 'Complete',
      badgeTone: input.completenessGaps > 0 ? 'action' : 'watch',
      source: 'DIOS layers',
      panelRows: [
        { key: formatOpenGapsLabel(input.completenessGaps), value: String(input.completenessGaps) },
        { key: 'Light alignment', value: 'See snapshot' },
        { key: 'Priority', value: input.completenessGaps > 0 ? 'Connect missing streams' : 'Maintain streams' },
      ],
      panelActions: [
        {
          label: input.completenessGaps > 1 ? 'Fix both gaps ↗' : 'What should I connect?',
          prompt: 'Which gaps should I fix first to reduce my Dark Years?',
        },
      ],
    },
  ]
}

export function buildPatientSnapshot(input: BuildPatientSnapshotInput): PatientSnapshot {
  const hasTipTraq = input.tipTraqNightsCount > 0
  const bloodConnected = input.bloodPanelsCount > 0
  const profile = input.mluxProfile
  const hardwareBaseline =
    input.hardwareBaseline ?? parseStoredHardwareBaseline(input.patient.hardware_baseline)
  const retinomicBaseline = buildRetinomicBaselineSummary(hardwareBaseline)

  const layersActive =
    (hasTipTraq ? LAYER_BIT_TIPTRAQ : 0) |
    (bloodConnected ? LAYER_BIT_BLOOD : 0) |
    (input.smartphoneActive ? LAYER_BIT_SMARTPHONE : 0)

  const insights = buildInsightsData({
    profile: profile
      ? {
          ...profile,
          dominant_layer: hasTipTraq ? 'tiptraq' : bloodConnected ? 'blood' : 'smartphone',
          layers_active: layersActive,
        }
      : null,
    latestNight: input.latestNight,
    nightsCount: input.tipTraqNightsCount,
    currentMedications: input.patient.current_medications,
    fallbackSleepTime: input.patient.chronotype_q3 ?? '23:00',
    latestBloodPanel: input.latestBloodPanel,
  })

  const calendarAge = resolveChronologicalAge(input.patient)
  const darkYearsHours = estimateDarkYearsHours(
    input.patient.chronotype_q1 ?? '',
    input.patient.chronotype_q3 ?? ''
  )
  const clockDrift = profile?.confidence_band_minutes ?? Math.round(darkYearsHours * 60)
  const chronopenicBurdenYears = Math.round(darkYearsHours * 2.3 * 10) / 10
  const photonicAge = photonicAgeFromCalendarAndGap(calendarAge, chronopenicBurdenYears)
  const chronopenicBurdenScore = chronopenicBurdenScoreFromGapYears(chronopenicBurdenYears)
  const recoveryYears = Math.round(chronopenicBurdenYears * 0.75 * 10) / 10
  const lightAlignment = Math.round(
    input.lightAlignmentOverride ??
      profile?.confidence_score ??
      insights.confidenceScore ??
      (retinomicBaseline ? 68 : 71)
  )

  const dlmoEstimate =
    profile?.mlux_phase_time?.slice(0, 5) ??
    insights.phaseTimeLabel ??
    '22:30'

  const medications = buildMedications(input.patient.current_medications, insights)
  const medicationsDueTonight = medications.filter((m) => m.status === 'tonight').length

  const bloodPanel = buildBloodPanel(input.latestBloodPanel)

  const sleepDelay = input.sleepOnsetDelayMinutes ?? (hasTipTraq ? 38 : 0)

  const tiptraqSummary: TiptraqSummary = {
    sleepOnsetDelayMinutes: sleepDelay,
    qualityLabel: input.latestNight?.rem_delay_flag ? 'Moderate' : hasTipTraq ? 'Moderate' : 'Pending',
    darkYearsHours,
    lastStudyDate: input.latestTiptraqDate,
  }

  let completenessGaps = 0
  if (!hasTipTraq) completenessGaps += 1
  if (!bloodConnected) completenessGaps += 1
  if (!input.smartphoneActive) completenessGaps += 1
  if (bloodPanel.vdrFlagUnresolved && bloodConnected) completenessGaps = Math.max(completenessGaps, 2)

  const measureTiles = buildMeasureTiles({
    sleepDelay,
    bloodPanel,
    tiptraq: tiptraqSummary,
    completenessGaps: Math.min(completenessGaps, 2),
    darkYearsHours,
    hasTipTraq,
    hasRetinomicScan: retinomicBaseline != null,
    dlmoEstimate,
    tipTraqNightsCount: input.tipTraqNightsCount,
  })

  const statNotes = buildSnapshotStatNotes({
    darkYearsHours,
    lightAlignment,
    clockDrift: sleepDelay || clockDrift,
    dlmoEstimate,
    tipTraqNights: input.tipTraqNightsCount,
  })

  const chronotypeLabel = input.patient.chronotype_q2?.toLowerCase() ?? ''
  const chronotypeEvening =
    chronotypeLabel.includes('evening') ||
    chronotypeLabel.includes('night') ||
    (isSeanJamesPatient(input.patient) && hasTipTraq)

  const { meanAhi: spectrumMeanAhi, tipTraqNightsCount: spectrumNights } = resolveSpectrumTipTraq(input)

  const spectrumNodes = buildChronosomaticSpectrumNodes({
    clockDrift: sleepDelay || clockDrift,
    darkYearsHours,
    lightAlignment,
    bloodPanel,
    latestNight: input.latestNight,
    hasTipTraq: hasTipTraq || spectrumNights > 0,
    meanAhi: spectrumMeanAhi,
    tipTraqNightsCount: spectrumNights,
    currentMedications: input.patient.current_medications,
    chronotypeEvening,
  })

  const calibrationPatient = seanJamesProfilePatch(input.patient)

  const baseCalibration = buildPatientCalibration({
    patient: calibrationPatient,
    tipTraqNightsCount: input.tipTraqNightsCount,
    latestTiptraqDate: input.latestTiptraqDate,
    mluxChronotype: profile?.chronotype ?? null,
  })

  const calibration = {
    ...baseCalibration,
    eyeColorLabel: retinomicBaseline?.irisLabel ?? baseCalibration.eyeColorLabel,
    latitude: hardwareBaseline?.onboardingGeo?.lat ?? baseCalibration.latitude,
    solarZenith: Math.round(
      hardwareBaseline?.onboardingGeo?.solarZenithDegrees ?? baseCalibration.solarZenith
    ),
  }

  const sleepDrift = sleepDelay || clockDrift
  const nextSteps = buildPatientNextStepsBlock({
    medicationsDueTonight: medicationsDueTonight || (medications.length > 0 ? 2 : 0),
    medications,
    clockDrift: sleepDrift,
    dlmoEstimate,
    bloodPanel,
    completenessGaps: Math.min(completenessGaps, 2),
    spectrumNodes,
    tipTraqNightsCount: spectrumNights,
    hasTipTraq: hasTipTraq || spectrumNights > 0,
    recoveryYears,
    feedFreshness: input.feedFreshness,
    hasRetinomicScan: retinomicBaseline != null,
  })

  return {
    calendarAge,
    photonicAge,
    chronopenicBurdenYears,
    chronopenicBurdenScore,
    burdenTrendDirection: null,
    recoveryYears,
    darkYearsHours,
    lightAlignment,
    clockDrift: sleepDrift,
    dlmoEstimate,
    retinomicBaseline,
    statNotes,
    medications,
    medicationsDueTonight: medicationsDueTonight || (medications.length > 0 ? 2 : 0),
    bloodPanel,
    tiptraqSummary,
    measureTiles,
    completenessGaps: Math.min(completenessGaps, 2),
    coachOnline: true,
    spectrumNodes,
    nextSteps,
    ...calibration,
  }
}
