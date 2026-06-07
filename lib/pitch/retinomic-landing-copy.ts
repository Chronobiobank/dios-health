/**
 * Dose Intelligence — public landing copy.
 * Medtech skim-and-dive: one idea per full-bleed tile; detail lives on /pitch/* and /how-it-works.
 */

import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

/** Tile 1 — the problem (med timing lead — matches home) */
export const RETINOMIC_LANDING_HERO = {
  eyebrow: 'The problem',
  headline: 'Taking meds is standardised guesswork.',
  subheadline:
    'One schedule on every label. Most bodies need another window. DIOS scans your body clock and times your protocol to suit.',
  detailHref: '/science',
  ctaLabel: 'Read the evidence',
  ctaHref: '/science',
  signUpHref: '/auth/signup',
  secondaryCtaLabel: 'Build your profile',
  secondaryCtaHref: '/onboarding',
} as const

/** Tile 2 — dose intelligence (matches home insight) */
export const RETINOMIC_LANDING_CONSEQUENCE = {
  eyebrow: 'Technology',
  headline: 'Dose intelligence synchronised to body clocks.',
  subheadline:
    'Most scripts are standardised. We match the dose to suit — measured from light, sleep, and labs when you need clinical depth.',
  image: PITCH_IMAGES.spectrum,
  imageAlt: 'Dose intelligence mapped to circadian phase',
  detailHref: '/how-it-works',
  ctaLabel: 'Why body clocks matter',
  ctaHref: '/how-it-works',
  secondaryCtaLabel: 'Clinical evidence',
  secondaryCtaHref: '/evidence',
} as const

/** Tile 3 — one app, two views (matches home audience) */
export const RETINOMIC_LANDING_PHOTONIC_AGE = {
  eyebrow: 'Solution',
  headline: 'One App. Two Views.',
  subheadline:
    'Patients see today’s timing guidance. Clinicians see who needs attention this week — same data, different jobs.',
  image: PITCH_IMAGES.retinomic.howWeThink,
  imageAlt: 'Patient timing guidance and clinician cohort triage',
  detailHref: '/clinicians',
  ctaLabel: 'For clinicians',
  ctaHref: '/clinicians',
  secondaryCtaLabel: 'Live patient demo',
  secondaryCtaHref: '/how-it-works/demo',
} as const

/** Onboarding — continues landing narrative into product */
export const ONBOARDING_COPY = {
  eyebrow: 'Free baseline scan',
  headline: 'Your free baseline scan',
  subheadline:
    'Your phone reads iris pigment and skin tone — the first signals for your personal light dose and dose window.',
  image: PITCH_IMAGES.hook,
  imageAlt: 'Retinomic eye scan — optimise your script',
  pillars: [
    { id: 'light', label: 'Light dose', note: 'From scan', active: true },
    { id: 'eye', label: 'Eye scan', note: 'Step 1', active: true },
    { id: 'meds', label: 'Med timing', note: 'Step 3', active: false },
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
    eyebrow: 'Upgrade path',
    title: 'Blood panel or TipTraQ',
    body: 'Ask your GP for the Gominak blood panel to sharpen your timing windows. UK patients can add TipTraQ — the only non-invasive DLMO proxy outside a sleep lab, available exclusively through DIOS.',
  },
  step3: {
    label: 'Step 3',
    eyebrow: 'Optimise your script',
    title: 'What do you take?',
    body: 'Select your medications now — your first dashboard shows personal dose windows instead of examples. Skip if you prefer to add these later in Settings.',
    skipNote: 'Optional — you can add or edit medications anytime in Settings.',
  },
  continueCta: 'Save your baseline →',
  signInHint: 'Already have an account?',
  signUpHeadline: 'Save your dose baseline',
  signUpSubtext:
    'Your eye scan and medication timing link to this account. Gominak blood and sleep panels unlock only if DIOS flags elevated risk.',
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
  secondaryHref: '/how-it-works',
} as const

/** Tile 4 — three steps (matches home how) */
export const RETINOMIC_LANDING_PROTOCOL = {
  eyebrow: 'How it works',
  headline: '3 simple steps.',
  subheadline:
    'Scan your body clock in 60 seconds. Time all meds and supplements to your clock. Track progress with exploratory metrics.',
  image: PITCH_IMAGES.steps.camera,
  imageAlt: 'Scan, time, and track — dose intelligence workflow',
  detailHref: '/how-it-works',
  ctaLabel: 'Full walkthrough',
  ctaHref: '/how-it-works',
  secondaryCtaLabel: 'Start free scan',
  secondaryCtaHref: '/onboarding',
} as const

/** Tile 5 — get in sync (matches home CTA) */
export const RETINOMIC_LANDING_VISION = {
  eyebrow: 'Get started',
  headline: 'Get in sync.',
  subheadline:
    'Patients track their clock. Clinicians enrol their cohort. Both feed the same dose intelligence OS.',
  image: '/chronobiobank.png',
  imageAlt: 'Patient and clinician entry to DIOS',
  detailHref: '/onboarding',
  ctaLabel: 'Build your profile',
  ctaHref: '/onboarding',
  secondaryCtaLabel: 'For clinicians',
  secondaryCtaHref: '/clinicians',
} as const

/** Detail pages only — legacy problem narrative */
export const RETINOMIC_LANDING_PROBLEM = {
  eyebrow: 'Standardised dosing',
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
    id: 'smartphone-proxy',
    lead: 'Phone baseline',
    body: 'Your wake and sleep light — provisional timing from day one.',
    image: PITCH_IMAGES.retinomic.eyeScan,
    imageAlt: 'Smartphone camera baseline for provisional DLMO proxy',
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
  title: 'DIOS — Optimise Your Script',
  description: 'Your medication has a biological window. DIOS finds it.',
  openGraphTitle: 'DIOS — Optimise Your Script',
  openGraphDescription: 'Chronotherapy made simple — scan your clock, time your meds, track progress.',
} as const
