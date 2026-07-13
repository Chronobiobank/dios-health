/** /founders — Manjam cohort landing. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const FOUNDERS_PAGE_META = {
  title: `Founders · ${DEEPDOSE_NAME}`,
  description:
    'Hey, Manjam member. We invite you to join Deepdose — a social network for non-conformers and circadian matching.',
} as const

export const FOUNDERS_INTRO = {
  title: 'Welcome back member!',
  quote:
    'We invite you to Deepdose: the next chapter from the Manjam team. A social network for non-conformers built around your body clock and real compatibility',
  quoteName: 'Manjam team',
  quoteRole: '',
} as const

export const FOUNDERS_CTAS = [
  { label: 'Sign Up', href: '/founders/join' },
  { label: 'Order Sleep Test', href: '/testkit' },
] as const

/** @deprecated Prefer FOUNDERS_CTAS[0] */
export const FOUNDERS_CTA = FOUNDERS_CTAS[0]

export const FOUNDERS_JOIN_META = {
  title: `Join · Founders · ${DEEPDOSE_NAME}`,
  description:
    'Enter your meds, create a free account, and open your chronotype profile.',
} as const

export const FOUNDERS_JOIN = {
  medTitle: 'Let our AI map your chronotype in seconds',
  submitLabel: 'Create free account',
} as const
