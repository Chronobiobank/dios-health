/** Membership page · three clear options. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_VOICE } from '@/lib/brand/deepdose-voice'

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
    'Free to log doses. Homekit when you want a deeper chronotype read.',
} as const

export const MEMBERSHIP_PAGE_INTRO = {
  title: 'Free forever.',
} as const

export const MEMBERSHIP_FOUNDING = {
  title: DEEPDOSE_VOICE.foundingMembers.label,
  body: DEEPDOSE_VOICE.foundingMembers.lede,
  cta: { label: 'Welcome Manjam founders', href: '/founders' },
} as const

/** USD for the global Manjam founding cohort. */
export const MEMBERSHIP_TIERS: readonly MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    cue: '#0f172a',
    figure: '$0',
    cadence: 'Phone & wearable',
    note: 'Log doses. Sync people on your chemistry.',
    cta: { label: 'Find Your Sync', href: '/connect' },
    includes: [
      'Daily doses in your feed',
      'People on your chemical chronotype',
      'Optional research share only',
    ],
  },
  {
    id: 'testkit',
    name: 'Homekit',
    cue: '#0f172a',
    figure: '$149',
    cadence: 'Three nights at home',
    note: 'Homekit nights for a stronger score.',
    cta: { label: 'Order Homekit', href: '/testkit' },
    includes: [
      'Reusable sensor for 3 nights',
      'Stronger chemical chronotype read',
      'Clearer score on your doses',
    ],
  },
  {
    id: 'reread',
    name: 'Re-read',
    cue: '#0f172a',
    figure: '$99',
    cadence: 'Every three months',
    note: 'Fresh Homekit nights keep doses honest.',
    cta: { label: 'Order re-read', href: '/testkit' },
    includes: [
      'Same reusable Homekit sensor',
      'Updated chronotype read each quarter',
      'Catch drift before old scores go stale',
    ],
  },
] as const
