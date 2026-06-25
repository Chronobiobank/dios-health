/** Science & trust — lean scan page; detail lives on linked routes. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const SCIENCE_TRUST_META = {
  title: `Science & trust · ${DEEPDOSE_NAME}`,
  description:
    `How ${DEEPDOSE_NAME} estimates body-clock timing, what we measure, and what we do not claim.`,
} as const

export const SCIENCE_TRUST_INTRO = {
  eyebrow: 'Science & trust',
  titleWhite: 'How timing',
  titleAccent: 'support works',
  lede: 'Decision support for dose timing — not a prescriber or diagnosis.',
} as const

export const SCIENCE_TRUST_FEATURES = [
  {
    id: 'limits',
    badge: 'Honesty',
    title: 'What we do not claim',
    teaser: 'Decision support only — not a prescriber',
    cue: '#6b7280',
    href: '/terms',
  },
  {
    id: 'measure',
    badge: 'Measure',
    title: 'How we read your clock',
    teaser: 'Proxy DLMO on-device · TipTraQ when needed',
    cue: '#acd3de',
    href: '/technology',
  },
  {
    id: 'privacy',
    badge: 'Privacy',
    title: 'Your data stays close',
    teaser: 'On-device phase · consent-gated share',
    cue: '#f2b8a2',
    href: '/chronobiobank',
  },
  {
    id: 'evidence',
    badge: 'Evidence',
    title: 'Published science',
    teaser: 'Chronotherapy trials we build on',
    cue: '#8b9cf8',
    href: '#evidence',
  },
] as const

export const SCIENCE_TRUST_CTA = {
  label: 'See the technology stack',
  href: '/technology',
} as const
