import { DEEPDOSE_NAME, DEEPDOSE_MOVEMENT } from '@/lib/brand/deepdose-brand'

/** How it works — DeepDose UX: Score → Plan → Boost → Find. */

export const HOW_IT_WORKS_META = {
  title: `Why Medmaxxing? · ${DEEPDOSE_NAME}`,
  description: `${DEEPDOSE_MOVEMENT}. For people off the usual clock — score sleep, plan what you take, find people on your rhythm.`,
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
    teaser: 'Find your chronomatch — people whose clock and timing fit yours.',
    cue: '#e04545',
    href: '/grid',
  },
] as const

export const HOW_IT_WORKS_CAPTION = 'Score. Plan. Boost. Find.' as const

/**
 * Why Medmaxxing — one title + three short story tiles.
 * Flow: pain → what we do → why you should care.
 */
export const HOW_IT_WORKS_WHY = {
  title: 'Why Medmaxxing?',
} as const

export const HOW_IT_WORKS_STORY = [
  {
    id: 'pain',
    label: 'Pain',
    body: 'Old apps matched faces. People off a 9-to-5 clock got left behind.',
  },
  {
    id: 'solution',
    label: 'What we do',
    body: 'We match nights. Score sleep. Plan what you take. Find people on your rhythm.',
  },
  {
    id: 'care',
    label: 'Why care',
    body: 'First invite goes to early Manjam members — real connection around sleep, timing, and chemistry.',
  },
] as const

export const HOW_IT_WORKS_CTA = {
  label: 'Start free',
  href: '/',
} as const
