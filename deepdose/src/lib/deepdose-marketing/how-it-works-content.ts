import { DEEPDOSE_NAME, DEEPDOSE_MOVEMENT, DEEPDOSE_TOKEN_ECONOMY } from '@/lib/brand/deepdose-brand'

/** How it works — Medmaxxing · Get in Flow. */

export const HOW_IT_WORKS_META = {
  title: `${DEEPDOSE_MOVEMENT} · ${DEEPDOSE_NAME}`,
  description: `${DEEPDOSE_MOVEMENT}. Max your med stack. ${DEEPDOSE_TOKEN_ECONOMY}`,
} as const

export const HOW_IT_WORKS_INTRO = {
  title: DEEPDOSE_MOVEMENT,
} as const

/**
 * Token economy: Get in Flow (verb + in/out state).
 * Max = the work · Score = the board · Flow = the hit.
 */
export const HOW_IT_WORKS_STEPS = [
  {
    id: 'max',
    badge: '1',
    title: 'Max',
    teaser: 'Max your med stack — stamp Resetters, Hijackers, Crossers, or Batteries.',
    cue: '#f5e74a',
    href: '/dose',
  },
  {
    id: 'score',
    badge: '2',
    title: 'Score',
    teaser: 'The board — nights lock when you stamp. Sleep score out of 100.',
    cue: '#acd3de',
    href: '/bank',
  },
  {
    id: 'flow',
    badge: '3',
    title: 'Flow',
    teaser: 'Get in Flow — the tribe answers. You’re in or you’re out.',
    cue: '#ff5a5a',
    href: '/grid',
  },
] as const

export const HOW_IT_WORKS_CTA = {
  label: 'Start free',
  href: '/',
} as const
