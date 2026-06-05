/**
 * Dose Intelligence — public landing copy.
 * Medtech skim-and-dive: one idea per full-bleed tile; detail lives on /pitch/* and /how-it-works.
 */

import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

/** Tile 1 — hero */
export const RETINOMIC_LANDING_HERO = {
  eyebrow: 'Quantify your meds',
  headline: 'From standard dose to dose intelligence.',
  subheadline:
    'We use your light, eye, blood, and sleep data to tailor med plans for better, brighter outcomes.',
  detailHref: '/pitch/hook',
  ctaLabel: 'Explore dose intelligence',
  ctaHref: '/pitch/hook',
  signUpHref: '/auth/signup',
  secondaryCtaLabel: 'Free baseline scan',
  secondaryCtaHref: '/onboarding',
} as const

/** Onboarding — continues tile 1 narrative into product */
export const ONBOARDING_COPY = {
  eyebrow: RETINOMIC_LANDING_HERO.eyebrow,
  headline: 'Your free baseline scan',
  subheadline: RETINOMIC_LANDING_HERO.subheadline,
  image: PITCH_IMAGES.hook,
  imageAlt: 'Retinomic eye scan — quantify your meds',
  pillars: [
    { id: 'light', label: 'Light dose', note: 'From scan', active: true },
    { id: 'eye', label: 'Eye scan', note: 'Step 1', active: true },
    { id: 'blood', label: 'Blood panel', note: 'If flagged', active: false },
    { id: 'sleep', label: 'Sleep check', note: 'If flagged', active: false },
  ],
  step1: {
    label: 'Step 1',
    title: 'Retinomic eye scan',
    body: 'Your phone reads iris pigment and skin tone — the first signals for your personal light dose and dose window.',
    ctaIdle: 'Start eye scan',
    ctaDone: 'Rescan eye baseline',
    donePrefix: 'Dose window anchor captured',
  },
  step2: {
    label: 'Step 2',
    eyebrow: 'Optional · clinical depth',
    title: 'In-person scan node',
    body: 'Book a nearby Siloton GiraffeOCT node when you want retina verification beyond the phone baseline.',
  },
  continueCta: 'Save your baseline →',
  signInHint: 'Already have an account?',
  signUpHeadline: 'Save your dose baseline',
  signUpSubtext:
    'Your eye scan links to this account. Gominak blood and sleep panels unlock only if DIOS flags elevated risk.',
} as const

/** Public live demo — /how-it-works */
export const HOW_IT_WORKS_DEMO_COPY = {
  eyebrow: 'Live demo',
  headline: 'Your dashboard after the baseline scan',
  subheadline:
    'Sample day-one dose intelligence below. Start your free eye scan to replace this placeholder with your light, eye, blood, and sleep biology.',
  sampleLabel: 'Sample patient · Sean · Auckland',
  disclaimer: 'Illustrative data only · not medical advice',
  primaryCta: 'Start free baseline scan',
  primaryHref: '/onboarding',
  secondaryCta: 'How dose intelligence works',
  secondaryHref: '/pitch/how-it-works',
} as const

/** Tile 2 — problem (detail: /pitch/problem) */
export const RETINOMIC_LANDING_PROBLEM = {
  eyebrow: 'The problem',
  headline: 'Standardised dosing misses most patients.',
  subheadline: 'One time on every label. Most bodies need another window.',
  image: '/standardised.jpg',
  imageAlt: 'Standardised medicine dosing — one schedule for every patient',
  detailHref: '/pitch/problem',
  ctaLabel: 'Why this matters',
  ctaHref: '/pitch/problem',
  secondaryCtaLabel: 'Clinical proof',
  secondaryCtaHref: '/pitch/clinical-proof',
} as const

/** Tile 3 — protocol (detail: /how-it-works, /evidence) */
export const RETINOMIC_LANDING_PROTOCOL = {
  eyebrow: 'Dose intelligence',
  headline: 'No one size. All tailored to fit.',
  subheadline: 'Gominak panel · Retinomic scan · Your dose window.',
  image: PITCH_IMAGES.retinomic.howWeThink,
  imageAlt: 'Dose Intelligence — personal dose timing',
  detailHref: '/pitch/how-it-works',
  ctaLabel: 'How it works',
  ctaHref: '/pitch/how-it-works',
  secondaryCtaLabel: 'Live demo',
  secondaryCtaHref: '/how-it-works',
} as const

/** Tile 4 — vision (detail: /pitch/chronobiobank) */
export const RETINOMIC_LANDING_VISION = {
  eyebrow: 'Our vision',
  headline: 'Your data helps everyone.',
  subheadline: 'Co-own the Chronobiobank. Your biology funds research — you share returns.',
  image: '/chronobiobank.png',
  imageAlt: 'Chronobiobank research infrastructure',
  detailHref: '/pitch/chronobiobank',
  ctaLabel: 'Our vision',
  ctaHref: '/pitch/chronobiobank',
  secondaryCtaLabel: 'Contact us',
  secondaryCtaHref: '/contact',
} as const

export type RetinomicFeatureCopy = {
  id: string
  lead: string
  body: string
  image: string
  imageAlt: string
  href?: string
  external?: boolean
}

/** Detail pages only — not shown on landing deck */
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

export const RETINOMIC_LANDING_META = {
  title: 'Dose Intelligence · DIOS',
  description:
    'From standard dose to dose intelligence. Light, eye, blood, and sleep tailored to your biology.',
  openGraphTitle: 'Dose Intelligence · dios.health',
  openGraphDescription:
    'No one size. All tailored to fit. Free baseline scan — or explore the clinical evidence.',
} as const
