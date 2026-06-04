import { FITZPATRICK_TYPES } from '@/lib/auth/patient-signup-data'
import type { PatientProfileRow } from '@/lib/auth/require-patient'

const FITZPATRICK_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const

const CITY_LATITUDE: Record<string, number> = {
  wellington: -41.3,
  auckland: -36.9,
  christchurch: -43.5,
  hamilton: -37.8,
  dunedin: -45.9,
  sydney: -33.9,
  melbourne: -37.8,
  brisbane: -27.5,
  perth: -31.9,
  london: 51.5,
  manchester: 53.5,
  birmingham: 52.5,
  edinburgh: 55.9,
  dublin: 53.3,
  singapore: 1.3,
  toronto: 43.7,
  vancouver: 49.3,
}

type BuildCalibrationInput = {
  patient: PatientProfileRow
  tipTraqNightsCount: number
  latestTiptraqDate: string | null
  mluxChronotype?: string | null
  now?: Date
}

export type PatientCalibrationFields = {
  fitzpatrickType: string
  fitzpatrickLabel: string
  latitude: number
  locationName: string
  season: string
  solarZenith: number
  chronotype: string
  chronotypeSource: string
}

function fitzpatrickFields(type: number | null): { fitzpatrickType: string; fitzpatrickLabel: string } {
  const value = type != null && type >= 1 && type <= 6 ? type : 3
  const match = FITZPATRICK_TYPES.find((entry) => entry.value === value)
  return {
    fitzpatrickType: FITZPATRICK_ROMAN[value - 1],
    fitzpatrickLabel: (match?.label ?? 'Medium').toLowerCase(),
  }
}

export function resolveLocationLatitude(
  locationCity?: string | null,
  locationCountry?: string | null
): number {
  const city = locationCity?.trim().toLowerCase() ?? ''
  if (city && CITY_LATITUDE[city]) return CITY_LATITUDE[city]

  const country = locationCountry?.trim().toLowerCase() ?? ''
  if (country.includes('new zealand')) return -41.3
  if (country.includes('australia')) return -33.9
  if (country.includes('united kingdom') || country === 'uk') return 51.5
  if (country.includes('ireland')) return 53.3
  if (country.includes('singapore')) return 1.3
  if (country.includes('united states') || country === 'usa') return 40.7

  return 51.5
}

export function seasonFromLatitude(latitude: number, monthIndex: number): string {
  const southern = latitude < 0

  if (southern) {
    if (monthIndex === 11 || monthIndex <= 1) return 'Summer'
    if (monthIndex >= 2 && monthIndex <= 4) return 'Autumn'
    if (monthIndex >= 5 && monthIndex <= 7) return 'Winter'
    return 'Spring'
  }

  if (monthIndex === 11 || monthIndex <= 1) return 'Winter'
  if (monthIndex >= 2 && monthIndex <= 4) return 'Spring'
  if (monthIndex >= 5 && monthIndex <= 7) return 'Summer'
  return 'Autumn'
}

/** Static solar zenith estimate from latitude and month (degrees). */
export function estimateSolarZenith(latitude: number, monthIndex: number): number {
  const absLat = Math.abs(latitude)
  const southern = latitude < 0
  const winterMonths = southern ? [5, 6, 7] : [11, 0, 1]
  const isWinter = winterMonths.includes(monthIndex)
  const seasonalOffset = isWinter ? 17 : -6
  return Math.min(90, Math.max(25, Math.round(absLat + seasonalOffset)))
}

function chronotypeDisplay(
  patient: PatientProfileRow,
  mluxChronotype?: string | null
): { chronotype: string; chronotypeSource: string } {
  const q2 = patient.chronotype_q2?.toLowerCase() ?? ''
  const mlux = mluxChronotype?.toLowerCase() ?? ''

  let chronotype = 'Intermediate'
  if (q2.includes('evening') || q2.includes('night') || mlux.includes('evening')) {
    chronotype = 'Night owl'
  } else if (q2.includes('morning') || mlux.includes('morning')) {
    chronotype = 'Early bird'
  }

  return { chronotype, chronotypeSource: '' }
}

function formatTipTraqSource(dateIso: string | null): string {
  if (!dateIso) return 'confirmed TipTraQ study'
  const date = new Date(dateIso)
  if (Number.isNaN(date.getTime())) return 'confirmed TipTraQ study'
  return `confirmed TipTraQ ${date.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })}`
}

export function buildPatientCalibration(input: BuildCalibrationInput): PatientCalibrationFields {
  const now = input.now ?? new Date()
  const { fitzpatrickType, fitzpatrickLabel } = fitzpatrickFields(input.patient.fitzpatrick_type)
  const latitude = resolveLocationLatitude(
    input.patient.location_city,
    input.patient.location_country
  )
  const locationName =
    input.patient.location_city?.trim() ||
    input.patient.location_country?.trim() ||
    'Your location'
  const season = seasonFromLatitude(latitude, now.getMonth())
  const solarZenith = estimateSolarZenith(latitude, now.getMonth())
  const { chronotype, chronotypeSource: _unused } = chronotypeDisplay(input.patient, input.mluxChronotype)

  const chronotypeSource =
    input.tipTraqNightsCount > 0
      ? formatTipTraqSource(input.latestTiptraqDate)
      : input.patient.chronotype_q2
        ? 'from your chronotype answers'
        : 'estimated — connect TipTraQ to confirm'

  return {
    fitzpatrickType,
    fitzpatrickLabel,
    latitude,
    locationName,
    season,
    solarZenith,
    chronotype,
    chronotypeSource,
  }
}
