/** Science & trust · lean scan page; detail lives on linked routes. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const SCIENCE_TRUST_META = {
  title: `Science · ${DEEPDOSE_NAME}`,
  description:
    'How DeepDose reads sleep and rhythm for today’s Real — clear limits, plain measurement, published timing science.',
} as const

export const SCIENCE_TRUST_INTRO = {
  eyebrow: 'Science',
  titleWhite: 'Sleep you can',
  titleAccent: 'measure.',
  lede:
    'We help you read your night so you can post an honest Real. Here is what we measure, what we will not claim, and the published science behind timing.',
} as const

export const SCIENCE_TRUST_FEATURES = [
  {
    id: 'limits',
    badge: 'Honesty',
    title: 'What we will not claim',
    teaser: 'Sleepmaxxing support and timing tools. Not a doctor. Not a diagnosis.',
    cue: '#6b7280',
    href: '/terms',
  },
  {
    id: 'measure',
    badge: 'Measure',
    title: 'How we read your night',
    teaser: 'Phone first. Home sleep check when you want a deeper SRI.',
    cue: '#acd3de',
    href: '/technology',
  },
  {
    id: 'privacy',
    badge: 'Privacy',
    title: 'Your data stays with you',
    teaser: 'You choose what goes on today’s Real.',
    cue: '#f2b8a2',
    href: '/mission',
  },
  {
    id: 'evidence',
    badge: 'Evidence',
    title: 'Published studies',
    teaser: 'Real trials on rhythm and timing behind clearer scores.',
    cue: '#8b9cf8',
    href: '#evidence',
  },
] as const

export const SCIENCE_TRUST_CTA = {
  label: 'See how the stack works',
  href: '/technology',
} as const
