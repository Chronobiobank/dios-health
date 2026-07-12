/** /founders — Manjam cohort landing. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const FOUNDERS_PAGE_META = {
  title: `Founders · ${DEEPDOSE_NAME}`,
  description:
    'Welcome back Manjam community members. Real connections rebuilt around your actual chemistry — claim free founder access.',
} as const

export const FOUNDERS_INTRO = {
  title: 'Welcome Back Manjam Community Members',
  lede: 'We took everything we loved about real connections — and rebuilt it around your actual chemistry. As a Founding Member you get:',
} as const

export const FOUNDERS_PRIMARY_CTA = {
  label: 'Deepdose in Action',
  href: '/connect',
} as const

export const FOUNDERS_JOIN_META = {
  title: `Join · Founders · ${DEEPDOSE_NAME}`,
  description:
    'Enter your meds, create a free account, and open your phenotype profile.',
} as const

export const FOUNDERS_JOIN = {
  medTitle: 'Let our AI map your phenotype in seconds',
  submitLabel: 'Create free account',
} as const

/**
 * Founder perks — 2×2 spectrum tiles.
 * Short stake titles + one informative body; cue = border/wash only.
 */
export const FOUNDERS_PERKS = {
  items: [
    {
      id: 'lifetime',
      title: 'Free for life',
      body: 'Core features stay free — no paywall on the basics.',
      cue: '#acd3de',
    },
    {
      id: 'priority',
      title: 'First in line',
      body: 'New product drops hit founders first — before the open list.',
      cue: '#c9b6f2',
    },
    {
      id: 'homekit',
      title: 'Founder Homekit',
      body: 'Founder rates on your first Homekit and every re-read after.',
      cue: '#f2b8a2',
    },
    {
      id: 'channel',
      title: 'Private channel',
      body: 'Private founder chat — early say on what we build next.',
      cue: '#8b9cf8',
    },
  ],
} as const

export const FOUNDERS_CLOSE = {
  cta: FOUNDERS_PRIMARY_CTA,
} as const
