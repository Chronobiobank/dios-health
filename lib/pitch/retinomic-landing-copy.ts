/**
 * Retinomic Protocol — public landing copy (Dose Intelligence OS).
 * Mobile-first: short lines, plain English. Single source for hero + deck tiles.
 * Narrative arc: uniform-response fallacy (problem) → dose intelligence → Gominak protocol (tailored fit).
 */

import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

export const RETINOMIC_LANDING_HERO = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'Quantify your meds.',
  subheadline:
    'From standard dose to dose intelligence — timing built on your biology.',
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
  /** Internal route or external study URL */
  href?: string
  external?: boolean
}

/** Landing screen 1 — light glass panel, standardised dosing in medicine */
export const RETINOMIC_PROBLEM_SECTION = {
  eyebrow: 'The problem',
  title: 'Standardised dosing misses most patients.',
  subtitle:
    'One time on every label. The same micronutrient targets for every body — and most never get the window they need.',
  primaryCtaLabel: 'Read the founder paper',
  primaryCtaHref: '/pitch/problem',
  secondaryCtaLabel: 'Free baseline scan',
  secondaryCtaHref: '/onboarding',
} as const

/** Detail page + OG — mirrors problem section */
export const RETINOMIC_LANDING_PROBLEM = {
  eyebrow: RETINOMIC_PROBLEM_SECTION.eyebrow,
  headline: RETINOMIC_PROBLEM_SECTION.title,
  subheadline: RETINOMIC_PROBLEM_SECTION.subtitle,
  image: '/standardised.jpg',
  imageAlt: 'Standardised medicine dosing — one schedule for every patient',
  ctaLabel: RETINOMIC_PROBLEM_SECTION.primaryCtaLabel,
  ctaHref: RETINOMIC_PROBLEM_SECTION.primaryCtaHref,
  secondaryCtaLabel: 'Clinical proof',
  secondaryCtaHref: '/pitch/clinical-proof',
} as const

export const RETINOMIC_LANDING_PROBLEM_CARDS: readonly RetinomicFeatureCopy[] = [
  {
    id: 'dose-time',
    lead: 'One dose time',
    body: 'Every label picks one schedule for all patients.',
    image: '/standardised.jpg',
    imageAlt: 'Standardised dose time on medicine labels',
    href: '/pitch/problem',
  },
  {
    id: 'micronutrients',
    lead: 'Same targets',
    body: 'Science assumes we all respond to micronutrients alike.',
    image: PITCH_IMAGES.retinomic.bloodFuel,
    imageAlt: 'Population micronutrient targets — not personal response',
    href: '/evidence',
  },
  {
    id: 'hygia',
    lead: 'Hygia trial',
    body: 'Same drug, different time — outcomes changed.',
    image: PITCH_IMAGES.problem.hygia,
    imageAlt: 'Hygia chronotherapy — bedtime vs morning dosing',
    href: '/pitch/clinical-proof',
  },
  {
    id: 'safety',
    lead: 'BMJ safety',
    body: '237M medication errors in England yearly.',
    image: PITCH_IMAGES.problem.elliott,
    imageAlt: 'Medication errors from standardised prescribing',
    href: 'https://doi.org/10.1136/bmjqs-2019-010206',
    external: true,
  },
] as const

export const RETINOMIC_FEATURES_SECTION = {
  eyebrow: 'Gominak protocol',
  title: 'No one size. All tailored to fit.',
  primaryCtaLabel: 'Free baseline scan',
  primaryCtaHref: '/onboarding',
  secondaryCtaLabel: 'See demo',
  secondaryCtaHref: '/how-it-works',
} as const

export const RETINOMIC_LANDING_FEATURES: readonly RetinomicFeatureCopy[] = [
  {
    id: 'dios-engine',
    lead: 'Light dose',
    body: 'Your photic window — not a generic schedule.',
    image: PITCH_IMAGES.retinomic.lightDose,
    imageAlt: 'Personal light dose for medication timing',
    href: '/how-it-works',
  },
  {
    id: 'siloton',
    lead: 'Eye scan',
    body: 'Your retina clock — not population averages.',
    image: PITCH_IMAGES.retinomic.eyeScan,
    imageAlt: 'Personal retinomic eye scan for chronotherapy',
    href: '/how-it-works',
  },
  {
    id: 'biochemical',
    lead: 'Gominak panel',
    body: 'Your micronutrient response — not textbook ranges.',
    image: PITCH_IMAGES.retinomic.bloodFuel,
    imageAlt: 'Gominak blood panel tailored to patient targets',
    href: '/evidence',
  },
  {
    id: 'tiptraq',
    lead: 'Sleep check',
    body: 'Your nights — proof the plan fits.',
    image: PITCH_IMAGES.retinomic.sleepCheck,
    imageAlt: 'Personal overnight sleep verification',
    href: '/tiptraq',
  },
] as const

export const RETINOMIC_EVIDENCE_SECTION = {
  eyebrow: 'The evidence',
  title: 'Personal timing beats standard dose.',
  primaryCtaLabel: 'Clinical proof',
  primaryCtaHref: '/pitch/clinical-proof',
  secondaryCtaLabel: 'All evidence',
  secondaryCtaHref: '/evidence',
} as const

/** Four landmark studies — mirrors protocol 2×2 glass tile layout */
export const RETINOMIC_LANDING_EVIDENCE: readonly RetinomicFeatureCopy[] = [
  {
    id: 'hygia',
    lead: 'Hygia trial',
    body: 'Bedtime BP pills cut heart events vs morning dosing.',
    image: PITCH_IMAGES.problem.hygia,
    imageAlt: 'Hygia chronotherapy cardiovascular trial',
    href: 'https://doi.org/10.1093/eurheartj/ehz754',
    external: true,
  },
  {
    id: 'metabolic',
    lead: 'Lancet 2024',
    body: 'Circadian mismatch raises diabetes risk.',
    image: PITCH_IMAGES.problem['biobank-t2dm'],
    imageAlt: 'Lancet metabolic and circadian risk study',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    external: true,
  },
  {
    id: 'photic',
    lead: 'PNAS melanopic',
    body: 'Light dose from your phone anchors timing.',
    image: PITCH_IMAGES.biomarker.mlux,
    imageAlt: 'PNAS melanopic lux biomarker study',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120',
    external: true,
  },
  {
    id: 'safety',
    lead: 'BMJ safety',
    body: 'Personal timing cuts medicine harm.',
    image: PITCH_IMAGES.problem.elliott,
    imageAlt: 'BMJ medicines safety and timing',
    href: '/pitch/clinical-proof',
  },
] as const

export const RETINOMIC_LANDING_PHILOSOPHY = {
  eyebrow: 'The shift',
  headline: 'From standard dose to dose intelligence.',
  subheadline:
    'Your D3, your B12, your pill time — none of them match a population average. Gominak titrates all three to you.',
  image: PITCH_IMAGES.retinomic.howWeThink,
  imageAlt: 'Gominak protocol — personalised dose timing, not population norms',
  ctaLabel: 'See the evidence',
  ctaHref: '/evidence',
} as const

export const RETINOMIC_LANDING_META = {
  title: 'DIOS — Dose Intelligence OS',
  description:
    'Pharma and nutrition science assume we all respond to micronutrients the same. DIOS dose intelligence and the Gominak protocol tailor every target to your biology.',
  openGraphTitle: 'Standardised dosing misses most patients · dios.health',
  openGraphDescription:
    'One time on every label. The same micronutrient targets for every body. DIOS moves medicine to dose intelligence. Free baseline scan.',
} as const
