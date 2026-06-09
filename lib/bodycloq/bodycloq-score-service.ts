import {
  calibrationGateLabel,
  isCalibrationComplete,
  nightsRemainingInBlock,
  resolveCalibrationGate,
} from '@/lib/bodycloq/calibration-gate'
import type {
  BodycloQProfilePatch,
  BodycloQScoreInput,
  BodycloQScoreResult,
} from '@/lib/bodycloq/types'
import { BODYCLOQ_METRIC_NAME } from '@/lib/brand/bodycloq-brand'

function scorePerformanceLabel(score: number): string {
  if (score >= 85) return 'Peak alignment'
  if (score >= 70) return 'Strong alignment'
  if (score >= 55) return 'Moderate alignment'
  if (score >= 40) return 'Drifting'
  return 'Misaligned'
}

/**
 * Pure BodycloQ score — circadian alignment for peak cognition (0–100).
 * Consumes MLux rolling outputs; does not touch UI or raw telemetry weights.
 */
export function computeBodycloQScore(input: BodycloQScoreInput): BodycloQScoreResult {
  const gate = resolveCalibrationGate(input.nightsCount)
  const nightsRemaining = nightsRemainingInBlock(input.nightsCount)

  if (gate === 'pending') {
    return {
      score: null,
      gate,
      displayLabel: calibrationGateLabel(gate, input.nightsCount),
      isProvisional: true,
      nightsRemaining,
    }
  }

  const confidence = input.mluxConfidence ?? 0
  const bandMinutes = input.confidenceBandMinutes ?? 75
  const driftMinutes = input.clockDriftMinutes ?? 0

  const precisionScore = Math.max(0, Math.min(100, 100 - bandMinutes * 0.85))
  const driftPenalty = Math.min(18, Math.max(0, driftMinutes - 12) * 0.35)

  let rawScore = Math.round(confidence * 0.62 + precisionScore * 0.38 - driftPenalty)
  rawScore = Math.max(0, Math.min(100, rawScore))

  if (gate === 'partial') {
    const progress = input.nightsCount / 3
    const provisionalScore = Math.round(rawScore * (0.35 + 0.65 * progress))
    return {
      score: provisionalScore,
      gate,
      displayLabel: calibrationGateLabel(gate, input.nightsCount),
      isProvisional: true,
      nightsRemaining,
    }
  }

  return {
    score: rawScore,
    gate,
    displayLabel: `${BODYCLOQ_METRIC_NAME} ${rawScore} · ${scorePerformanceLabel(rawScore)}`,
    isProvisional: false,
    nightsRemaining: 0,
  }
}

export function buildBodycloQProfilePatch(
  input: BodycloQScoreInput,
  hasBloodPanel: boolean
): BodycloQProfilePatch {
  const result = computeBodycloQScore(input)
  const calibrated = isCalibrationComplete(input.nightsCount)

  return {
    mlux_score: result.score,
    has_tipraq: calibrated,
    diagnostic_tier: calibrated ? 'L1' : hasBloodPanel ? 'L2' : 'L3',
  }
}
