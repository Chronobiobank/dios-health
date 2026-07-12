/** /homekit — SRI-flagged cardio-metabolic risk → clinical Homekit test. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { SLEEP_SCORE } from '@/lib/brand/sleep-score'

export const HOMEKIT_RISK_META = {
  title: `Homekit · ${DEEPDOSE_NAME}`,
  description:
    'Your score flags high phenotype irregularity. Three nights at home with Homekit for a clearer rhythm baseline.',
} as const

export const HOMEKIT_RISK_INTRO = {
  title: 'High phenotype irregularity',
  lede: 'Your Sleep Regularity Index shows nights that swing off your phenotype rhythm. Homekit reads oxygen and breathing across three nights at home.',
} as const

export const HOMEKIT_RISK_POINTS = [
  {
    id: 'flag',
    title: 'Why this flagged',
    body: 'A mid or low SRI often means irregular nights relative to your chemical phenotype. Phone screening is a first pass — not a diagnosis.',
  },
  {
    id: 'nights',
    title: 'What Homekit does',
    body: SLEEP_SCORE.tiptraqHint,
  },
  {
    id: 'next',
    title: 'What you get',
    body: 'A stronger rhythm baseline on your profile, clearer chemistry to share, and a signal you can take to a clinician if needed.',
  },
] as const

export const HOMEKIT_RISK_CTA = {
  primary: { label: 'Order Homekit', href: '/testkit' },
  secondary: { label: 'How Homekit works', href: '/tiptraq' },
} as const

/** Profile diagnostic tile — phenotype irregularity + Homekit CTA pill. */
export const HOMEKIT_RISK_TILE = {
  title: 'High phenotype irregularity',
  body: 'Our 3-night sleep test reads oxygen and breathing at home — a clearer check on nights that drift off your phenotype rhythm.',
  cta: 'Get clinical test',
  href: '/homekit',
} as const
