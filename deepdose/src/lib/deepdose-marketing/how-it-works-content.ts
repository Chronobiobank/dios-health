import {
  DEEPDOSE_NAME,
  DEEPDOSE_LOOP_CAPTION,
  DEEPDOSE_PROMISE,
} from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_VOICE } from '@/lib/brand/deepdose-voice'

/** Make chemistry work — Screen → Score → Share → Sync. */

export const HOW_IT_WORKS_META = {
  title: `Make chemistry work · ${DEEPDOSE_NAME}`,
  description: DEEPDOSE_VOICE.homeLede,
} as const

export const HOW_IT_WORKS_INTRO = {
  title: 'Make chemistry work',
} as const

/**
 * Consumer loop — Screen → Score → Share → Sync (build order).
 * Retention weight: Sync > Share > Score > Screen.
 * `lead` is the verb that pops black; `rest` stays grey.
 */
export const HOW_IT_WORKS_STEPS = [
  {
    id: 'screen',
    badge: '1',
    lead: 'Screen',
    rest: 'your phenotype',
    teaser:
      'Screen is plumbing — passive phone sensors calculate your phenotype so matching works without you opening an app for sensors.',
    cue: '#0f172a',
    href: '/',
  },
  {
    id: 'score',
    badge: '2',
    lead: 'Score',
    rest: 'your chemistry',
    teaser:
      'Score is your chemical phenotype profile — circadian stability, energy pattern, social window — ownership, not a diagnosis.',
    cue: '#0f172a',
    href: '/profile',
  },
  {
    id: 'share',
    badge: '3',
    lead: 'Share',
    rest: 'your doses',
    teaser:
      'Dose into a phenotype feed — Wolf, Lion, Bear, or Dolphin — peers who live your chemistry.',
    cue: '#0f172a',
    href: '/dose',
  },
  {
    id: 'sync',
    badge: '4',
    lead: 'Sync',
    rest: 'with others',
    teaser:
      'Sync is why you return — who is online in your biological window, and the moment you think: these are my people.',
    cue: '#0f172a',
    href: '/connect',
  },
] as const

export const HOW_IT_WORKS_CAPTION = DEEPDOSE_LOOP_CAPTION

export const HOW_IT_WORKS_PHENOTYPES = {
  title: 'Know Your Phenotype',
  lede: DEEPDOSE_PROMISE,
  /** Two-line bodies — ~48–50 chars so larger type never wraps to three or ellipsizes. */
  items: [
    {
      id: 'night_creator' as const,
      label: 'Wolf',
      body: 'Peaks evenings and nights. Creative after dark.',
    },
    {
      id: 'early_explorer' as const,
      label: 'Lion',
      body: 'Peaks early morning. Active, connected at dawn.',
    },
    {
      id: 'twilight_transformer' as const,
      label: 'Bear',
      body: 'Peaks afternoon evenings. Flexible as day shifts.',
    },
    {
      id: 'pulse_shifter' as const,
      label: 'Dolphin',
      body: 'Peaks on odd clocks. Built for shift work, travel.',
    },
  ],
} as const

export const HOW_IT_WORKS_FOUNDING = {
  title: DEEPDOSE_VOICE.foundingMembers.label,
  body: DEEPDOSE_VOICE.foundingMembers.lede,
} as const

/**
 * Why this exists — everyday words, no product jargon in titles.
 * Speak to chrono-atypical tribes (late nights, shift clocks, odd hours).
 * Each tile links to its conversion surface (connect or Homekit).
 * Labels = 11 chars; bodies = 66 chars so the three tiles read even.
 */
export const HOW_IT_WORKS_WHY = {
  title: 'Why Deepdose?',
} as const

export const HOW_IT_WORKS_STORY = [
  {
    id: 'pain',
    label: 'Your people',
    body: 'Late nights and shift clocks — not another 9-to-5 dating face app.',
    href: '/connect',
    cta: 'Find your people',
  },
  {
    id: 'solution',
    label: "Who's awake",
    body: "See who's awake when you are — real chemistry match, nowhere else.",
    href: '/connect',
    cta: "See who's up",
  },
  {
    id: 'care',
    label: 'Home nights',
    body: 'Three nights at home — prove your clock and catch early apnea risk.',
    href: '/testkit',
    cta: 'Get a Homekit',
  },
] as const

/** Dual conversion — members + sleep-test seekers. */
export const HOW_IT_WORKS_CTAS = [
  { label: 'Find Your Sync', href: '/connect' },
  { label: 'Get a Homekit', href: '/testkit' },
] as const

export const HOW_IT_WORKS_CTA = HOW_IT_WORKS_CTAS[0]
