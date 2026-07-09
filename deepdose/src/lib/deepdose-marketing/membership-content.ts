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
    'Free forever. TipTraQ Testkit when you and your GP want a stronger sleep read.',
} as const

export const MEMBERSHIP_PAGE_INTRO = {
  eyebrow: 'Membership',
  titleWhite: 'Free forever.',
  titleAccent: 'Upgrade for more.',
  lede:
    'Phone estimate first. TipTraQ when your GP wants a clinic-grade read. Built for atypical folk with odd hours and stacked meds.',
} as const

/** USD for the global Manjam-first cohort. */
export const MEMBERSHIP_TIERS: readonly MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    cue: '#acd3de',
    figure: '$0',
    cadence: 'Phone & wearable',
    note: 'Dose windows from your phone for odd hours.',
    cta: { label: 'Start free', href: '/login' },
    includes: [
      'Dose windows from your phone',
      'Connect with others like you',
      'Optional research share only',
    ],
  },
  {
    id: 'testkit',
    name: 'Testkit',
    cue: '#c9b6f2',
    figure: '$149',
    cadence: 'Three nights at home',
    note: 'Clinic TipTraQ nights for stronger windows.',
    cta: { label: 'Order Testkit', href: '/testkit' },
    includes: [
      'Reusable sensor for 3 nights',
      'A clinic-checked sleep badge',
      'Stronger med windows for you',
    ],
  },
  {
    id: 'reread',
    name: 'Re-read',
    cue: '#f2b8a2',
    figure: '$99',
    cadence: 'Every three months',
    note: 'Fresh TipTraQ nights to keep plan on track.',
    cta: { label: 'Order re-read', href: '/testkit' },
    includes: [
      'Same reusable TipTraQ sensor',
      'Updated windows each quarter',
      'Catch drift before labs show',
    ],
  },
] as const
