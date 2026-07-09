/** TipTraQ Testkit · consumer page at /testkit */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const TESTKIT_META = {
  title: `Testkit · ${DEEPDOSE_NAME}`,
  description:
    'Three nights at home with TipTraQ. For atypical folk whose sleep and meds never fit a clinic clock. Your clinician adds the read; Deepdose shows clearer dose windows.',
} as const

export const TESTKIT_INTRO = {
  eyebrow: 'Testkit',
  titleWhite: 'Three nights.',
  titleAccent: 'Clearer timing.',
  lede: `Odd hours and stacked meds need a stronger read than a phone alone. Wear TipTraQ at home for three nights. Your clinician adds the results. ${DEEPDOSE_NAME} turns them into clearer windows for light, meals, meds, movement, and sleep.`,
} as const

export const TESTKIT_KIT = {
  eyebrow: 'The kit',
  title: 'One sensor. Three nights at home.',
  lede:
    'Soft finger sensor, charging case, and app. Built for real nights, not a clinic bed. Your clinician gets a read they can trust.',
  includes: [
    'Reusable sensor and home setup',
    'Three nights of sleep and breathing data',
    'Clinic-ready sleep staging',
    'Results that feed your dose plan in Deepdose',
  ],
} as const

export const TESTKIT_STEPS = [
  {
    id: 'order',
    rank: 1,
    label: 'Order',
    cue: '#acd3de',
    title: 'When your GP suggests it',
    body: 'Order TipTraQ after your GP advises a home sleep check. No clinic overnight. No waiting list.',
  },
  {
    id: 'wear',
    rank: 2,
    label: 'Wear',
    cue: '#c9b6f2',
    title: 'Three nights in your own bed',
    body: 'Wear the soft finger sensor. It records oxygen, breathing, and sleep while you keep your usual hours.',
  },
  {
    id: 'review',
    rank: 3,
    label: 'Review',
    cue: '#f2b8a2',
    title: 'Your clinician adds the read',
    body: `Your clinician reviews the nights and sets a stronger body-clock baseline in ${DEEPDOSE_NAME}.`,
  },
  {
    id: 'plan',
    rank: 4,
    label: 'Plan',
    cue: '#8b9cf8',
    title: 'See your best times',
    body: 'Your dashboard shows clearer windows for light, meals, meds, movement, and sleep.',
  },
] as const

export const TESTKIT_CTA = {
  primary: { label: 'How the kit works', href: '/tiptraq' },
  secondary: { label: 'Know my risk', href: '/profile' },
} as const
