import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Strategic product mandate · chemistry soul-matching network. */
export const DEEPDOSE_PRODUCT_MANDATE = {
  mission:
    'Help people understand their chemistry, share details they choose, and connect with others for connection, correction, and more — without another attention app.',
  designMandate: 'Zero screen attraction. Zero cognitive load. Maximum chemical clarity.',
  tagline: 'Find your chemical match.',
  antiAttention:
    'Find your chemical match. We match your chemistry, not steal your attention.',
  privacyGuard: `${DEEPDOSE_NAME} runs on your device. Your data is federated, user-owned, and never stored as plaintext health information on centralized cloud networks.`,
  exitPrinciple: `${DEEPDOSE_NAME} helps you understand your chemistry and share details with people on a similar rhythm for connection, correction, and more. You choose what others see. We are not a clinic or an attention feed.`,
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
