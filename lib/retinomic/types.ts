export type {
  BiochemicalFuel,
  GclIplThicknessMicrons,
  HardwareBaseline,
  IrisPigment,
  RetinomicTier,
  SilotonWebhookPayload,
  TipTraqWebhookPayload,
  User,
} from '@/src/types'

import type { RetinomicTier } from '@/src/types'

export type PhoticDayPhase = 'morning' | 'midday' | 'evening'

export type SilotonScanNode = {
  id: string
  name: string
  hubType: 'pharmacy' | 'clinical_hub'
  address: string
  distanceKm: number
  lat: number
  lng: number
  openUntil: string
  slotsAvailable: number
}

export type RetinomicDashboardProps = {
  greeting: string
  firstName: string
  tier: RetinomicTier
  melanopicLuxToday: number
  melanopicLuxCeiling: number
  photicPhase: PhoticDayPhase
  lightIrisDetected: boolean
  vitaminD3NmolL: number | null
  vitaminB5UmolL: number | null
  remCycleEfficiency: number | null
  autonomicStrain: number | null
}
