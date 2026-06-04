import { PITCH_HERO, PITCH_IMAGES } from '@/lib/pitch/landing-images'
import { GRANT_MUNRO_PAPER_TITLE } from '@/lib/pitch/grant-munro-founder'

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
    id: 'pitch-hook',
    slug: 'hook',
    eyebrow: 'What we know',
    title: 'Light determines how fast you age.',
    subtitle:
      'The UK Biobank study of 80,000 people found that the rhythm of your light and dark cycle — not diet or exercise alone — determines your metabolic health and how long you live.',
    image: PITCH_HERO.poster,
    imageAlt: 'Medicines and tablets',
    videoSrc: '/first-light.mp4',
    href: '/circadian-digital-twin',
    ctaLabel: 'View the science',
  },
  {
    id: 'pitch-problem',
    slug: 'problem',
    eyebrow: 'The core problem',
    title: 'Most people are living in the dark.',
    subtitle:
      'Circadian dyssynchrony — the gap between your body clock and your actual life — silently accelerates metabolic disease. Until now medicine had no way to measure it.',
    image: '/standardised.jpg',
    imageAlt: 'Standardised medication packaging',
    href: '/pitch/problem',
    ctaLabel: 'See the problem',
  },
  {
    id: 'pitch-how',
    slug: 'how-it-works',
    eyebrow: 'The DIOS solution',
    title: 'Your Dark Years. Recovered.',
    subtitle:
      'DIOS measures the gap between your Chronological Age and your Chronosomatic Age — the Dark Years lost to metabolic hibernation — and gives you a precise plan to close it.',
    image: '/dose-intelligence.jpg',
    imageAlt: 'Phone camera session',
    href: '/how-it-works',
    ctaLabel: 'How it works',
  },
  {
    id: 'pitch-why-now',
    slug: 'why-now',
    eyebrow: 'Why this matters',
    title: 'Three layers. One number.',
    subtitle:
      'Daily smartphone sensors, a seven-night TipTraQ sleep study, and a quarterly blood panel converge into a single score — your Chronosomatic Age — and a Metabolic Risk profile across seven body systems.',
    image: '/tiptraq-wearable.jpg',
    imageAlt: 'TipTraQ wearable home sleep monitor',
    href: '/tiptraq',
    ctaLabel: 'Explore the diagnostic stack',
  },
  {
    id: 'pitch-clinical-proof',
    slug: 'clinical-proof',
    eyebrow: 'Strong clinical proof',
    title: 'The evidence is unambiguous.',
    subtitle:
      '80,000 participants. Accelerometer-measured light cycles. Hard metabolic and mortality outcomes. The UK Biobank proved that circadian alignment extends healthy life. DIOS is the first clinical tool built directly on that finding.',
    image: PITCH_IMAGES.evidence,
    imageAlt: 'Clinical evidence overview',
    href: '/pitch/clinical-proof',
    ctaLabel: 'View the evidence',
  },
  {
    id: 'pitch-pilot-structure',
    slug: 'chronobiobank',
    eyebrow: 'Our bold vision',
    title: 'Community-owned. Patient-powered.',
    subtitle:
      "Every DIOS patient contributes to the Chronobiobank — the world's first community-owned circadian dataset. Your data funds the research. You own the returns.",
    image: '/chronobiobank.png',
    imageAlt: 'Chronobiobank research infrastructure',
    href: '/contact',
    ctaLabel: 'Contact the DIOS team',
  },
  {
    id: 'pitch-credibility',
    slug: 'credibility',
    eyebrow: 'Built for credibility',
    title: 'Built for the NHS. Designed for everyone.',
    subtitle:
      'Fitzpatrick skin-type correction, data sovereignty frameworks, and clinical decision support standards built in from day one — because circadian medicine should work for every patient, not just white European populations.',
    image: '/consent-firewall.jpg',
    imageAlt: 'Governance and compliance',
    href: '/pitch/credibility',
    ctaLabel: 'Explore our credibility',
  },
] as const

/** Footer / in-page nav — kept in sync with snap-deck section ids */
export const PITCH_LANDING_HASH_LINKS = PITCH_MINIMAL_TILES.map((tile) => ({
  label: tile.eyebrow,
  href: `/#${tile.id}`,
})) as readonly { label: string; href: string }[]

export const PITCH_DETAIL_PAGES: readonly PitchDetailPage[] = [
  {
    slug: 'hook',
    eyebrow: 'What we know',
    title: 'DIOS tells patients the best time to take medication.',
    subtitle: 'It turns circadian signal into practical medication timing recommendations.',
    image: PITCH_HERO.poster,
    imageAlt: 'Medicines and tablets',
    sections: [
      {
        title: 'Before',
        body: 'Patients are told what to take, but timing is usually generic and not personalised to physiology.',
      },
      {
        title: 'After',
        body: 'DIOS adds patient-specific timing guidance and documentation-ready output within routine clinical workflows.',
        bullets: ['Personalised timing window', 'Patient-friendly guidance', 'Clinician summary for review'],
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
    eyebrow: 'The problem',
    title: 'Why outcomes are left on the table.',
    subtitle: 'Population-average dose timing leads to avoidable variability.',
    image: PITCH_IMAGES.evidence,
    imageAlt: 'Clinical burden',
    sections: [
      {
        title: 'Founder paper',
        body: `Grant Munro’s founder position paper, ${GRANT_MUNRO_PAPER_TITLE}, is published on this page with a downloadable PDF.`,
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
