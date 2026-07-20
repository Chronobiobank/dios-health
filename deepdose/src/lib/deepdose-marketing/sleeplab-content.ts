import { DEEPDOSE_NAME, DEEPDOSE_WORDMARK } from '@/lib/brand/deepdose-brand'

export const SLEEPLAB_META = {
  title: `${DEEPDOSE_NAME} · Floating Sleep Lab`,
  description:
    "London's private Floating Sleep Lab in Paddington. 2-night Recovery · 7-day Protocol.",
} as const

/** Live listing — swap for the Deepdose Paddington Airbnb URL when ready. */
export const SLEEPLAB_BOOK_HREF = 'https://www.airbnb.co.uk/' as const

export const SLEEPLAB_COMMERCIAL = {
  offers: ['2-night Recovery', '7-day Protocol', 'Paddington London'] as const,
  place: 'Paddington, London.',
  /** Standalone statement screen after brand */
  statement: 'Floating Sleep Lab',
  statementLead: 'Floating',
  statementRest: 'Sleep Lab',
  /** Compact single line for tight surfaces */
  line: '2-night Recovery · 7-day Protocol · Paddington London',
} as const

/** Brand centre line under the wordmark. */
export const SLEEPLAB_OUTCOME = 'Rest Deeper, Work Smarter.' as const

/** Equinox-style feature outline. Bodies matched ~72 chars, two lines max, no em dashes. */
export const SLEEPLAB_INCLUDES = [
  {
    icon: 'sensing' as const,
    title: 'Homekit Sensing',
    body: 'Tracks sleep, heart rate and breath so your recovery session is data-led.',
  },
  {
    icon: 'seal' as const,
    title: 'Climate Seal',
    body: 'Blackout, climate and acoustic seal keep chamber dark, quiet, and steady.',
  },
  {
    icon: 'screen' as const,
    title: 'Metabolic Screen',
    body: 'Clinical metabolic risk analysis on arrival sets your recovery baseline.',
  },
  {
    icon: 'wake' as const,
    title: 'Circadian Wake',
    body: 'No jarring alarms. Wake timed to your clock with gradual light mornings.',
  },
  {
    icon: 'score' as const,
    title: 'Morning Score',
    body: 'Wake to your chemistry score unlock, a clear read on how the night went.',
  },
] as const

export type SleepLabFeatureIconId = (typeof SLEEPLAB_INCLUDES)[number]['icon']

/** Equinox-style science beat — inspired by, not a claimed collaboration. */
export const SLEEPLAB_INSPIRED = {
  label: 'PROTOCOL',
  name: 'Dr Stasha Gominak, RightSleep neurologist',
  body: 'Sleep as neurological repair.',
} as const

/**
 * Experiential screens —
 * brand · statement · Day I–III · includes · inspired · CTA.
 */
export const SLEEPLAB_SCENES = [
  {
    id: 'brand',
    kind: 'brand' as const,
    wordmark: DEEPDOSE_WORDMARK,
    outcome: SLEEPLAB_OUTCOME,
    media: {
      type: 'video' as const,
      src: '/couple-in-bed.mp4',
      alt: 'Couple at rest — Sleep Lab recovery',
      playbackRate: 0.35,
    },
  },
  {
    id: 'statement',
    kind: 'statement' as const,
    body: SLEEPLAB_COMMERCIAL.statement,
    lead: SLEEPLAB_COMMERCIAL.statementLead,
    rest: SLEEPLAB_COMMERCIAL.statementRest,
    media: {
      type: 'image' as const,
      src: '/glowing-cabin.jpg',
      alt: 'Glowing cabin — Floating Sleep Lab',
    },
  },
  {
    id: 'diagnose',
    kind: 'benefit' as const,
    label: 'DIAGNOSTIC',
    body: 'Clinical-grade metabolic risk analysis',
    media: {
      type: 'video' as const,
      src: '/diagnostics.mp4',
      alt: 'Clinical-grade metabolic risk analysis',
      playbackRate: 0.35,
    },
  },
  {
    id: 'optimise',
    kind: 'benefit' as const,
    label: 'SOMNOLOGIC',
    body: 'Blackout. Climate. Acoustic seal.',
    media: {
      type: 'image' as const,
      src: '/deepdose-bedroom.jpg',
      alt: 'DeepDose bedroom chamber — Day II',
    },
  },
  {
    id: 'perform',
    kind: 'benefit' as const,
    label: 'NEUROLOGIC',
    body: 'Wake restored. Ready for the city.',
    media: {
      type: 'video' as const,
      src: '/open-eyes.mp4',
      alt: 'Open eyes — Day III',
      playbackRate: 0.35,
    },
  },
  {
    id: 'includes',
    kind: 'includes' as const,
    label: 'Features',
    items: SLEEPLAB_INCLUDES,
  },
  {
    id: 'inspired',
    kind: 'inspired' as const,
    label: SLEEPLAB_INSPIRED.label,
    name: SLEEPLAB_INSPIRED.name,
    body: SLEEPLAB_INSPIRED.body,
    media: {
      type: 'image' as const,
      src: '/sleeplab/stasha-gominak.jpg',
      alt: 'Dr Stasha Gominak',
    },
  },
  {
    id: 'cta',
    kind: 'cta' as const,
    media: {
      type: 'video' as const,
      src: '/sleep-massage.mp4',
      alt: 'Sleep massage — book the Sleep Lab',
      playbackRate: 0.45,
    },
  },
] as const

/** Final stay options — both book via Airbnb until dedicated listings exist. */
export const SLEEPLAB_STAY_OFFERS = [
  {
    label: '2-night Recovery',
    lines: ['2-night', 'Recovery'] as const,
    href: SLEEPLAB_BOOK_HREF,
  },
  {
    label: '7-day Protocol',
    lines: ['7-day', 'Protocol'] as const,
    href: SLEEPLAB_BOOK_HREF,
  },
] as const

export const SLEEPLAB_NETWORK_CTA = {
  label: 'Join the Deepdose Network',
  href: '/match',
} as const
