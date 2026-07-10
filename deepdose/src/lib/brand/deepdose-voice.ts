import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/**
 * Consumer north star: sleepmaxxing + share real life (daily Real).
 * Prefer "non-conformists" only off-home. No em dashes.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'non-conformists',
  who: 'People who don’t live on a 9-to-5 clock.',
  why: 'Odd hours. Hard nights. Looking for people who get it.',
} as const

export const DEEPDOSE_VOICE = {
  tagline: 'Sleepmaxx. Share real life.',
  /** Home hero */
  homeHeadlineWhite: 'Sleepmaxx.',
  homeHeadlineAccent: 'Share real life.',
  homeLede: '',
  missionHeadlineWhite: 'One real night.',
  missionHeadlineAccent: 'Shared.',
  missionLede: `${DEEPDOSE_NAME} is where you sleepmaxx and post today’s Real — a photo plus your sleep score — with people on your clock.`,
  patientSubtitle: 'Sleepmaxx. Post today’s Real. Find people on your clock.',
  communitySupport: 'Friends on your clock who see your daily Real.',
  closeSupport: 'Sleepmaxx together. One Real a day.',
  /** Footer under logo */
  footerMission: 'Sleepmaxx and share real life — one Real a day.',
} as const
