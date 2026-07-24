import { DEEPDOSE_NAME, DEEPDOSE_WORDMARK } from '@/lib/brand/deepdose-brand'

export const SLEEPLAB_META = {
  title: `${DEEPDOSE_NAME} · Floating Sleep Lab`,
  description:
    "London's first Floating Sleep Lab. Learn on the water. Track at home. Join the Network.",
} as const

export const SLEEPLAB_COMMERCIAL = {
  offers: ['Learn on the water', 'Track at home', 'Ice Wharf London'] as const,
  place: 'Ice Wharf, London',
  line: 'Learn on the water · Track at home · Ice Wharf London',
} as const

/** Brand — who + one ask. */
export const SLEEPLAB_BRAND = {
  headLines: ["London's first", 'Floating Sleep Lab'] as const,
  place: SLEEPLAB_COMMERCIAL.place,
  primary: { label: 'Join us', href: '/founders/join?from=boat' },
  secondary: { label: 'See how', href: '#sleeplab-scene-how' },
} as const

/** How — reuse Features list shell. */
export const SLEEPLAB_HOW = {
  label: 'Cities kill your sleep',
  items: [
    {
      icon: 'sensing' as const,
      title: 'Learn on the water',
      body: 'Daytime workshops. Science-backed sleep tricks.',
    },
    {
      icon: 'wake' as const,
      title: 'Track at home',
      body: 'A wearable maps sleep in your own bed.',
    },
    {
      icon: 'score' as const,
      title: "Map London's rest",
      body: 'See how your neighbourhood sleeps.',
    },
  ],
} as const

export type SleepLabFeatureIconId = (typeof SLEEPLAB_HOW.items)[number]['icon']

/** Science — inspired by, not a claimed collaboration. */
export const SLEEPLAB_INSPIRED = {
  label: 'Science',
  name: 'Dr Stasha Gominak',
  body: 'Gut health switches on recovery.',
} as const

/** Brand · How · Science · Join. */
export const SLEEPLAB_SCENES = [
  {
    id: 'brand',
    kind: 'brand' as const,
    wordmark: DEEPDOSE_WORDMARK,
    headLines: SLEEPLAB_BRAND.headLines,
    place: SLEEPLAB_BRAND.place,
    primary: SLEEPLAB_BRAND.primary,
    secondary: SLEEPLAB_BRAND.secondary,
    media: {
      type: 'image' as const,
      src: '/glowing-cabin.jpg',
      alt: 'Canal boat — Floating Sleep Lab',
    },
  },
  {
    id: 'how',
    kind: 'includes' as const,
    label: SLEEPLAB_HOW.label,
    items: SLEEPLAB_HOW.items,
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
      type: 'image' as const,
      src: '/deepdose-bedroom.jpg',
      alt: 'Join the Deepdose Network',
    },
  },
] as const

export const SLEEPLAB_NETWORK_CTA = {
  label: 'Join the Network',
  href: '/founders/join?from=boat',
} as const
