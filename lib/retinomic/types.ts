import type { BaselineScanSummary } from '@/lib/retinomic/baseline-scan-summary'
import type { RetinomicTier } from '@/src/types'
import type { MedicationTimingPlan } from '@/src/lib/engine/medication-timing'
import type { FeedFreshness } from '@/lib/retinomic/feed-retention'
import type { LightCheckInConfig } from '@/lib/retinomic/light-check-in'
import type { LiveMluxFeedInput } from '@/lib/retinomic/live-mlux-feed'

export type {
  BiochemicalFuel,
  HardwareBaseline,
  IrisPigment,
  RetinomicTier,
  TipTraqWebhookPayload,
  User,
} from '@/src/types'

export type PhoticDayPhase = 'morning' | 'midday' | 'evening'

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
  /** Day 2+ FREE tier — replaces dayOneIntro on return visits */
  returnVisitIntro: string | null
  feedFreshness: FeedFreshness
  isReturnVisit: boolean
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
