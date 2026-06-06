/** Clinician triage copy — CLAUDE.md §5 */

export const PREMIUM_VERIFICATION_BADGE =
  '🛡️ Verified Clinical-Grade Data via TipTraQ' as const

export const DEVICE_INTERRUPTED_ALERT = '⚠️ Connection Interrupted' as const

export const WEARABLE_SOURCE_LABEL = {
  tiptraq: 'TipTraQ',
  oura: 'Oura',
  whoop: 'Whoop',
  apple: 'Apple Health',
} as const

export type WearableSourceLabel = keyof typeof WEARABLE_SOURCE_LABEL
