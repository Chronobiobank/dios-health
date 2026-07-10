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
    'Free for dosers to log doses on the Grid. TipTraQ when you want a deeper sleep read.',
} as const

export const MEMBERSHIP_PAGE_INTRO = {
  eyebrow: 'Membership',
  titleWhite: 'Free forever.',
  titleAccent: 'Upgrade for more.',
  lede:
    'Log doses. Sync the Grid. TipTraQ when you want a stronger sleep read.',
} as const

/** USD for the global Manjam-first cohort. */
export const MEMBERSHIP_TIERS: readonly MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    cue: '#acd3de',
    figure: '$0',
    cadence: 'Phone & wearable',
    note: 'For dosers — log and sync on the Grid.',
    cta: { label: 'Start free', href: '/' },
    includes: [
      'Daily PMK doses on the Grid',
      'Dosers on your clock',
      'Optional research share only',
    ],
  },
  {
    id: 'testkit',
    name: 'Testkit',
    cue: '#c9b6f2',
    figure: '$149',
    cadence: 'Three nights at home',
    note: 'TipTraQ nights for a stronger SRI to stamp.',
    cta: { label: 'Order Testkit', href: '/testkit' },
    includes: [
      'Reusable sensor for 3 nights',
      'Stronger sleep and rhythm read',
      'Clearer score on your doses',
    ],
  },
  {
    id: 'reread',
    name: 'Re-read',
    cue: '#f2b8a2',
    figure: '$99',
    cadence: 'Every three months',
    note: 'Fresh TipTraQ nights so your doses stay honest.',
    cta: { label: 'Order re-read', href: '/testkit' },
    includes: [
      'Same reusable TipTraQ sensor',
      'Updated sleep read each quarter',
      'Catch drift before you stamp stale scores',
    ],
  },
] as const
