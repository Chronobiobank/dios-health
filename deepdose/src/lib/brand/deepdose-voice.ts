import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/**
 * Home = clear goal + three moves.
 * The Fix = people, problems, cascade trap.
 * Prefer "non-conformists" only off-home. No em dashes.
 *
 * Motivation: optimise what you already take.
 * Moves: know risk → fit doses to your life → share gains.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'non-conformists',
  who: 'People who don’t live on a 9-to-5 clock.',
  why: 'Late nights stack meds. Recovery sleep doesn’t.',
} as const

export const DEEPDOSE_VOICE = {
  tagline: 'Max your medication.',
  /** Home hero: the goal */
  homeHeadlineWhite: 'Max your',
  homeHeadlineAccent: 'medication.',
  /** Context + outcome. CTA owns "know my risk." */
  homeLede:
    'Non-conformists face the highest risk of drug clashes. We help you manage that so you maximise every dose.',
  missionHeadlineWhite: 'Know. Fit.',
  missionHeadlineAccent: 'Share.',
  missionLede: `${DEEPDOSE_NAME} shows your med risk, times doses to your rhythm, and lets you share gains if you want.`,
  patientSubtitle: 'Know your SRI. Raise it with six doses. Max every med.',
  communitySupport: 'Share what works with people on a similar rhythm.',
  closeSupport: 'Add your meds. Know your risk. Keep your data.',
  /** Footer under logo — short mission for the non-conformist focus. */
  footerMission:
    'Helping non-conformists manage drug clashes and maximise every dose.',
} as const
