import type {
  BiochemicalFuel,
  HardwareBaseline,
  RetinomicTier,
  User,
} from '@/src/types'

export type PatientRetinomicRow = {
  id: string
  retinomic_tier?: RetinomicTier | null
  hardware_baseline?: HardwareBaseline | null
  biochemical_fuel?: BiochemicalFuel | null
  hardware_bandwidth_coefficient?: number | null
  morning_mlux_target_duration_minutes?: number | null
}

export function mapPatientRowToUser(row: PatientRetinomicRow, fallbackTier: RetinomicTier): User {
  return {
    id: row.id,
    tier: row.retinomic_tier ?? fallbackTier,
    hardwareBaseline: row.hardware_baseline ?? null,
    biochemicalFuel: row.biochemical_fuel ?? null,
    hardwareBandwidthCoefficient: row.hardware_bandwidth_coefficient ?? undefined,
    morningMluxTargetDurationMinutes: row.morning_mlux_target_duration_minutes ?? undefined,
  }
}
