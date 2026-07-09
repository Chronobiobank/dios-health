/** Science & trust · lean scan page; detail lives on linked routes. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const SCIENCE_TRUST_META = {
  title: `Science · ${DEEPDOSE_NAME}`,
  description:
    'Why timing matters for atypical folk. Clear limits, plain measurement, and the published studies behind dose windows.',
} as const

export const SCIENCE_TRUST_INTRO = {
  eyebrow: 'Science',
  titleWhite: 'Built for lives',
  titleAccent: 'clinics miss.',
  lede:
    'Most timing studies assume a 9-to-5 body. Atypical folk do not live that way. Here is what we measure, what we will not claim, and the published science that backs dose windows for people with odd hours and stacked meds.',
} as const

export const SCIENCE_TRUST_FEATURES = [
  {
    id: 'limits',
    badge: 'Honesty',
    title: 'What we will not claim',
    teaser: 'Support for timing. Not a doctor. Not a diagnosis.',
    cue: '#6b7280',
    href: '/terms',
  },
  {
    id: 'measure',
    badge: 'Measure',
    title: 'How we read your clock',
    teaser: 'Phone first. Home sleep check when you need more.',
    cue: '#acd3de',
    href: '/technology',
  },
  {
    id: 'privacy',
    badge: 'Privacy',
    title: 'Your data stays with you',
    teaser: 'On your phone. Share only if you choose.',
    cue: '#f2b8a2',
    href: '/mission',
  },
  {
    id: 'evidence',
    badge: 'Evidence',
    title: 'Published studies',
    teaser: 'Real trials on when medicines work better.',
    cue: '#8b9cf8',
    href: '#evidence',
  },
] as const

export const SCIENCE_TRUST_CTA = {
  label: 'See how the stack works',
  href: '/technology',
} as const
