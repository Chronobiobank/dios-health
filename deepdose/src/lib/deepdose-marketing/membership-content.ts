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
    'Free to sleepmaxx and post today’s Real. TipTraQ when you want a deeper sleep read.',
} as const

export const MEMBERSHIP_PAGE_INTRO = {
  eyebrow: 'Membership',
  titleWhite: 'Free forever.',
  titleAccent: 'Upgrade for more.',
  lede:
    'Post today’s Real. See friends on your clock. TipTraQ when you want a stronger sleep read.',
} as const

/** USD for the global Manjam-first cohort. */
export const MEMBERSHIP_TIERS: readonly MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    cue: '#acd3de',
    figure: '$0',
    cadence: 'Phone & wearable',
    note: 'Sleepmaxx and share today’s Real.',
    cta: { label: 'Start free', href: '/' },
    includes: [
      'Daily Real — photo plus SRI',
      'Friends on your clock',
      'Optional research share only',
    ],
  },
  {
    id: 'testkit',
    name: 'Testkit',
    cue: '#c9b6f2',
    figure: '$149',
    cadence: 'Three nights at home',
    note: 'TipTraQ nights for a stronger SRI to share.',
    cta: { label: 'Order Testkit', href: '/testkit' },
    includes: [
      'Reusable sensor for 3 nights',
      'Stronger sleep and rhythm read',
      'Clearer score on your Real',
    ],
  },
  {
    id: 'reread',
    name: 'Re-read',
    cue: '#f2b8a2',
    figure: '$99',
    cadence: 'Every three months',
    note: 'Fresh TipTraQ nights so your Real stays honest.',
    cta: { label: 'Order re-read', href: '/testkit' },
    includes: [
      'Same reusable TipTraQ sensor',
      'Updated sleep read each quarter',
      'Catch drift before you post stale scores',
    ],
  },
] as const
