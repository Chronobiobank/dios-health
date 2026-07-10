import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/**
 * Home = chemistry match headline + face network.
 * Mission = Chemical Soul-Matching + how matching works.
 * Prefer "non-conformists" only off-home. No em dashes.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'non-conformists',
  who: 'People who don’t live on a 9-to-5 clock.',
  why: 'Odd hours. Stacked chemistry. Hard to find people who get it.',
} as const

export const DEEPDOSE_VOICE = {
  tagline: 'Find your chemical match.',
  /** Home hero */
  homeHeadlineWhite: 'Find your',
  homeHeadlineAccent: 'chemical match',
  homeLede: '',
  missionHeadlineWhite: 'Know. Share.',
  missionHeadlineAccent: 'Connect.',
  missionLede: `${DEEPDOSE_NAME} helps you understand your chemistry, share details you choose, and connect with people on a similar rhythm for connection, correction, and more.`,
  patientSubtitle: 'Understand your chemistry. Share what fits. Connect and correct.',
  communitySupport: 'Share details with people on a similar rhythm for connection and correction.',
  closeSupport: 'Know your chemistry. Share details. Connect and correct together.',
  /** Footer under logo */
  footerMission:
    'Understand your chemistry. Share what fits. Connect with people on your rhythm.',
} as const
