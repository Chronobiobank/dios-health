/**
 * Retinomic Protocol — canonical user / patient state types.
 */

export type RetinomicTier = 'FREE_SCREENING' | 'PREMIUM_VERIFICATION'

export type IrisPigment = 'LIGHT' | 'DARK'

export type GclIplThicknessMicrons = {
  leftEye: number | null
  rightEye: number | null
}

export type HardwareBaseline = {
  irisPigment: IrisPigment
  skinITA: number
  gclIplThicknessMicrons: GclIplThicknessMicrons
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
  /** Siloton-derived; 1.2 when GCL-IPL below 75 µm. */
  hardwareBandwidthCoefficient?: number
  /** Daily morning mLux exposure window (minutes); boosted when coefficient > 1. */
  morningMluxTargetDurationMinutes?: number
}

export type SilotonWebhookPayload = {
  userId: string
  gclIplThicknessMicrons: GclIplThicknessMicrons
  irisPigment?: IrisPigment
  skinITA?: number
}

export type TipTraqWebhookPayload = {
  userId: string
  totalSleepTime: number
  remSleepEfficiencyPercent: number
  microArousalsCount: number
  overnightSpO2Min: number
  reportDate?: string
}
