// lib/dlmo.ts
// Proxy DLMO Algorithm v1.0
// DIOS Health — The Circadian Foundation
// Based on: Burgess et al. 2016,
// van der Meijden et al. 2022,
// Hannay & Moreno 2020

export interface TipTraQNight {
  sleep_onset: string // "HH:MM"
  sleep_offset: string // "HH:MM"
  sleep_latency_minutes: number
  tst_minutes: number
  waso_minutes: number
  sleep_efficiency_pct: number
  rem_duration_minutes: number
  rem_pct_tst: number
  first_rem_onset: string | null // "HH:MM"
  ahi: number
  sns_pct: number
  pns_pct: number
  mean_pr: number
  min_pr: number
  min_spo2: number
  hypoxic_burden: number
  signal_quality_pct: number
}

export interface DLMOResult {
  proxy_dlmo_time: string // "HH:MM"
  proxy_dlmo_minutes: number // minutes from midnight
  baseline_estimate: string
  rem_correction_min: number
  ans_correction_min: number
  ahi_modifier_min: number
  confidence_score: number
  confidence_band_minutes: number
  confidence_label: string
  chronotype_signal: string
  non_dipper_flag: boolean
  high_sympathetic_flag: boolean
  rem_delay_flag: boolean
  apnea_confound_flag: boolean
}

export interface RollingDLMO {
  proxy_dlmo_time: string
  proxy_dlmo_minutes: number
  nights_count: number
  confidence_score: number
  confidence_band_minutes: number
  confidence_label: string
  chronotype: string
  simvastatin_optimal: string
  ramipril_optimal: string
  prednisolone_optimal: string
  salmeterol_optimal: string
  light_window_start: string
  light_window_end: string
}

