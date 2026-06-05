import { PITCH_IMAGES } from '@/lib/pitch/landing-images'
import { GRANT_MUNRO_PAPER_TITLE } from '@/lib/pitch/grant-munro-founder'
import {
  RETINOMIC_EVIDENCE_SECTION,
  RETINOMIC_FEATURES_SECTION,
  RETINOMIC_LANDING_HERO,
  RETINOMIC_LANDING_PHILOSOPHY,
  RETINOMIC_LANDING_PROBLEM,
  RETINOMIC_PROBLEM_SECTION,
} from '@/lib/pitch/retinomic-landing-copy'

export type PitchMinimalTile = {
  id: string
  slug: string
  eyebrow: string
  title: string
  subtitle: string
  image: string
  imageAlt: string
  videoSrc?: string
  href: string
  ctaLabel: string
  secondaryHref?: string
  secondaryCtaLabel?: string
}

export type PitchDetailSection = {
  title: string
  body: string
  bullets?: string[]
}

export type PitchDetailPage = {
  slug: string
  eyebrow: string
  title: string
  subtitle: string
  image: string
  imageAlt: string
  sections: readonly PitchDetailSection[]
  sources?: readonly { label: string; href: string }[]
}

export const PITCH_MINIMAL_TILES: readonly PitchMinimalTile[] = [
  {
    id: 'pitch-pilot-structure',
    slug: 'chronobiobank',
    eyebrow: 'Our vision',
    title: 'Your data helps everyone.',
    subtitle: 'Co-own the Chronobiobank. Your data funds research — you share returns.',
    image: '/chronobiobank.png',
    imageAlt: 'Chronobiobank research infrastructure',
    href: '/pitch/chronobiobank',
    ctaLabel: 'Learn more',
    secondaryHref: '/contact',
    secondaryCtaLabel: 'Contact us',
  },
] as const

/** Footer / in-page nav — kept in sync with snap-deck section ids */
export const PITCH_LANDING_HASH_LINKS = [
  { label: RETINOMIC_PROBLEM_SECTION.eyebrow, href: '/#pitch-problem' },
  { label: RETINOMIC_FEATURES_SECTION.eyebrow, href: '/#pitch-features' },
  { label: RETINOMIC_LANDING_PHILOSOPHY.eyebrow, href: '/#pitch-philosophy' },
  { label: RETINOMIC_EVIDENCE_SECTION.eyebrow, href: '/#pitch-clinical-proof' },
  ...PITCH_MINIMAL_TILES.map((tile) => ({
    label: tile.eyebrow,
    href: `/#${tile.id}`,
  })),
] as readonly { label: string; href: string }[]

