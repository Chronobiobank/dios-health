import {
  DEEPDOSE_NAME,
  DEEPDOSE_LOOP_CAPTION,
  DEEPDOSE_PROMISE,
} from '@/lib/brand/deepdose-brand'
import { CHEMICAL_PHENOTYPES } from '@/lib/brand/chemical-phenotypes'
import { DEEPDOSE_VOICE } from '@/lib/brand/deepdose-voice'

/** How it works — Screen → Score → Share → Sync. */

export const HOW_IT_WORKS_META = {
  title: `How it works · ${DEEPDOSE_NAME}`,
  description: DEEPDOSE_VOICE.homeLede,
} as const

export const HOW_IT_WORKS_INTRO = {
  title: 'How it works',
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
      'Screen is plumbing — passive phone sensors calculate your chemical phenotype so matching works without you opening an app for sensors.',
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
    href: '/bank',
  },
  {
    id: 'share',
    badge: '3',
    lead: 'Share',
    rest: 'your doses',
    teaser:
      'Dose into a phenotype feed — Night Creator, Early Explorer, Twilight Transformer, or Pulse Shifter — peers who live your chemistry.',
    cue: '#0f172a',
    href: '/dose',
  },
  {
    id: 'sync',
    badge: '4',
    lead: 'Sync',
    rest: 'your people',
    teaser:
      'Sync is why you return — who is online in your biological window, and the moment you think: these are my people.',
    cue: '#0f172a',
    href: '/connect',
  },
] as const

export const HOW_IT_WORKS_CAPTION = DEEPDOSE_LOOP_CAPTION

export const HOW_IT_WORKS_PHENOTYPES = {
  title: 'Chemical phenotypes',
  lede: DEEPDOSE_PROMISE,
  items: CHEMICAL_PHENOTYPES.map((p) => ({
    id: p.id,
    label: p.label,
    peak: p.peak,
    expression: p.expression,
  })),
} as const

export const HOW_IT_WORKS_FOUNDING = {
  title: DEEPDOSE_VOICE.foundingMembers.label,
  body: DEEPDOSE_VOICE.foundingMembers.lede,
} as const

/**
 * Why this exists — one title + three short story tiles.
 * Flow: pain → what we do → why you should care.
 */
export const HOW_IT_WORKS_WHY = {
  title: 'Why Deepdose?',
} as const

export const HOW_IT_WORKS_STORY = [
  {
    id: 'pain',
    label: 'Pain',
    body: 'Generic social apps match faces and leave off-schedule lives behind. Health apps show scores and leave you alone.',
  },
  {
    id: 'solution',
    label: 'What we do',
    body: 'Chemical phenotypes power the graph. Sync finds who is awake in your window. Share and Score give the tribe glue and status.',
  },
  {
    id: 'care',
    label: 'Why care',
    body: 'Attraction, recognition, belonging — the moment you think “these are my people” is the retention engine.',
  },
] as const

export const HOW_IT_WORKS_CTA = {
  label: 'Find Your Sync',
  href: '/connect',
} as const
