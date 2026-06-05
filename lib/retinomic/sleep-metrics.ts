import type { NightFlagsRow } from '@/lib/dashboard/insights-data'

export function estimateRemCycleEfficiency(latestNight: NightFlagsRow | null): number | null {
  if (!latestNight) return null
  if (latestNight.rem_delay_flag) return 64
  if (latestNight.apnea_confound_flag) return 71
  return 86
}

export function estimateAutonomicStrain(latestNight: NightFlagsRow | null): number | null {
  if (!latestNight) return null
  if (latestNight.high_sympathetic_flag) return 0.58
  if (latestNight.non_dipper_flag) return 0.49
  return 0.34
}
