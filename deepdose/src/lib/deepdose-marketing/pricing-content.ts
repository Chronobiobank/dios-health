/** Pricing page — intro, tiers, footer CTA. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { TIPTRAQ_STUDY_PRICING_UK } from '@/lib/clinical/tiptraq-program'

export type PricingTier = {
  id: string
  name: string
  figure: string
  cadence: string
  note: string
  cue?: string
  flag?: string
  feature?: boolean
  cta: { label: string; href: string }
  includes: readonly string[]
}

export const PRICING_PAGE_META = {
  title: `Pricing · ${DEEPDOSE_NAME}`,
  description:
    'Start free with a body-clock baseline from your phone and wearables, or order a TipTraQ home sleep test with quarterly clinical re-reads.',
} as const

export const PRICING_PAGE_INTRO = {
  eyebrow: 'Pricing',
  titleWhite: 'Simple, honest',
  titleAccent: 'pricing',
  lede:
    'Start free with a body-clock estimate from your phone and wearables. Upgrade to a clinical TipTraQ read when your clinician recommends it.',
} as const

export const PRICING_PAGE_CTA = {
  label: 'How the home test works',
  href: '/tiptraq',
  note: 'Order on the advice of your GP — no clinic visit, no waiting list.',
} as const

export function buildPricingTiers(baseline: string, quarterly: string): PricingTier[] {
  return [
    {
      id: 'dlmo-baseline',
      name: 'Body clock baseline',
      cue: '#acd3de',
      figure: 'Free',
      cadence: 'Phone & wearable data',
      note: 'Body-clock estimate from your phone and wearables — at no cost.',
      flag: 'Start here',
      feature: true,
      cta: { label: 'Start free', href: '/login' },
      includes: [
        'Body-clock estimate from your phone and wearable data',
        'Personalised dosing windows on your dashboard',
        'Contributes to our chronotherapy research',
        'Upgrade to a clinical-grade reading anytime',
      ],
    },
    {
      id: 'clinical-baseline',
      name: 'Clinical sleep test',
      cue: '#c9b6f2',
      figure: baseline,
      cadence: 'TipTraQ kit · three nights',
      note: 'Three nights at home for a clinical body-clock read and verified data badge.',
      cta: { label: 'Order your test', href: '/home-test' },
      includes: [
        ...TIPTRAQ_STUDY_PRICING_UK.includes,
        'Personalised dosing windows on your dashboard',
        'Verified clinical-grade data badge on your record',
        'Contributes to our chronotherapy research',
      ],
    },
    {
      id: 'quarterly',
      name: 'Quarterly re-read',
      cue: '#f2b8a2',
      figure: quarterly,
      cadence: 'Every three months',
      note: 'A clinical TipTraQ re-read every quarter to keep your plan accurate.',
      cta: { label: 'Order a re-read', href: '/home-test' },
      includes: [
        'Re-order the reusable TipTraQ kit every three months',
        'Fresh clinical body-clock and chronotype read',
        'Catches circadian drift before it shows in labs',
        'Contributes to our chronotherapy research',
      ],
    },
  ]
}