export const PITCH_DETAIL_PAGES: readonly PitchDetailPage[] = [
  {
    slug: 'hook',
    eyebrow: 'Dose Intelligence OS',
    title: 'Quantify your meds.',
    subtitle: 'From standard dose to dose intelligence — timing built on your biology.',
    image: PITCH_IMAGES.hook,
    imageAlt: 'Dose Intelligence OS — personal medication timing',
    sections: [
      {
        title: 'The blind spot',
        body: "Most pharmaceutical and nutritional science assumes we all respond to micronutrients the same. We don't. Standard dose times and population blood targets follow — and most patients miss.",
      },
      {
        title: 'Dose intelligence',
        body: 'The Gominak protocol at the heart of DIOS: no one size. Light, Gominak blood targets, and pill time — all tailored to fit you, with clinician-ready output in routine workflows.',
        bullets: ['Tailored dose window', 'Gominak panel titration', 'Clinician summary for review'],
      },
    ],
    sources: [
      {
        label: 'NHS waste reduction report',
        href: 'https://www.england.nhs.uk/wp-content/uploads/2015/06/pharmaceutical-waste-reduction.pdf',
      },
    ],
  },
  {
    slug: 'problem',
    eyebrow: RETINOMIC_LANDING_PROBLEM.eyebrow,
    title: RETINOMIC_LANDING_PROBLEM.headline,
    subtitle: RETINOMIC_LANDING_PROBLEM.subheadline,
    image: RETINOMIC_LANDING_PROBLEM.image,
    imageAlt: RETINOMIC_LANDING_PROBLEM.imageAlt,
    sections: [
      {
        title: 'Standardised dosing',
        body: 'Medicine picks one dose time and one set of micronutrient targets for every patient. Pharma and nutrition science assume identical response — most bodies need a different window.',
      },
      {
        title: 'Founder paper',
        body: `Grant Munro’s founder position paper, ${GRANT_MUNRO_PAPER_TITLE}, sets out the clinical and system case for dose intelligence. Full text on this page, with a downloadable PDF.`,
        bullets: ['Full text on web', 'PDF for sharing with clinical and system leaders'],
      },
    ],
    sources: [
      {
        label: `Grant Munro — ${GRANT_MUNRO_PAPER_TITLE} (PDF)`,
        href: '/papers/grant-munro-population-dosing-misses-biology.pdf',
      },
      {
        label: 'NHS medicines optimisation',
        href: 'https://www.england.nhs.uk/medicines-2/medicines-optimisation/',
      },
      {
        label: 'NHS waste reduction report',
        href: 'https://www.england.nhs.uk/wp-content/uploads/2015/06/pharmaceutical-waste-reduction.pdf',
      },
    ],
  },
  {
    slug: 'how-it-works',
    eyebrow: 'How it works',
    title: 'Dose Intelligence OS workflow.',
    subtitle: 'DIOS starts with free scan, score, and schedule, then escalates to deeper diagnostics when risk is flagged.',
    image: PITCH_IMAGES.steps.camera,
    imageAlt: 'Workflow',
    sections: [
      {
        title: 'Step 1: Scan (free)',
        body: 'Patient completes a short smartphone assessment to capture timing-relevant signal.',
      },
      {
        title: 'Step 2: Score (free)',
        body: 'DIOS scores circadian timing state and confidence for rapid triage.',
      },
      {
        title: 'Step 3: Schedule (free)',
        body: 'Clinician receives practical dose-timing guidance for shared decisions.',
      },
      {
        title: 'Step 4: Escalate on risk flag',
        body: 'If DIOS identifies elevated risk, care can escalate to deeper analysis using TipTraQ and bloods.',
      },
    ],
    sources: [{ label: 'Clinical workflow context', href: '/clinic' }],
  },
  {
    slug: 'why-now',
    eyebrow: 'Why now',
    title: 'The technology finally supports scale.',
    subtitle: 'Smartphone biomarker capture makes precision timing accessible without hardware rollouts.',
    image: PITCH_IMAGES.biomarker.mlux,
    imageAlt: 'Smartphone biomarker',
    sections: [
      { title: 'Technology shift', body: 'Consumer devices can now capture useful circadian proxies.' },
      { title: 'Delivery shift', body: 'Care systems can deploy through existing pathways instead of new infrastructure.' },
    ],
    sources: [
      { label: 'PNAS biomarker study', href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120' },
      { label: 'CIE S026 standard', href: 'https://cie.co.at/publications/cie-systems/cie-s026-e2018-melanopic-action-spectrum' },
    ],
  },
  {
    slug: 'clinical-proof',
    eyebrow: 'Clinical proof',
    title: 'The evidence base is converging.',
    subtitle: 'Cardiovascular, metabolic, and medication-safety signals support deployment.',
    image: PITCH_IMAGES.evidence,
    imageAlt: 'Clinical evidence',
    sections: [
      { title: 'Cardiovascular', body: 'Timing can influence outcomes in antihypertensive pathways.' },
      { title: 'Metabolic', body: 'Light-rhythm disruption links to diabetes and metabolic risk.' },
      { title: 'Safety', body: 'Clearer timing guidance supports medication safety and adherence.' },
    ],
    sources: [
      { label: 'EHJ Hygia trial', href: 'https://doi.org/10.1093/eurheartj/ehz754' },
      { label: 'Lancet 2024 metabolic risk', href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext' },
      { label: 'BMJ QS medicines safety', href: 'https://doi.org/10.1136/bmjqs-2019-010206' },
    ],
  },
  {
    slug: 'chronobiobank',
    eyebrow: 'Our vision',
    title: "The world's first Chronobiobank.",
    subtitle:
      'DIOS builds user-owned infrastructure for continuous clinical learning, equitable precision care, and next-generation drug design and innovation.',
    image: '/chronobiobank.png',
    imageAlt: 'Chronobiobank model',
    sections: [
      {
        title: 'Infrastructure first',
        body: 'The platform is built to generate high-quality longitudinal circadian evidence across care pathways.',
      },
      {
        title: 'Research by design',
        body: 'Governed data flows support hypothesis generation, validation, and translational clinical protocols.',
      },
      {
        title: 'Innovation engine',
        body: 'Each deployment contributes to a larger chronomedicine evidence graph that improves future interventions.',
      },
    ],
    sources: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Clinical evidence page', href: '/evidence' },
      { label: 'Contact DIOS', href: '/contact' },
    ],
  },
  {
    slug: 'credibility',
    eyebrow: 'Credibility',
    title: 'Governance and safety are part of the product.',
    subtitle: 'Clinical risk, IG, and regulatory framing are built into rollout.',
    image: '/consent-firewall.jpg',
    imageAlt: 'Governance',
    sections: [
      { title: 'Governance', body: 'DPIA starter, subprocessor transparency, and rollout controls.' },
      { title: 'Regulatory framing', body: 'Intended use scoped against SaMD / CDS pathways before scaling.' },
    ],
    sources: [{ label: 'MHRA SaMD guidance', href: 'https://www.gov.uk/government/collections/software-and-ai-as-a-medical-device' }],
  },
] as const

export function getPitchDetailPage(slug: string): PitchDetailPage | undefined {
  return PITCH_DETAIL_PAGES.find((page) => page.slug === slug)
}
