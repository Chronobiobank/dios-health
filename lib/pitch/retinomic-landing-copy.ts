/**
 * Retinomic Protocol — public landing copy (Dose Intelligence OS).
 * Mobile-first: short lines, plain English. Single source for hero + deck tiles.
 */

import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

export const RETINOMIC_LANDING_HERO = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'Stop guessing with wearables.',
  subheadline:
    'DIOS links your eye scan, blood results, and daily light — then shows what to do next.',
  ctaLabel: 'Free baseline scan',
  ctaHref: '/onboarding',
  signUpHref: '/auth/signup',
  secondaryCtaLabel: 'Clinician demo',
  secondaryCtaHref: '/signup/clinician',
} as const

export type RetinomicFeatureCopy = {
  id: string
  lead: string
  /** Shown from sm breakpoint up; keep lead alone on small phones */
  body: string
  image: string
  imageAlt: string
}

export const RETINOMIC_FEATURES_SECTION = {
  eyebrow: 'Retinomic Protocol',
  title: 'Four inputs. One plan.',
  primaryCtaLabel: 'Free baseline scan',
  primaryCtaHref: '/onboarding',
  secondaryCtaLabel: 'See demo',
  secondaryCtaHref: '/how-it-works',
} as const

export const RETINOMIC_LANDING_FEATURES: readonly RetinomicFeatureCopy[] = [
  {
    id: 'dios-engine',
    lead: 'Your light dose',
    body: 'Daily brightness and timing for your body clock.',
    image: PITCH_IMAGES.retinomic.lightDose,
    imageAlt: 'Your daily light dose plan',
  },
  {
    id: 'siloton',
    lead: 'Eye scan',
    body: 'Maps how your eye catches light.',
    image: PITCH_IMAGES.retinomic.eyeScan,
    imageAlt: 'Your retinomic eye scan',
  },
  {
    id: 'biochemical',
    lead: 'Blood fuel',
    body: 'Tracks vitamins linked to deep sleep.',
    image: PITCH_IMAGES.retinomic.bloodFuel,
    imageAlt: 'Your blood vitamin panel',
  },
  {
    id: 'tiptraq',
    lead: 'Sleep check',
    body: 'Checks if you actually recovered overnight.',
    image: PITCH_IMAGES.retinomic.sleepCheck,
    imageAlt: 'Your overnight sleep check',
  },
] as const

export const RETINOMIC_LANDING_PHILOSOPHY = {
  eyebrow: 'How we think',
  headline: 'Sleep is the result, not the score.',
  subheadline:
    'Skip the trackers and fix your light and vitamins first—better sleep will naturally follow.',
  image: PITCH_IMAGES.retinomic.howWeThink,
  imageAlt: 'How DIOS thinks about sleep — fix inputs, not scores',
  ctaLabel: 'See the evidence',
  ctaHref: '/evidence',
} as const

export const RETINOMIC_LANDING_META = {
  title: 'DIOS — Dose Intelligence OS · Retinomic Protocol',
  description:
    'DIOS links your eye, blood work, and daily light — then shows what to do next. Free baseline scan at dios.health.',
  openGraphTitle: 'Stop guessing with wearables · dios.health',
  openGraphDescription:
    'Eye scan, blood vitamins, light dose, and sleep check — one simple plan. Free baseline scan.',
} as const
