import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** How it works — three steps anyone can get in seconds. */

export const HOW_IT_WORKS_META = {
  title: `How it works · ${DEEPDOSE_NAME}`,
  description:
    'Log Light, Meds, or Move. Get a sleep score. Sync with people on your clock.',
} as const

export const HOW_IT_WORKS_INTRO = {
  title: 'How it works',
} as const

export const HOW_IT_WORKS_STEPS = [
  {
    id: 'log',
    badge: '1',
    title: 'Log a dose',
    teaser: 'Snap Light, Meds, or Move — daylight, pills, or a walk.',
    cue: '#f5e74a',
    href: '/dose',
  },
  {
    id: 'score',
    badge: '2',
    title: 'Get your sleep score',
    teaser: 'See how locked your nights are — out of 100.',
    cue: '#acd3de',
    href: '/bank',
  },
  {
    id: 'sync',
    badge: '3',
    title: 'Sync the Grid',
    teaser: 'Share with Larks and Owls on your clock.',
    cue: '#ff5a5a',
    href: '/grid',
  },
] as const

export const HOW_IT_WORKS_CTA = {
  label: 'Start free',
  href: '/',
} as const
