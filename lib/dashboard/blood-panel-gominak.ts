import { normalizeMinutesFromMidnight } from '@/lib/mlux'

export type GominakRangeStatus = 'low' | 'in_range' | 'high' | 'missing'

export const GOMINAK_TARGETS = {
  vitaminD3: { min: 150, max: 200, label: 'Vitamin D3' },
  vitaminB12: { min: 200, max: 700, label: 'Vitamin B12' },
  ferritin: { min: 50, max: 150, label: 'Ferritin' },
} as const

export function getGominakRangeStatus(
  value: number | null | undefined,
  min: number,
  max: number
): GominakRangeStatus {
  if (value == null || Number.isNaN(value)) return 'missing'
  if (value < min) return 'low'
  if (value > max) return 'high'
  return 'in_range'
}

export function gominakStatusLabel(status: GominakRangeStatus): string {
  switch (status) {
    case 'in_range':
      return 'In range'
    case 'low':
      return 'Low'
    case 'high':
      return 'High'
    default:
      return ''
  }
}

export const GOMINAK_STATUS_CLASS: Record<Exclude<GominakRangeStatus, 'missing'>, string> = {
  in_range: 'bg-teal-50 text-teal-800',
  low: 'bg-amber-50 text-amber-800',
  high: 'bg-red-50 text-red-600',
}

export type BloodPanelInput = {
  vitamin_d3_nmoll: number
  vitamin_b12_pmoll: number
  ferritin_ugl: number
  vitamin_b5_umoll?: number | null
  baselineDlmoMinutes?: number | null
}

export type BloodPanelDlmoResult = {
  mlux_phase_minutes: number
  confidence_score: number
  confidence_band_minutes: number
  confidence_label: string
}

const DEFAULT_DLMO_MINUTES = 21 * 60

function countCoreInRange(input: BloodPanelInput): number {
  let count = 0
  if (getGominakRangeStatus(input.vitamin_d3_nmoll, GOMINAK_TARGETS.vitaminD3.min, GOMINAK_TARGETS.vitaminD3.max) === 'in_range') {
    count += 1
  }
  if (getGominakRangeStatus(input.vitamin_b12_pmoll, GOMINAK_TARGETS.vitaminB12.min, GOMINAK_TARGETS.vitaminB12.max) === 'in_range') {
    count += 1
  }
  if (getGominakRangeStatus(input.ferritin_ugl, GOMINAK_TARGETS.ferritin.min, GOMINAK_TARGETS.ferritin.max) === 'in_range') {
    count += 1
  }
  return count
}

/** Layer 2 proxy DLMO estimate from Gominak panel + optional existing baseline. */
export function calculateBloodPanelDlmo(input: BloodPanelInput): BloodPanelDlmoResult {
  const baseline = input.baselineDlmoMinutes ?? DEFAULT_DLMO_MINUTES
  let phaseMinutes = baseline

  const d3Status = getGominakRangeStatus(
    input.vitamin_d3_nmoll,
    GOMINAK_TARGETS.vitaminD3.min,
    GOMINAK_TARGETS.vitaminD3.max
  )
  const b12Status = getGominakRangeStatus(
    input.vitamin_b12_pmoll,
    GOMINAK_TARGETS.vitaminB12.min,
    GOMINAK_TARGETS.vitaminB12.max
  )
  const ferritinStatus = getGominakRangeStatus(
    input.ferritin_ugl,
    GOMINAK_TARGETS.ferritin.min,
    GOMINAK_TARGETS.ferritin.max
  )

  if (d3Status === 'low') phaseMinutes += 30
  else if (d3Status === 'high') phaseMinutes -= 15

  if (b12Status === 'low') phaseMinutes += 20
  else if (b12Status === 'high') phaseMinutes -= 10

  if (ferritinStatus === 'low') phaseMinutes += 15
  else if (ferritinStatus === 'high') phaseMinutes -= 10

  let confidence = 22
  if (d3Status === 'in_range') confidence += 14
  if (b12Status === 'in_range') confidence += 12
  if (ferritinStatus === 'in_range') confidence += 10

  const coreInRange = countCoreInRange(input)
  if (coreInRange === 3) confidence += 8

  if (input.vitamin_b5_umoll != null && !Number.isNaN(input.vitamin_b5_umoll)) {
    confidence += 4
  }

  confidence = Math.min(58, Math.max(22, confidence))

  let confidenceLabel = 'Low'
  if (confidence >= 45) confidenceLabel = 'Moderate'

  const confidenceBandMinutes = coreInRange >= 2 ? 55 : 75

  return {
    mlux_phase_minutes: normalizeMinutesFromMidnight(Math.round(phaseMinutes)),
    confidence_score: confidence,
    confidence_band_minutes: confidenceBandMinutes,
    confidence_label: confidenceLabel,
  }
}

export function mapLabSourceToDb(value: string): string {
  switch (value) {
    case 'City Labs':
      return 'city_labs'
    case 'GP':
      return 'gp'
    case 'Awanui':
      return 'awanui'
    case 'Other':
      return 'other'
    default:
      return value.toLowerCase().replace(/\s+/g, '_')
  }
}
