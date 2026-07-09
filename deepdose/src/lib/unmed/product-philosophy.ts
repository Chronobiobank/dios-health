import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Strategic product mandate · outcomes for non-conformists on meds. */
export const DEEPDOSE_PRODUCT_MANDATE = {
  mission:
    'Help non-conformists on medication recover sleep and reduce underperforming scripts, without another attention app.',
  designMandate: 'Zero screen attraction. Zero cognitive load. Maximum biological utility.',
  tagline: 'Max your medication.',
  antiAttention:
    'Non-conformists face the highest risk of drug clashes. Manage that, maximise every dose, then we get out of the way.',
  privacyGuard: `${DEEPDOSE_NAME} runs on your device. Your data is federated, user-owned, and never stored as plaintext health information on centralized cloud networks.`,
  exitPrinciple: `${DEEPDOSE_NAME} matches your real rhythm with physical checks when needed. As sleep stabilises, your clinician gets objective evidence to reduce meds that are no longer earning their place.`,
} as const

/** @deprecated Use DEEPDOSE_PRODUCT_MANDATE */
export const UNMED_PRODUCT_MANDATE = DEEPDOSE_PRODUCT_MANDATE

export const DEEPDOSE_SRI_THRESHOLDS = {
  optimal: 75,
  warning: 50,
} as const

/** @deprecated Use DEEPDOSE_SRI_THRESHOLDS */
export const UNMED_SRI_THRESHOLDS = DEEPDOSE_SRI_THRESHOLDS

export type SriTone = 'optimal' | 'warning' | 'critical'

export function sriTone(score: number | null): SriTone {
  if (score == null) return 'warning'
  if (score >= DEEPDOSE_SRI_THRESHOLDS.optimal) return 'optimal'
  if (score >= DEEPDOSE_SRI_THRESHOLDS.warning) return 'warning'
  return 'critical'
}
