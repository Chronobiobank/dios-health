/** Science & trust · lean scan page; detail lives on linked routes. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const SCIENCE_TRUST_META = {
  title: `Science · ${DEEPDOSE_NAME}`,
  description:
    'How DeepDose reads sleep and rhythm — clear limits, plain measurement, published timing science.',
} as const

export const SCIENCE_TRUST_INTRO = {
  title: 'Sleep you can measure.',
  lede: 'Honest night reads for a clearer phenotype score.',
} as const

export const SCIENCE_TRUST_FEATURES = [
  {
    id: 'limits',
    badge: 'Honesty',
    title: 'What we will not claim',
    teaser: 'Timing tools only — not a doctor, not a diagnosis.',
    cue: '#6b7280',
    href: '/terms',
  },
  {
    id: 'measure',
    badge: 'Measure',
    title: 'How we read your night',
    teaser: 'Phone first. Homekit when you want a deeper read.',
    cue: '#acd3de',
    href: '/testkit',
  },
  {
    id: 'privacy',
    badge: 'Privacy',
    title: 'Your data stays with you',
    teaser: 'You choose what peers see on your doses.',
    cue: '#f2b8a2',
    href: '/how',
  },
  {
    id: 'evidence',
    badge: 'Evidence',
    title: 'Published studies',
    teaser: 'Rhythm trials behind clearer timing scores.',
    cue: '#8b9cf8',
    href: '#evidence',
  },
] as const

export const SCIENCE_TRUST_CTA = {
  label: 'See how timing works',
  href: '/technology',
} as const
