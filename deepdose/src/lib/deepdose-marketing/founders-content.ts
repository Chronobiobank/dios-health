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
  label: 'Reconnect Now',
  href: '/founders/join',
} as const

export const FOUNDERS_JOIN_META = {
  title: `Join · Founders · ${DEEPDOSE_NAME}`,
  description:
    'Claim free lifetime founder access — email, password, and two meds to baseline your profile.',
} as const

export const FOUNDERS_JOIN = {
  title: 'Claim free lifetime access',
  lede: 'Two meds set your chemistry baseline. Then your profile.',
  medsLabel: 'Your baseline',
  authLabel: 'Create your account',
  submitLabel: 'Claim free lifetime access',
} as const

/**
 * Founder perks — 2×2 tiles.
 * Titles = 15 chars; bodies = 60 chars so the four tiles read even.
 */
export const FOUNDERS_PERKS = {
  items: [
    {
      id: 'lifetime',
      title: 'Lifetime access',
      body: 'Core features stay free for life — no paywall on the basics.',
    },
    {
      id: 'priority',
      title: 'Priority access',
      body: 'New product drops hit founders first — before the open list.',
    },
    {
      id: 'homekit',
      title: 'Homekit pricing',
      body: 'Founder rates on your first Homekit and every re-read after.',
    },
    {
      id: 'channel',
      title: 'Founder channel',
      body: 'Private founder chat — early say on what we build next here.',
    },
  ],
} as const

export const FOUNDERS_CLOSE = {
  cta: FOUNDERS_PRIMARY_CTA,
} as const
