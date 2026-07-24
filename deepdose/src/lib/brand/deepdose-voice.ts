import {
  DEEPDOSE_HOME_HEADLINE,
  DEEPDOSE_POSITIONING,
  DEEPDOSE_PROMISE,
  DEEPDOSE_TAGLINE,
  DEEPDOSE_VALUE_PROP,
} from '@/lib/brand/deepdose-brand'
/**
 * Audience: people off the usual clock (ManJam founding cohort).
 * Positioning: first social network for chemical chronotypes + human connection.
 * Thesis: social network powered by chronochemistry — not a chronotherapy app with social bolted on.
 * Loop (build): Screen → Score → Share → Sync.
 * Retention: Sync → Share → Score → Screen.
 */
export const DEEPDOSE_AUDIENCE = {
  label: 'people off the clock',
  who: 'People who do not live on a 9-to-5 clock — night workers, travelers, late sleepers, and anyone who refused a forced schedule.',
  why: 'They want people on the same chemical chronotype — attraction, recognition, belonging.',
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
  /** Home is Sleep Lab — meta lede */
  homeLede: "London's first Floating Sleep Lab. Join the Network.",
  /** Home primary — join from boat path */
  homePrimaryCta: { label: 'Join the Network', href: '/founders/join?from=boat' },
  /** Home secondary — orbit match splash */
  homeSecondaryCta: { label: 'Find Your Match', href: '/match' },
  /** /match orbit splash — same composition as the old home gate */
  matchHeadline: 'Max Your Chemistry',
  matchLede:
    'The social network that reads your body clock and finds synced matches.',
  matchPrimaryCta: { label: 'Claim Free Access', href: '/founders/join' },
  missionHeadlineWhite: 'Make chemistry',
  missionHeadlineAccent: 'work',
  missionLede: 'Chronotypes match. Tribe keeps. Sync connects.',
  patientSubtitle: DEEPDOSE_POSITIONING,
  communitySupport: 'These are my people.',
  closeSupport: 'Find who is awake in your window.',
  /** Footer under logo */
  footerMission: DEEPDOSE_POSITIONING,
  /** Founding community */
  foundingMembers: {
    label: 'Founding Members',
    lede: 'Manjam alumni join as Deepdose founders.',
  },
} as const

/** @deprecated Prefer DEEPDOSE_HOME_HEADLINE */
export const DEEPDOSE_HOME_HEADLINE_LEGACY = DEEPDOSE_HOME_HEADLINE
