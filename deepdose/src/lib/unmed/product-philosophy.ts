/** Strategic product mandate — stabilise chemistry, not optimise attention. */
export const UNMED_PRODUCT_MANDATE = {
  mission:
    'Restoring upstream circadian chemistry to safely drive downstream drug subtraction.',
  designMandate: 'Zero screen attraction. Zero cognitive load. Maximum biological utility.',
  tagline: 'Stabilising chemistry. Driving deprescribing.',
  antiAttention:
    'We do not optimise attention; we stabilise chemistry. Success is measured by systemic subtraction — fewer medicines, less screen time, and the platform working its way out of the patient\'s life.',
  privacyGuard:
    'Zero-Cloud Privacy Guard: Unmed runs on your device. Your data is federated, user-owned, and never stored as plaintext health information on centralized cloud networks.',
  exitPrinciple:
    'Unmed matches your digital rhythm with physical diagnostics to identify prescribing cascades. As your sleep regularity stabilises, system chemistry repairs — giving your clinician objective evidence to reduce underperforming medication.',
} as const

export const UNMED_SRI_THRESHOLDS = {
  optimal: 75,
  warning: 50,
} as const

export type SriTone = 'optimal' | 'warning' | 'critical'

export function sriTone(score: number | null): SriTone {
  if (score == null) return 'warning'
  if (score >= UNMED_SRI_THRESHOLDS.optimal) return 'optimal'
  if (score >= UNMED_SRI_THRESHOLDS.warning) return 'warning'
  return 'critical'
}
