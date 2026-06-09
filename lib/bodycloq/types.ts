import type { CalibrationGateStatus } from '@/lib/bodycloq/calibration-gate'

export type BodycloQScoreInput = {
  nightsCount: number
  mluxConfidence: number | null
  confidenceBandMinutes: number | null
  clockDriftMinutes?: number | null
}

export type BodycloQScoreResult = {
  /** 0–100 circadian alignment score; null until first TipTraQ night. */
  score: number | null
  gate: CalibrationGateStatus
  displayLabel: string
  /** True while fewer than three nights are in the current calibration block. */
  isProvisional: boolean
  nightsRemaining: number
}

export type BodycloQProfilePatch = {
  mlux_score: number | null
  has_tipraq: boolean
  diagnostic_tier: 'L1' | 'L2' | 'L3' | null
}
