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
  /** Final CTA footer — replaces place on the last screen */
  ctaLine: "London's 1st Floating Recovery Space",
  /** Compact single line for tight surfaces */
  line: '2-night reset · 7-day detox · Paddington London',
} as const

/** Subhead under the brand title. */
export const SLEEPLAB_OUTCOME = 'Rest Deeper, Work Smarter.' as const

export const SLEEPLAB_INCLUDES = [
  'Metabolic health screen',
  'Overnight sleep sensing',
  'Dark, quiet, climate-sealed room',
  'Wake with your body clock',
  'Chemistry score unlock',
] as const

/** Equinox-style science beat — inspired by, not a claimed collaboration. */
export const SLEEPLAB_INSPIRED = {
  label: 'Inspired by',
  name: 'Dr Stasha Gominak',
  role: 'Neurologist · RightSleep',
  body: 'Sleep as neurological repair. Vitamin D. B vitamins. The science behind the chamber.',
  href: 'https://drgominak.com/',
  linkLabel: 'drgominak.com',
} as const

/**
 * Experiential screens —
 * brand · Day I–III · includes · inspired · CTA.
 */
export const SLEEPLAB_SCENES = [
  {
    id: 'brand',
    kind: 'brand' as const,
    wordmark: DEEPDOSE_WORDMARK,
    headline: 'Sleep Lab',
    outcome: SLEEPLAB_OUTCOME,
    media: {
      type: 'video' as const,
      src: '/sleeplab/slow-wake.mp4',
      alt: 'Luxury recovery rest — Sleep Lab',
      playbackRate: 0.4,
    },
  },
  {
    id: 'diagnose',
    kind: 'benefit' as const,
    label: 'Day I',
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
    label: 'Day II',
    body: 'Blackout. Climate. Acoustic seal.',
    media: {
      type: 'video' as const,
      src: '/moody-torso.mp4',
      alt: 'Male body in motion — Day II',
      playbackRate: 0.3,
    },
  },
  {
    id: 'perform',
    kind: 'benefit' as const,
    label: 'Day III',
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
    label: 'Includes',
    items: SLEEPLAB_INCLUDES,
  },
  {
    id: 'inspired',
    kind: 'inspired' as const,
    label: SLEEPLAB_INSPIRED.label,
    name: SLEEPLAB_INSPIRED.name,
    role: SLEEPLAB_INSPIRED.role,
    body: SLEEPLAB_INSPIRED.body,
    href: SLEEPLAB_INSPIRED.href,
    linkLabel: SLEEPLAB_INSPIRED.linkLabel,
  },
  {
    id: 'cta',
    kind: 'cta' as const,
    media: {
      type: 'video' as const,
      src: '/full-spectrum.mp4',
      alt: 'Full spectrum — book the Sleep Lab',
      playbackRate: 0.35,
    },
  },
] as const

/** Brand foot — advance into the proposition, not book yet */
export const SLEEPLAB_CONTINUE = {
  label: 'Optimise Your Sleep',
  href: '#sleeplab-scene-diagnose',
} as const

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
