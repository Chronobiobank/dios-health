import type { GclIplThicknessMicrons } from '@/src/types'

export const GCL_IPL_THIN_THRESHOLD_MICRONS = 75
export const HARDWARE_BANDWIDTH_BOOST = 1.2
export const DEFAULT_MORNING_MLUX_TARGET_DURATION_MINUTES = 90

/**
 * Thin GCL-IPL → 1.2 coefficient → 20% longer morning mLux target duration.
 */
export function computeHardwareBandwidthCoefficient(
  gcl: GclIplThicknessMicrons
): number {
  const values = [gcl.leftEye, gcl.rightEye].filter(
    (v): v is number => v != null && Number.isFinite(v)
  )
  if (values.length === 0) return 1
  const minMicrons = Math.min(...values)
  return minMicrons < GCL_IPL_THIN_THRESHOLD_MICRONS ? HARDWARE_BANDWIDTH_BOOST : 1
}

export function applyMorningMluxTargetDuration(
  baseMinutes: number,
  hardwareBandwidthCoefficient: number
): number {
  return Math.round(baseMinutes * hardwareBandwidthCoefficient)
}
