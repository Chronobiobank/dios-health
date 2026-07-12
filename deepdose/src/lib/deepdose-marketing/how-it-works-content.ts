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
  /** Two-line bodies — keep at 55–56 chars so tiles never ellipsize. */
  items: [
    {
      id: 'night_creator' as const,
      label: 'Wolf',
      body: 'Peaks evenings and nights. Creative, social after dark.',
    },
    {
      id: 'early_explorer' as const,
      label: 'Lion',
      body: 'Peaks early morning. Active and connected at first dawn.',
    },
    {
      id: 'twilight_transformer' as const,
      label: 'Bear',
      body: 'Peaks afternoon to evenings. Flexible as the day shifts.',
    },
    {
      id: 'pulse_shifter' as const,
      label: 'Dolphin',
      body: 'Peaks on irregular clocks. Built for shift work, travel.',
    },
  ],
} as const

export const HOW_IT_WORKS_FOUNDING = {
  title: DEEPDOSE_VOICE.foundingMembers.label,
  body: DEEPDOSE_VOICE.foundingMembers.lede,
} as const

/**
 * Why this exists — exclusive / innovative / world-first.
 * Speak to chrono-atypical tribes (Manjam nights, shift clocks, late peaks).
 * Keep bodies ~67–68 chars so the three tiles read even.
 */
export const HOW_IT_WORKS_WHY = {
  title: 'Why Deepdose?',
} as const

export const HOW_IT_WORKS_STORY = [
  {
    id: 'pain',
    label: 'Exclusive',
    body: 'Manjam nights and shift clocks — not another 9-to-5 dating face app.',
  },
  {
    id: 'solution',
    label: 'Only Sync',
    body: 'Sync finds who’s awake with you. Chemistry matching — nowhere else.',
  },
  {
    id: 'care',
    label: 'Homekit',
    body: 'World-first: prove phenotype at home and screen early apnea risk.',
  },
] as const

export const HOW_IT_WORKS_CTA = {
  label: 'Find Your Sync',
  href: '/connect',
} as const
