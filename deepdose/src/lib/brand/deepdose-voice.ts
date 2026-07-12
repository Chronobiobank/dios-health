import {
  DEEPDOSE_HOME_HEADLINE,
  DEEPDOSE_NAME,
  DEEPDOSE_POSITIONING,
  DEEPDOSE_PROMISE,
  DEEPDOSE_TAGLINE,
  DEEPDOSE_VALUE_PROP,
} from '@/lib/brand/deepdose-brand'

/**
 * Audience: people off the usual clock (ManJam founding cohort).
 * Positioning: first social network for chemical phenotypes + human connection.
 * Thesis: social network powered by chronochemistry — not a chronotherapy app with social bolted on.
 * Loop (build): Screen → Score → Share → Sync.
 * Retention: Sync → Share → Score → Screen.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'people off the clock',
  who: 'People who do not live on a 9-to-5 clock — night workers, travelers, late sleepers, and anyone who refused a forced schedule.',
  why: 'They want people on the same chemical phenotype — attraction, recognition, belonging.',
} as const

export const DEEPDOSE_VOICE = {
  /** Short CVP / loop imperative */
  tagline: DEEPDOSE_TAGLINE,
  /** Core promise */
  promise: DEEPDOSE_PROMISE,
  /** Full positioning statement */
  positioning: DEEPDOSE_POSITIONING,
  /** Social-graph value prop */
  valueProp: DEEPDOSE_VALUE_PROP,
  /** Home hero — Chemistry That / Connects */
  homeHeadlineWhite: 'Chemistry That',
  homeHeadlineAccent: 'Connects',
  homeLede:
    'Discover your chemical phenotype and find people who move through life like you.',
  /** Home CTAs */
  homePrimaryCta: { label: 'Find Your Sync', href: '/connect' },
  homeSecondaryCta: { label: 'Discover Your Phenotype', href: '/how#phenotype' },
  missionHeadlineWhite: 'Make chemistry',
  missionHeadlineAccent: 'work',
  missionLede: `${DEEPDOSE_POSITIONING} Chemical phenotypes match you. The tribe keeps you. Sync with people in your window.`,
  patientSubtitle: DEEPDOSE_POSITIONING,
  communitySupport: 'These are my people.',
  closeSupport: 'Find who is awake in your window.',
  /** Footer under logo */
  footerMission: DEEPDOSE_POSITIONING,
  /** Founding community */
  foundingMembers: {
    label: 'Founding Members',
    lede: `Former Manjam members are invited as ${DEEPDOSE_NAME} Founding Members — from community, to chemistry, to connection.`,
  },
} as const

/** @deprecated Prefer DEEPDOSE_HOME_HEADLINE */
export const DEEPDOSE_HOME_HEADLINE_LEGACY = DEEPDOSE_HOME_HEADLINE
