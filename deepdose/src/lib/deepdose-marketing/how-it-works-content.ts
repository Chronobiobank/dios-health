import { DEEPDOSE_NAME, DEEPDOSE_MOVEMENT } from '@/lib/brand/deepdose-brand'

/** How it works — DeepDose UX: Score → Plan → Boost → Find. */

export const HOW_IT_WORKS_META = {
  title: `${DEEPDOSE_MOVEMENT} · ${DEEPDOSE_NAME}`,
  description: `${DEEPDOSE_MOVEMENT}. Score your sleep routine, plan your meds/supps, boost your chemistry, find your chronomatch.`,
} as const

export const HOW_IT_WORKS_INTRO = {
  title: DEEPDOSE_MOVEMENT,
} as const

/**
 * DeepDose UX loop — Score → Plan → Boost → Find.
 * `lead` is the verb that pops black; `rest` stays grey.
 */
export const HOW_IT_WORKS_STEPS = [
  {
    id: 'score',
    badge: '1',
    lead: 'Score',
    rest: 'your sleep routine',
    teaser: 'Score your sleep routine — each night locks a sleep score out of 100.',
    cue: '#3d8fa0',
    href: '/bank',
  },
  {
    id: 'plan',
    badge: '2',
    lead: 'Plan',
    rest: 'your meds/supps',
    teaser: 'Plan your meds/supps — time what you take so it fits your clock.',
    cue: '#e8c41a',
    href: '/dose',
  },
  {
    id: 'chemistry',
    badge: '3',
    lead: 'Boost',
    rest: 'your chemistry',
    teaser: 'Boost your chemistry — tune what you take until it works for your clock.',
    cue: '#e8a54a',
    href: '/',
  },
  {
    id: 'match',
    badge: '4',
    lead: 'Find',
    rest: 'your chronomatch',
    teaser: 'Find your chronomatch — people whose clock and stack line up with yours.',
    cue: '#e04545',
    href: '/grid',
  },
] as const

export const HOW_IT_WORKS_CAPTION = 'Score. Plan. Boost. Find.' as const

/**
 * Short “why” under the orbit — shared title/lede system.
 * Invite for the first ex-Manjam members. No street slang.
 */
export const HOW_IT_WORKS_WHY = {
  title: 'Why Medmaxxing?',
  lede:
    'Old apps matched faces. We match nights. For people who do not live on a 9-to-5 clock — score how you sleep, plan what you take, boost your chemistry, find people whose rhythm fits yours.',
  invite:
    'First invite goes to early Manjam members — same hunger for real connection, now built around sleep, timing, and chemistry.',
} as const

export const HOW_IT_WORKS_CTA = {
  label: 'Start free',
  href: '/',
} as const
