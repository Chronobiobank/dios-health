import { DEEPDOSE_NAME, DEEPDOSE_WORDMARK } from '@/lib/brand/deepdose-brand'

export const SLEEPLAB_META = {
  title: `${DEEPDOSE_NAME} · Floating Sleep Lab`,
  description:
    "London's private Floating Sleep Lab in Paddington. 2-night reset · 7-day detox.",
} as const

/** Live listing — swap for the Deepdose Paddington Airbnb URL when ready. */
export const SLEEPLAB_BOOK_HREF = 'https://www.airbnb.co.uk/' as const

export const SLEEPLAB_COMMERCIAL = {
  offers: ['2-night reset', '7-day detox', 'Paddington London'] as const,
  place: 'Paddington, London.',
  /** Standalone statement screen after brand */
  statement: "Experience London's 1st Floating Sleep Lab",
  /** Final CTA footer — replaces place on the last screen */
  ctaLine: 'Reclaim Lost Time',
  /** Compact single line for tight surfaces */
  line: '2-night reset · 7-day detox · Paddington London',
} as const

/** Brand centre line under the wordmark. */
export const SLEEPLAB_OUTCOME = 'Rest Deeper, Work Smarter.' as const

/** Equinox-style feature outline. Bodies matched ~72 chars, two lines max, no em dashes. */
export const SLEEPLAB_INCLUDES = [
  {
    title: 'Homekit Sensing',
    body: 'Tracks sleep, heart rate and breath so your recovery session is data-led.',
  },
  {
    title: 'Climate Seal',
    body: 'Blackout, climate and acoustic seal keep chamber dark, quiet, and steady.',
  },
  {
    title: 'Metabolic Screen',
    body: 'Clinical metabolic risk analysis on arrival sets your recovery baseline.',
  },
  {
    title: 'Circadian Wake',
    body: 'No jarring alarms. Wake timed to your clock with gradual light mornings.',
  },
  {
    title: 'Morning Score',
    body: 'Wake to your chemistry score unlock, a clear read on how the night went.',
  },
] as const

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
      src: '/sleep-massage.mp4',
      alt: 'Sleep massage — Sleep Lab recovery',
      playbackRate: 0.45,
    },
  },
  {
    id: 'statement',
    kind: 'statement' as const,
    body: SLEEPLAB_COMMERCIAL.statement,
    media: {
      type: 'image' as const,
      src: '/sunset-little-venice.webp',
      alt: "Sunset over Little Venice — London's 1st Floating Sleep Lab",
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
      src: '/couple-in-bed.mp4',
      alt: 'Couple at rest — book the Sleep Lab',
      playbackRate: 0.35,
    },
  },
] as const

export const SLEEPLAB_CTAS = [
  {
    label: 'Book Private Room',
    href: SLEEPLAB_BOOK_HREF,
    external: true,
  },
  {
    label: 'Find Your Match',
    href: '/match',
    external: false,
  },
] as const
