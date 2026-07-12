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
    'Free to log doses. TipTraQ when you want a deeper phenotype read.',
} as const

export const MEMBERSHIP_PAGE_INTRO = {
  title: 'Free forever.',
  lede: `${DEEPDOSE_VOICE.promise} TipTraQ when you want a stronger phenotype read.`,
} as const

export const MEMBERSHIP_FOUNDING = {
  title: DEEPDOSE_VOICE.foundingMembers.label,
  body: DEEPDOSE_VOICE.foundingMembers.lede,
} as const

/** USD for the global Manjam founding cohort. */
export const MEMBERSHIP_TIERS: readonly MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    cue: '#acd3de',
    figure: '$0',
    cadence: 'Phone & wearable',
    note: 'Log doses and sync with people on your chemistry.',
    cta: { label: 'Find Your Sync', href: '/connect' },
    includes: [
      'Daily doses in your feed',
      'People on your chemical phenotype',
      'Optional research share only',
    ],
  },
  {
    id: 'testkit',
    name: 'Testkit',
    cue: '#c9b6f2',
    figure: '$149',
    cadence: 'Three nights at home',
    note: 'TipTraQ nights for a stronger phenotype score.',
    cta: { label: 'Order Testkit', href: '/testkit' },
    includes: [
      'Reusable sensor for 3 nights',
      'Stronger chemical phenotype read',
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
      'Updated phenotype read each quarter',
      'Catch drift before old scores go stale',
    ],
  },
] as const
