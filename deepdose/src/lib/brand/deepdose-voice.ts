import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/**
 * Consumer tribe: Dosers.
 * Deepdose remains the company / clinical / Chronobiobank layer.
 * Prefer "non-conformists" only off-home. No em dashes.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'dosers',
  who: 'People who don’t live on a 9-to-5 clock.',
  why: 'Odd hours. Hard nights. They log the dose.',
} as const

export const DEEPDOSE_VOICE = {
  tagline: 'For dosers.',
  /** Home hero */
  homeHeadlineWhite: 'For',
  homeHeadlineAccent: 'dosers.',
  homeLede: '',
  missionHeadlineWhite: 'Log the dose.',
  missionHeadlineAccent: 'Raise your sleep score.',
  missionLede: `${DEEPDOSE_NAME} is where dosers log Light, Meds, and Move — and share them on the Grid.`,
  patientSubtitle: 'Log a dose. Sync the Grid. Raise your sleep score.',
  communitySupport: 'Dosers on your clock who see today’s doses.',
  closeSupport: 'Dosers log together. One dose at a time.',
  /** Footer under logo */
  footerMission: 'For dosers — log the dose, raise your sleep score.',
} as const
