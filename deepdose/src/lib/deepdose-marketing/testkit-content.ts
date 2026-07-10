/** TipTraQ Testkit · consumer page at /testkit */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const TESTKIT_META = {
  title: `Testkit · ${DEEPDOSE_NAME}`,
  description:
    'Three nights at home with TipTraQ. A deeper chemistry read so you can share clearer details and connect with confidence.',
} as const

export const TESTKIT_INTRO = {
  eyebrow: 'Testkit',
  titleWhite: 'Three nights.',
  titleAccent: 'Clearer chemistry.',
  lede: `Odd hours and stacked chemistry need a stronger read than a phone alone. Wear TipTraQ at home for three nights. ${DEEPDOSE_NAME} turns the nights into clearer rhythm details you can understand, share, and correct with people on a similar clock.`,
} as const

export const TESTKIT_KIT = {
  eyebrow: 'The kit',
  title: 'One sensor. Three nights at home.',
  lede:
    'Soft finger sensor, charging case, and app. Built for real nights, not a clinic bed. Stronger details for your chemistry profile.',
  includes: [
    'Reusable sensor and home setup',
    'Three nights of sleep and breathing data',
    'Stronger rhythm baseline for your profile',
    'Clearer chemistry details to share on Deepdose',
  ],
} as const

export const TESTKIT_STEPS = [
  {
    id: 'order',
    rank: 1,
    label: 'Order',
    cue: '#acd3de',
    title: 'When you want a deeper read',
    body: 'Order TipTraQ when phone estimates are not enough. No clinic overnight. No waiting list.',
  },
  {
    id: 'wear',
    rank: 2,
    label: 'Wear',
    cue: '#c9b6f2',
    title: 'Three nights in your own bed',
    body: 'Wear the soft finger sensor. It records oxygen, breathing, and sleep while you keep your usual hours.',
  },
  {
    id: 'review',
    rank: 3,
    label: 'Review',
    cue: '#f2b8a2',
    title: 'Your chemistry baseline updates',
    body: `Nights are reviewed and a stronger rhythm baseline lands in ${DEEPDOSE_NAME} for you to understand and share.`,
  },
  {
    id: 'plan',
    rank: 4,
    label: 'Share',
    cue: '#8b9cf8',
    title: 'Share clearer details',
    body: 'Your profile shows clearer windows for light, meals, meds, movement, and sleep, ready to share for connection and correction.',
  },
] as const

export const TESTKIT_CTA = {
  primary: { label: 'How the kit works', href: '/tiptraq' },
  secondary: { label: 'Know my risk', href: '/profile' },
} as const
