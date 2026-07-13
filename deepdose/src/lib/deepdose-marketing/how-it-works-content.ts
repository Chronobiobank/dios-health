import {
  DEEPDOSE_LOOP_CAPTION,
  DEEPDOSE_PROMISE,
} from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_VOICE } from '@/lib/brand/deepdose-voice'

/** Make chemistry work — Screen → Score → Share → Sync. */

export const HOW_IT_WORKS_META = {
  title: 'How',
  description: DEEPDOSE_VOICE.homeLede,
} as const

export const HOW_IT_WORKS_INTRO = {
  title: 'How Deepdose Works',
} as const

/** Scene tile behind the How loop — moody torso video. */
export const HOW_IT_WORKS_SCENE = {
  image: {
    type: 'video' as const,
    src: '/moody-torso.mp4',
    alt: 'Moody torso in soft light — chemistry that connects',
    playbackRate: 0.35,
  },
  objectPosition: 'center 28%',
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
    rest: 'your clock',
    teaser:
      'Screen is plumbing — passive phone sensors calculate your chronotype so matching works without you opening an app for sensors.',
    cue: '#0f172a',
    href: '/',
  },
  {
    id: 'score',
    badge: '2',
    lead: 'Score',
    rest: 'your type',
    teaser:
      'Score is your chemical chronotype profile — circadian stability, energy pattern, social window — ownership, not a diagnosis.',
    cue: '#0f172a',
    href: '/profile',
  },
  {
    id: 'share',
    badge: '3',
    lead: 'Share',
    rest: 'your dose',
    teaser:
      'Dose into a chronotype feed — Wolf, Lion, Bear, or Dolphin — peers who live your chemistry.',
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
  title: 'Know Your Chronotype',
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
 * Why clocks matter — social jet lag story (illustrative pair).
 * Research: Risner, Katz & Stamoulis, SLEEP (2025) — ABCD cohort SJL × brain structure/networks.
 */
export const HOW_IT_WORKS_WHY = {
  title: 'Why Clocks Matter',
  brain: {
    scans: [
      {
        id: 'aligned',
        label: 'ALIGNED',
        src: '/research/sjl-aligned-clock.png',
        alt: 'Illustrative brain scan: aligned weekday–weekend sleep timing',
      },
      {
        id: 'social-jetlag',
        label: 'SOCIAL JET LAG',
        src: '/research/sjl-social-jetlag.png',
        alt: 'Illustrative brain scan: social jet lag — misaligned weekday vs weekend clock',
      },
    ],
    lede: 'When your body clock drifts between weekdays and weekends — social jet lag — emotion and focus networks quiet down',
    credit: {
      text: 'Illustrative pair. Research:',
      hrefs: [
        {
          label: 'Risner et al., SLEEP (2025)',
          href: 'https://doi.org/10.1093/sleep/zsaf392',
        },
      ],
    },
  },
} as const

/** Manjam cohort — land on founders pitch. */
export const HOW_IT_WORKS_CTAS = [
  { label: 'Deepdose in Action', href: '/founders' },
] as const

export const HOW_IT_WORKS_CTA = HOW_IT_WORKS_CTAS[0]
