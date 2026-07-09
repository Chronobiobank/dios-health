import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/**
 * Home = simple chemistry message + face network + two doors.
 * The Fix = people, problems, cascade trap.
 * Prefer "non-conformists" only off-home. No em dashes.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'non-conformists',
  who: 'People who don’t live on a 9-to-5 clock.',
  why: 'Late nights stack meds. Recovery sleep doesn’t.',
} as const

export const DEEPDOSE_VOICE = {
  tagline: 'Find your chemical match.',
  /** Home hero */
  homeHeadlineWhite: 'Find your',
  homeHeadlineAccent: 'chemical match',
  homeLede: '',
  missionHeadlineWhite: 'Know. Fit.',
  missionHeadlineAccent: 'Share.',
  missionLede: `${DEEPDOSE_NAME} shows your med risk, times doses to your rhythm, and lets you share gains if you want.`,
  patientSubtitle: 'Know your SRI. Raise it with six doses. Max every med.',
  communitySupport: 'Share what works with people on a similar rhythm.',
  closeSupport: 'Add your meds. Find your chemical match. Keep your data.',
  /** Footer under logo — short mission for the non-conformist focus. */
  footerMission:
    'Chemical soul-matching for people whose rhythm never fit the clinic clock.',
} as const
