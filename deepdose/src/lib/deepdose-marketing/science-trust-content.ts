/** Science & trust · lean scan page; detail lives on linked routes. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const SCIENCE_TRUST_META = {
  title: `Science · ${DEEPDOSE_NAME}`,
  description:
    'How DeepDose reads chemistry for connection — clear limits, plain measurement, published timing science.',
} as const

export const SCIENCE_TRUST_INTRO = {
  eyebrow: 'Science',
  titleWhite: 'Chemistry you can',
  titleAccent: 'understand.',
  lede:
    'We help you read your rhythm so you can share it and connect with people on a similar chemistry. Here is what we measure, what we will not claim, and the published science behind timing for atypical hours.',
} as const

export const SCIENCE_TRUST_FEATURES = [
  {
    id: 'limits',
    badge: 'Honesty',
    title: 'What we will not claim',
    teaser: 'Chemistry matching and timing support. Not a doctor. Not a diagnosis.',
    cue: '#6b7280',
    href: '/terms',
  },
  {
    id: 'measure',
    badge: 'Measure',
    title: 'How we read your chemistry',
    teaser: 'Phone first. Home sleep check when you want a deeper read.',
    cue: '#acd3de',
    href: '/technology',
  },
  {
    id: 'privacy',
    badge: 'Privacy',
    title: 'Your data stays with you',
    teaser: 'Share only the details you choose for connection.',
    cue: '#f2b8a2',
    href: '/mission',
  },
  {
    id: 'evidence',
    badge: 'Evidence',
    title: 'Published studies',
    teaser: 'Real trials on rhythm and timing behind clearer chemistry.',
    cue: '#8b9cf8',
    href: '#evidence',
  },
] as const

export const SCIENCE_TRUST_CTA = {
  label: 'See how the stack works',
  href: '/technology',
} as const
