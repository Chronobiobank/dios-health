import type { PatientProfileRow } from '@/lib/auth/require-patient'
import type { HardwareBaseline, IrisPigment } from '@/src/types'

const FITZPATRICK_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const

export type StoredHardwareBaseline = HardwareBaseline & {
  onboardingGeo?: {
    lat: number
    lng: number
    solarZenithDegrees?: number
  }
}

export type BaselineScanSummary = {
  irisPigment: IrisPigment
  skinITA: number
  fitzpatrickRoman: string
  locationLabel: string
  lat: number
  lng: number
  solarZenithDegrees: number | null
}

function parseIrisPigment(value: unknown): IrisPigment | null {
  return value === 'LIGHT' || value === 'DARK' ? value : null
}

export function parseStoredHardwareBaseline(
  raw: Record<string, unknown> | null | undefined
): StoredHardwareBaseline | null {
  if (!raw || typeof raw !== 'object') return null
  const irisPigment = parseIrisPigment(raw.irisPigment)
  const skinITA = typeof raw.skinITA === 'number' && Number.isFinite(raw.skinITA) ? raw.skinITA : null
  if (!irisPigment || skinITA == null) return null

  const geo = raw.onboardingGeo
  const onboardingGeo =
    geo && typeof geo === 'object'
      ? {
          lat: typeof (geo as { lat?: unknown }).lat === 'number' ? (geo as { lat: number }).lat : 0,
          lng: typeof (geo as { lng?: unknown }).lng === 'number' ? (geo as { lng: number }).lng : 0,
          solarZenithDegrees:
            typeof (geo as { solarZenithDegrees?: unknown }).solarZenithDegrees === 'number'
              ? (geo as { solarZenithDegrees: number }).solarZenithDegrees
              : undefined,
        }
      : undefined

  return {
    irisPigment,
    skinITA,
    onboardingGeo,
  }
}

export function buildBaselineScanSummary(
  patient: Pick<PatientProfileRow, 'fitzpatrick_type' | 'location_city' | 'location_country'>,
  raw: Record<string, unknown> | null | undefined
): BaselineScanSummary | null {
  const baseline = parseStoredHardwareBaseline(raw)
  if (!baseline?.onboardingGeo) return null

  const fitzpatrickValue =
    patient.fitzpatrick_type != null && patient.fitzpatrick_type >= 1 && patient.fitzpatrick_type <= 6
      ? patient.fitzpatrick_type
      : 3

  const city = patient.location_city?.trim()
  const country = patient.location_country?.trim()
  const locationLabel = [city, country].filter(Boolean).join(', ') || 'Your location'

  return {
    irisPigment: baseline.irisPigment,
    skinITA: baseline.skinITA,
    fitzpatrickRoman: FITZPATRICK_ROMAN[fitzpatrickValue - 1],
    locationLabel,
    lat: baseline.onboardingGeo.lat,
    lng: baseline.onboardingGeo.lng,
    solarZenithDegrees: baseline.onboardingGeo.solarZenithDegrees ?? null,
  }
}

export function irisPigmentIsLight(irisPigment: IrisPigment): boolean {
  return irisPigment === 'LIGHT'
}
