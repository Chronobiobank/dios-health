import type { RetinomicTier } from '@/src/types'

export type ChronotypePhase = 'delayed' | 'advanced' | 'intermediate'

export type DiosUserState = {
  tier: RetinomicTier
  chronotype: ChronotypePhase
  /** Local HH:mm — first calorie today; drives TRE anchor */
  firstMealTime: string
  vitaminD3NmolL: number | null
  vitaminB5UmolL: number | null
  /** TipTraQ overnight stream (null if no premium nights) */
  tipTraq: {
    remSleepEfficiencyPercent: number | null
    microArousalsCount: number | null
  } | null
  /** Passive phone stream suggests evening melanopic discipline */
  eveningLightDisciplineOptimal: boolean
  morningMluxTargetDurationMinutes: number
}

export type SunZenithData = {
  latitude: number
  solarZenithDegrees: number
  uvbAvailable: boolean
  seasonLabel: string
}

export type InterventionPillar = 'photic' | 'fuel' | 'telemetry'

export type InterventionTask = {
  id: string
  timeLabel: string
  pillar: InterventionPillar
  title: string
  directive: string
  priority: 'required' | 'adjustment' | 'verify'
}

export type DailyIntervention = {
  generatedAt: string
  treWindowHours: number
  firstMealTime: string
  firstBiteBComplexSync: boolean
  acetylcholineShortageFlag: boolean
  photicVsD3Mode: 'solar_walk' | 'supplement_adjust'
  tasks: InterventionTask[]
  clinicalFlags: string[]
}