// Convert "HH:MM" to minutes from midnight
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// Convert minutes from midnight to "HH:MM"
function toTime(minutes: number): string {
  // Handle crossing midnight
  const normalised = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(normalised / 60)
  const m = normalised % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// Calculate REM latency from sleep onset
function remLatency(sleepOnset: string, firstRem: string | null): number | null {
  if (!firstRem) return null
  const onset = toMinutes(sleepOnset)
  let rem = toMinutes(firstRem)
  // Handle midnight crossing
  if (rem < onset) rem += 1440
  return rem - onset
}

export function calculateNightDLMO(night: TipTraQNight): DLMOResult {
  // ── STEP 1: Baseline from sleep onset ──
  // DLMO typically 2h before sleep onset
  // Population baseline offset: -120 min
  const sotMinutes = toMinutes(night.sleep_onset)
  const baselineMinutes = sotMinutes - 120
  const baselineTime = toTime(baselineMinutes)

  // ── STEP 2: REM latency correction ──
  // Expected REM latency: 85 min
  // Deviation indicates phase shift
  // Weight: 0.25 (Burgess et al.)
  const remLat = remLatency(night.sleep_onset, night.first_rem_onset)
  const expectedRem = 85
  let remCorrectionMin = 0
  let remDelayFlag = false

  if (remLat !== null) {
    const remDeviation = remLat - expectedRem
    remCorrectionMin = Math.round(remDeviation * 0.25)
    remDelayFlag = remDeviation > 45
  }

  // ── STEP 3: ANS balance correction ──
  // Low PNS at sleep onset = melatonin
  // not yet fully risen = clock runs later
  // Expected PNS at sleep onset: >45%
  // Weight: 0.35 (van der Meijden 2022)
  const expectedPNS = 45
  const pnsDeviation = expectedPNS - night.pns_pct
  // Positive deviation = lower PNS than expected
  // = clock running later
  const ansCorrectionMin = Math.round(Math.max(0, pnsDeviation) * 0.44)
  const highSympatheticFlag = night.sns_pct > 70

  // ── STEP 4: AHI modifier ──
  // Apnea drives sympathetic activation
  // suppressing PNS signal
  // Mild (5-15): 0 min shift, reduce confidence
  // Moderate (15-30): 0 min shift, reduce more
  // Severe (>30): flag, reduce significantly
  const ahiModifierMin = 0
  let apneaConfoundFlag = false
  if (night.ahi >= 15) {
    apneaConfoundFlag = true
  }

  // ── STEP 5: Composite DLMO estimate ──
  const dlmoMinutes = baselineMinutes + remCorrectionMin + ansCorrectionMin + ahiModifierMin

  // ── STEP 6: Confidence calculation ──
  let confidence = 40 // night 1 base

  // Signal quality bonus
  if (night.signal_quality_pct >= 90) confidence += 10
  else if (night.signal_quality_pct >= 80) confidence += 5

  // REM data available
  if (night.first_rem_onset) confidence += 10

  // Low WASO = cleaner signal
  if (night.waso_minutes < 45) confidence += 8
  else if (night.waso_minutes > 90) confidence -= 8

  // Good sleep efficiency
  if (night.sleep_efficiency_pct >= 85) confidence += 5

  // ANS penalty for apnea confound
  if (night.ahi >= 5 && night.ahi < 15) confidence -= 8
  if (night.ahi >= 15) confidence -= 18

  // High sympathetic penalty
  if (highSympatheticFlag) confidence -= 5

  // Cap at 65 for single night
  confidence = Math.min(65, Math.max(15, confidence))

  // ── STEP 7: Confidence band ──
  let bandMinutes = 75
  if (confidence >= 55) bandMinutes = 45
  else if (confidence >= 45) bandMinutes = 60

  // ── STEP 8: Labels ──
  let confidenceLabel = 'Low'
  if (confidence >= 55) confidenceLabel = 'Moderate'

  // Chronotype from DLMO estimate
  let chronotypeSignal = 'Intermediate type'
  if (dlmoMinutes < 1260) {
    // before 21:00
    chronotypeSignal = 'Morning type'
  } else if (dlmoMinutes > 1380) {
    // after 23:00
    chronotypeSignal = 'Evening type'
  }

  // Non-dipper flag
  // Requires HRV dip data — not in summary report
  // Flag based on high nocturnal SNS as proxy
  const nonDipperFlag = night.sns_pct > 75 && night.mean_pr > 60

  return {
    proxy_dlmo_time: toTime(dlmoMinutes),
    proxy_dlmo_minutes: dlmoMinutes,
    baseline_estimate: baselineTime,
    rem_correction_min: remCorrectionMin,
    ans_correction_min: ansCorrectionMin,
    ahi_modifier_min: ahiModifierMin,
    confidence_score: confidence,
    confidence_band_minutes: bandMinutes,
    confidence_label: confidenceLabel,
    chronotype_signal: chronotypeSignal,
    non_dipper_flag: nonDipperFlag,
    high_sympathetic_flag: highSympatheticFlag,
    rem_delay_flag: remDelayFlag,
    apnea_confound_flag: apneaConfoundFlag,
  }
}

// Rolling average across multiple nights
// Confidence grows with each night
export function calculateRollingDLMO(nights: DLMOResult[]): RollingDLMO {
  const n = nights.length

  // Weighted average — more recent nights
  // weighted higher
  const weights = nights.map((_, i) => i + 1)
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  const weightedDLMO =
    nights.reduce((sum, night, i) => {
      return sum + night.proxy_dlmo_minutes * weights[i]
    }, 0) / totalWeight

  // Rolling confidence
  // Night 1: max 65
  // Night 2: max 78
  // Night 3: max 87
  // Night 7: max 95
  const baseConfidence = nights[nights.length - 1].confidence_score
  const nightBonus = Math.min(30, (n - 1) * 12)
  const rollingConfidence = Math.min(95, baseConfidence + nightBonus)

  // Band narrows with nights
  let bandMinutes = 75
  if (n >= 7) bandMinutes = 15
  else if (n >= 5) bandMinutes = 20
  else if (n >= 3) bandMinutes = 25
  else if (n >= 2) bandMinutes = 40

  let confidenceLabel = 'Low'
  if (rollingConfidence >= 80) confidenceLabel = 'High'
  else if (rollingConfidence >= 65) confidenceLabel = 'Moderate'

  const dlmoTime = toTime(Math.round(weightedDLMO))

  // Chronotype
  let chronotype = 'Intermediate type'
  if (weightedDLMO < 1260) chronotype = 'Morning type'
  else if (weightedDLMO > 1380) chronotype = 'Evening type'

  // ── DOSE TIMING OUTPUTS ──
  // All calculated from rolling DLMO

  // Simvastatin: DLMO + 3h
  // (liver cholesterol synthesis peak)
  const simva = toTime(Math.round(weightedDLMO) + 180)

  // Ramipril: DLMO + 1h
  // (cardiovascular dip window)
  const ramipril = toTime(Math.round(weightedDLMO) + 60)

  // Prednisolone: DLMO + 6h
  // (pre-dawn inflammatory peak)
  const pred = toTime(Math.round(weightedDLMO) + 360)

  // Salmeterol: DLMO + 4h
  // (pre-dawn lung function nadir)
  const salm = toTime(Math.round(weightedDLMO) + 240)

  // Light dose window: DLMO + 9h to DLMO + 11h
  // (optimal morning entrainment window)
  const lightStart = toTime(Math.round(weightedDLMO) + 540)
  const lightEnd = toTime(Math.round(weightedDLMO) + 660)

  return {
    proxy_dlmo_time: dlmoTime,
    proxy_dlmo_minutes: Math.round(weightedDLMO),
    nights_count: n,
    confidence_score: rollingConfidence,
    confidence_band_minutes: bandMinutes,
    confidence_label: confidenceLabel,
    chronotype,
    simvastatin_optimal: simva,
    ramipril_optimal: ramipril,
    prednisolone_optimal: pred,
    salmeterol_optimal: salm,
    light_window_start: lightStart,
    light_window_end: lightEnd,
  }
}
