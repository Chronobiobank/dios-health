import {
  estimateSolarZenith,
  resolveLocationLatitude,
  seasonFromLatitude,
} from '@/lib/patient-dashboard/calibration'

import type { SunZenithData } from '@/src/lib/engine/types'

/** Gominak-aligned D3 band (nmol/L). */
export const VITAMIN_D3_TARGET_MIN_NMOL = 150
export const VITAMIN_D3_TARGET_MAX_NMOL = 200

/**
 * UVB cutaneous synthesis window — proxy from latitude/month zenith estimate.
 * Lower zenith proxy = higher sun → UVB more likely available.
 */
export function isUvbAvailableFromZenith(solarZenithDegrees: number): boolean {
  return solarZenithDegrees < 52
}

export function computeSunZenithData(
  locationCity: string | null | undefined,
  locationCountry: string | null | undefined,
  when = new Date()
): SunZenithData {
  const latitude = resolveLocationLatitude(locationCity, locationCountry)
  const monthIndex = when.getMonth()
  const solarZenithDegrees = estimateSolarZenith(latitude, monthIndex)
  const uvbAvailable = isUvbAvailableFromZenith(solarZenithDegrees)

  return {
    latitude,
    solarZenithDegrees,
    uvbAvailable,
    seasonLabel: seasonFromLatitude(latitude, monthIndex),
  }
}

export function vitaminD3InTargetRange(nmol: number | null): boolean {
  if (nmol == null || Number.isNaN(nmol)) return false
  return nmol >= VITAMIN_D3_TARGET_MIN_NMOL && nmol <= VITAMIN_D3_TARGET_MAX_NMOL
}

export function vitaminD3MicroDoseAdjustmentIu(nmol: number | null): number {
  if (nmol == null) return 2000
  if (nmol < VITAMIN_D3_TARGET_MIN_NMOL) {
    const deficit = VITAMIN_D3_TARGET_MIN_NMOL - nmol
    return Math.min(6000, Math.round(1000 + deficit * 8))
  }
  if (nmol > VITAMIN_D3_TARGET_MAX_NMOL) return 0
  return 1000
}
