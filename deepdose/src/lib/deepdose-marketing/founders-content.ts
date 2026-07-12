/** /founders — Manjam cohort landing. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const FOUNDERS_PAGE_META = {
  title: `Founders · ${DEEPDOSE_NAME}`,
  description:
    'Hey, Manjam member. Join Deepdose — a new kind of social network focused on human chemistry.',
} as const

export const FOUNDERS_INTRO = {
  title: 'Hey, Manjam member!',
  lede: 'Join Deepdose — a new kind of social network focused on human chemistry.',
} as const

export const FOUNDERS_PRIMARY_CTA = {
  label: 'See Deepdose in Action',
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
 * Founder perks — 2×2 spectrum tiles. Titles only; vanity stake lives in the welcome lede.
 */
export const FOUNDERS_PERKS = {
  items: [
    {
      id: 'lifetime',
      title: 'Free for life',
      cue: '#acd3de',
    },
    {
      id: 'priority',
      title: 'First in line',
      cue: '#c9b6f2',
    },
    {
      id: 'homekit',
      title: 'Founder Homekit',
      cue: '#f2b8a2',
    },
    {
      id: 'channel',
      title: 'Private channel',
      cue: '#8b9cf8',
    },
  ],
} as const

export const FOUNDERS_CLOSE = {
  cta: FOUNDERS_PRIMARY_CTA,
} as const
