import { DEEPDOSE_NAME, DEEPDOSE_WORDMARK } from '@/lib/brand/deepdose-brand'

export const SLEEPLAB_META = {
  title: `${DEEPDOSE_NAME} · Floating Sleep Lab`,
  description:
    "London's first Floating Sleep Lab. Learn on the water. Track at home. Join the Network.",
} as const

export const SLEEPLAB_COMMERCIAL = {
  offers: ['Learn on the water', 'Track at home', "Regent's Canal"] as const,
  line: "Learn on the water · Track at home · Regent's Canal",
} as const

/** Brand — who + one ask. */
export const SLEEPLAB_BRAND = {
  headLines: ['Floating Sleep Lab'] as const,
  sub: 'Optimise your circadian chemistry for energy and performance gains that last.',
  primary: { label: 'Join us', href: '/founders/join?from=boat' },
  secondary: { label: 'See how', href: '#sleeplab-scene-how' },
} as const

/** How — reuse Features list shell. */
export const SLEEPLAB_HOW = {
  label: 'Cities kill your sleep',
  sub: 'We built a way out.',
  items: [
    {
      icon: 'sensing' as const,
      title: 'Learn on the water',
      body: 'Daytime workshops. Easy sleep science.',
    },
    {
      icon: 'wake' as const,
      title: 'Track sleep at home',
      body: 'A wearable maps your sleep each night.',
    },
    {
      icon: 'score' as const,
      title: 'Find others in sync',
      body: 'Meet peers synced to your body clock.',
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
    sub: SLEEPLAB_BRAND.sub,
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
    sub: SLEEPLAB_HOW.sub,
    items: SLEEPLAB_HOW.items,
    media: {
      type: 'video' as const,
      src: '/couple-in-bed.mp4',
      alt: 'Couple at rest — sleep recovery',
      playbackRate: 0.35,
    },
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
      alt: "Join London's first Circadian Club Circuit",
    },
  },
] as const

export const SLEEPLAB_NETWORK_CTA = {
  head: "Join London's first Circadian Club Circuit",
  label: 'Apply for Membership',
  href: '/founders/join?from=boat',
} as const
