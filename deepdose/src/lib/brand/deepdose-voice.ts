import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/**
 * Audience: people off the usual clock (ex-Manjam first cohort).
 * Plain English. No street slang. No insider product words (Grid, Bank, Flow, dosers).
 * Prefer Feed / Score / Log / Me. Brand words (Medmaxxing, Chemistry) stay.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'people off the clock',
  who: 'People who do not live on a 9-to-5 clock — night workers, travelers, late sleepers, and anyone who refused a forced schedule.',
  why: 'They want better nights and real connection with people on the same rhythm.',
} as const

export const DEEPDOSE_VOICE = {
  tagline: 'Max your chemistry.',
  /** Home hero — one line */
  homeHeadlineWhite: 'Max Your Meds',
  homeHeadlineAccent: '',
  homeLede: '',
  missionHeadlineWhite: 'Max your',
  missionHeadlineAccent: 'Chemistry',
  missionLede: `${DEEPDOSE_NAME} is for people off the usual clock. Score your sleep. Plan what you take. Find your chronomatch.`,
  patientSubtitle: 'Max your chemistry. Score your nights with people on your rhythm.',
  communitySupport: 'People on your clock. Max your chemistry.',
  closeSupport: 'Log it. If you did not log it, it did not count.',
  /** Footer under logo */
  footerMission: 'Max your chemistry.',
} as const
