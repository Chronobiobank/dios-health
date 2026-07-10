/** Membership page · three clear options. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export type MembershipTier = {
  id: string
  name: string
  figure: string
  cadence: string
  note: string
  cue?: string
  cta: { label: string; href: string }
  includes: readonly string[]
}

export const MEMBERSHIP_PAGE_META = {
  title: `Membership · ${DEEPDOSE_NAME}`,
  description:
    'Free forever to understand and share your chemistry. TipTraQ when you want a deeper sleep read.',
} as const

export const MEMBERSHIP_PAGE_INTRO = {
  eyebrow: 'Membership',
  titleWhite: 'Free forever.',
  titleAccent: 'Upgrade for more.',
  lede:
    'Understand your chemistry, share what you choose, and connect. Phone estimate first. TipTraQ when you want a stronger sleep read.',
} as const

/** USD for the global Manjam-first cohort. */
export const MEMBERSHIP_TIERS: readonly MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    cue: '#acd3de',
    figure: '$0',
    cadence: 'Phone & wearable',
    note: 'Understand your chemistry and share what you choose.',
    cta: { label: 'Start free', href: '/' },
    includes: [
      'Chemistry profile from your phone',
      'Connect and message people on your rhythm',
      'Optional research share only',
    ],
  },
  {
    id: 'testkit',
    name: 'Testkit',
    cue: '#c9b6f2',
    figure: '$149',
    cadence: 'Three nights at home',
    note: 'TipTraQ nights for a stronger chemistry baseline to share.',
    cta: { label: 'Order Testkit', href: '/testkit' },
    includes: [
      'Reusable sensor for 3 nights',
      'Stronger sleep and rhythm read',
      'Clearer chemistry details to share',
    ],
  },
  {
    id: 'reread',
    name: 'Re-read',
    cue: '#f2b8a2',
    figure: '$99',
    cadence: 'Every three months',
    note: 'Fresh TipTraQ nights so shared details stay current.',
    cta: { label: 'Order re-read', href: '/testkit' },
    includes: [
      'Same reusable TipTraQ sensor',
      'Updated chemistry read each quarter',
      'Catch drift before you share stale details',
    ],
  },
] as const
