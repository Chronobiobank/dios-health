/**
 * Dose Intelligence — canonical user / patient state types.
 */

export type RetinomicTier = 'FREE_SCREENING' | 'PREMIUM_VERIFICATION'

export type IrisPigment = 'LIGHT' | 'DARK'

export type HardwareBaseline = {
  irisPigment: IrisPigment
  skinITA: number
}

export type BiochemicalFuel = {
  vitaminD3: number | null
  vitaminB5: number | null
}

/** Multi-tier patient profile consumed by dashboard + webhook ingest. */
export type User = {
  id: string
  tier: RetinomicTier
  hardwareBaseline: HardwareBaseline | null
  biochemicalFuel: BiochemicalFuel | null
  /** Daily morning MLux exposure window (minutes). */
  morningMluxTargetDurationMinutes?: number
}

export type TipTraqWebhookPayload = {
  userId: string
  totalSleepTime: number
  remSleepEfficiencyPercent: number
  microArousalsCount: number
  overnightSpO2Min: number
  reportDate?: string
}
