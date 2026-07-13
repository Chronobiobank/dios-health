/** /founders — Manjam cohort landing. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const FOUNDERS_PAGE_META = {
  title: `Founders · ${DEEPDOSE_NAME}`,
  description:
    'Hey, Manjam member. We invite you to join Deepdose — a social network for non-conformers and circadian matching.',
} as const

export const FOUNDERS_INTRO = {
  title: 'Hey, Manjam member!',
  quote:
    'We invite you to Deepdose: the next chapter from the Manjam team. A social network for non-conformers built around your body clock and real compatibility',
  quoteName: 'Manjam team',
  quoteRole: '',
} as const

export const FOUNDERS_CTA = {
  label: 'Claim my Free account',
  href: '/founders/join',
} as const

export const FOUNDERS_JOIN_META = {
  title: `Join · Founders · ${DEEPDOSE_NAME}`,
  description:
    'Enter your meds, create a free account, and open your phenotype profile.',
} as const

export const FOUNDERS_JOIN = {
  medTitle: 'Let our AI map your phenotype in seconds',
  submitLabel: 'Create free account',
} as const
