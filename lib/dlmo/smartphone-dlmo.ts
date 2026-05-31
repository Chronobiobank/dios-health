import { normalizeMinutesFromMidnight } from '@/lib/dlmo'

export type SmartphoneDlmoPayload = {
  sleep_onset_local: string
  pupil_constriction_ratio?: number | null
  solar_zenith_deg?: number | null
  vdr_dose_today?: number | null
  fitzpatrick_type?: number | null
  sleep_onset_estimated?: boolean
  recorded_at?: string
}

export type SmartphoneDlmoResult = {
  proxy_dlmo_minutes_from_midnight: number
  confidence_score: number
  confidence_band_minutes: number
  confidence_label: string
}

const BASE_CONFIDENCE = 25
const MAX_SMARTPHONE_CONFIDENCE = 60
const BASE_BAND_MINUTES = 75
const LATE_NIGHT_THRESHOLD_MINUTES = 360 // before 06:00 → treat as after midnight

function toMinutes(time: string): number {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return 0
  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10)
}

function sleepOnsetAnchorMinutes(sleepOnsetLocal: string): number {
  let sleepOnsetMinutes = toMinutes(sleepOnsetLocal)

  if (sleepOnsetMinutes < LATE_NIGHT_THRESHOLD_MINUTES) {
    sleepOnsetMinutes += 1440
  }

  return sleepOnsetMinutes - 120
}

function pupilCorrectionMinutes(ratio: number | null | undefined): number {
  if (ratio == null || Number.isNaN(ratio)) return 0
  if (ratio > 0.7) return 20
  if (ratio < 0.3) return -15
  return 0
}

function solarShiftMinutes(vdrDoseToday: number | null | undefined): number {
  if (vdrDoseToday == null || Number.isNaN(vdrDoseToday)) return 0
  if (vdrDoseToday > 70) return -5
  return 0
}

function vdrBandPenalty(vdrDoseToday: number | null | undefined): number {
  if (vdrDoseToday == null || Number.isNaN(vdrDoseToday)) return 0
  if (vdrDoseToday < 20) return 15
  return 0
}

function melaninMultipliers(fitzpatrickType: number | null | undefined): {
  pupil: number
  solar: number
} {
  if (fitzpatrickType == null || Number.isNaN(fitzpatrickType)) {
    return { pupil: 1, solar: 1 }
  }

  if (fitzpatrickType <= 2) {
    return { pupil: 0.8, solar: 0.8 }
  }

  if (fitzpatrickType >= 5) {
    return { pupil: 1, solar: 1.2 }
  }

  return { pupil: 1, solar: 1 }
}

function scoreConfidence(payload: SmartphoneDlmoPayload): number {
  let confidence = BASE_CONFIDENCE

  if (payload.sleep_onset_local?.trim()) confidence += 10
  if (payload.pupil_constriction_ratio != null && !Number.isNaN(payload.pupil_constriction_ratio)) {
    confidence += 10
  }
  if (payload.solar_zenith_deg != null && !Number.isNaN(payload.solar_zenith_deg)) {
    confidence += 10
  }
  if (payload.fitzpatrick_type != null && !Number.isNaN(payload.fitzpatrick_type)) {
    confidence += 5
  }
  if (payload.sleep_onset_estimated) {
    confidence -= 10
  }

  return Math.min(MAX_SMARTPHONE_CONFIDENCE, Math.max(0, confidence))
}

function labelConfidence(score: number): string {
  if (score <= 30) return 'Very low'
  if (score <= 45) return 'Low'
  return 'Moderate'
}

export function calculateSmartphoneDlmo(payload: SmartphoneDlmoPayload): SmartphoneDlmoResult {
  const anchorMinutes = sleepOnsetAnchorMinutes(payload.sleep_onset_local)
  const melanin = melaninMultipliers(payload.fitzpatrick_type)

  const pupilShift = Math.round(pupilCorrectionMinutes(payload.pupil_constriction_ratio) * melanin.pupil)
  const solarShift = Math.round(solarShiftMinutes(payload.vdr_dose_today) * melanin.solar)

  const proxyDlmoMinutes = normalizeMinutesFromMidnight(Math.round(anchorMinutes + pupilShift + solarShift))
  const confidenceScore = scoreConfidence(payload)
  const confidenceBandMinutes = BASE_BAND_MINUTES + vdrBandPenalty(payload.vdr_dose_today)

  return {
    proxy_dlmo_minutes_from_midnight: proxyDlmoMinutes,
    confidence_score: confidenceScore,
    confidence_band_minutes: confidenceBandMinutes,
    confidence_label: labelConfidence(confidenceScore),
  }
}
