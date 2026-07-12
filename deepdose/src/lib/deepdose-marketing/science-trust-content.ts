/** Science & trust · lean scan page; detail lives on linked routes. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const SCIENCE_TRUST_META = {
  title: `Science · ${DEEPDOSE_NAME}`,
  description:
    'How DeepDose reads sleep and rhythm — clear limits, plain measurement, published timing science.',
} as const

export const SCIENCE_TRUST_INTRO = {
  title: 'Sleep you can measure.',
  lede:
    'We help you read your night so you can log an honest phenotype score. Here is what we measure, what we will not claim, and the published science behind timing.',
} as const

export const SCIENCE_TRUST_FEATURES = [
  {
    id: 'limits',
    badge: 'Honesty',
    title: 'What we will not claim',
    teaser: 'Dose logging and timing tools. Not a doctor. Not a diagnosis.',
    cue: '#6b7280',
    href: '/terms',
  },
  {
    id: 'measure',
    badge: 'Measure',
    title: 'How we read your night',
    teaser: 'Phone first. TipTraQ when you want a clinical early-risk read.',
    cue: '#acd3de',
    href: '/testkit',
  },
  {
    id: 'privacy',
    badge: 'Privacy',
    title: 'Your data stays with you',
    teaser: 'You choose what other people see.',
    cue: '#f2b8a2',
    href: '/how',
  },
  {
    id: 'evidence',
    badge: 'Evidence',
    title: 'Published studies',
    teaser: 'Trials on rhythm and timing behind clearer scores.',
    cue: '#8b9cf8',
    href: '#evidence',
  },
] as const

export const SCIENCE_TRUST_CTA = {
  label: 'See how timing works',
  href: '/technology',
} as const
