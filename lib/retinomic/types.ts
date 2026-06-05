import type { BaselineScanSummary } from '@/lib/retinomic/baseline-scan-summary'
import type { RetinomicTier } from '@/src/types'
import type { MedicationTimingPlan } from '@/src/lib/engine/medication-timing'
import type { LightCheckInConfig } from '@/lib/retinomic/light-check-in'
import type { LiveMluxFeedInput } from '@/lib/retinomic/live-mlux-feed'

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

export type DayOneLockedCopy = {
  title: string
  body: string
  cta?: string
  href?: string
}

export type RetinomicDashboardProps = {
  greeting: string
  firstName: string
  tier: RetinomicTier
  baselineScan: BaselineScanSummary | null
  dayOneIntro: string | null
  photicDoseSourceCaption: string
  /** Serialized feed for client-side live lux updates */
  liveMluxFeedInput: LiveMluxFeedInput
  /** Authenticated dashboard — inline light check-in */
  lightCheckIn: LightCheckInConfig | null
  bloodLockedCopy: DayOneLockedCopy | null
  sleepLockedCopy: DayOneLockedCopy | null
  melanopicLuxToday: number
  melanopicLuxCeiling: number
  photicPhase: PhoticDayPhase
  lightIrisDetected: boolean
  vitaminD3NmolL: number | null
  vitaminB5UmolL: number | null
  remCycleEfficiency: number | null
  autonomicStrain: number | null
  /** Day-one med windows derived from intervention engine */
  medicationTiming: MedicationTimingPlan | null
}
