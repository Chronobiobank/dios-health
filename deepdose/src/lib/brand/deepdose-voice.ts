import { DEEPDOSE_NAME, DEEPDOSE_MOVEMENT, DEEPDOSE_TOKEN_ECONOMY } from '@/lib/brand/deepdose-brand'

/**
 * Consumer tribe: Dosers.
 * Splash CTA: Max your chemistry — stack + meeting people.
 * Movement: Medmaxxing — tribal achievement on the med stack.
 * Token economy: Get in Flow — verb + in/out state.
 * Deepdose remains the company / clinical / Chronobiobank layer.
 * Prefer "non-conformists" only off-home. No em dashes.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'dosers',
  who: 'People who don’t live on a 9-to-5 clock.',
  why: 'They max their chemistry — stack + people on their clock — and get in Flow.',
} as const

export const DEEPDOSE_VOICE = {
  tagline: 'Max your chemistry.',
  /** Home hero — CTA that includes Medmaxxing + meeting others */
  homeHeadlineWhite: 'Max your',
  homeHeadlineAccent: 'Chemistry',
  homeLede: '',
  missionHeadlineWhite: 'Max your',
  missionHeadlineAccent: 'Chemistry',
  missionLede: `${DEEPDOSE_NAME}: max your chemistry — ${DEEPDOSE_MOVEMENT} the stack, meet your clock, ${DEEPDOSE_TOKEN_ECONOMY}`,
  patientSubtitle: `Max your chemistry. ${DEEPDOSE_TOKEN_ECONOMY}`,
  communitySupport: 'Dosers on your clock. Max your chemistry.',
  closeSupport: 'Stamp it. If you didn’t stamp it, it didn’t count.',
  /** Footer under logo */
  footerMission: 'Max your chemistry.',
} as const
