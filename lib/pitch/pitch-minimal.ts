import { PITCH_HERO, PITCH_IMAGES } from '@/lib/pitch/landing-images'

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
    eyebrow: 'Medication timing',
    title: 'Medicine works differently depending on when you take it.',
    subtitle:
      'DIOS uses smartphone circadian signals to move beyond population-average dosing and delivers personalised timing for each patient.',
    image: PITCH_HERO.poster,
    imageAlt: 'Medicines and tablets',
    videoSrc: '/first-light.mp4',
    href: '/pitch/hook',
    ctaLabel: 'Request pilot',
    secondaryHref: '/mel',
    secondaryCtaLabel: 'Watch demo',
  },
  {
    id: 'pitch-problem',
    slug: 'problem',
    eyebrow: 'The problem',
    title: 'Population-average dosing misses patient biology.',
    subtitle:
      'In the NHS alone, poor medication timing contributes to over £300 million in wasted medicines annually — while also reducing efficacy and increasing avoidable hospital admissions.',
    image: '/Medicines-waste.jpeg',
    imageAlt: 'Clinical evidence',
    href: '/pitch/problem',
    ctaLabel: 'See the problem',
  },
  {
    id: 'pitch-how',
    slug: 'how-it-works',
    eyebrow: 'The DIOS Solution',
    title: 'Dose Intelligence.',
    subtitle:
      'DIOS uses smartphone circadian signals to move beyond population-average dosing and delivers personalised timing for each patient.',
    image: '/tiptraq-wearable.jpg',
    imageAlt: 'Phone camera session',
    href: '/pitch/how-it-works',
    ctaLabel: 'How it works',
  },
  {
    id: 'pitch-why-now',
    slug: 'why-now',
    eyebrow: 'Why now',
    title: 'Smartphones are now passive circadian sensors.',
    subtitle: 'This makes precision medication timing deployable at scale.',
    image: '/why-now-phones.jpg',
    imageAlt: 'Smartphone biomarker measurement',
    href: '/pitch/why-now',
    ctaLabel: 'Why now',
  },
  {
    id: 'pitch-clinical-proof',
    slug: 'clinical-proof',
    eyebrow: 'Clinical proof',
    title: 'Timing is linked to cardiovascular, metabolic, and safety outcomes.',
    subtitle: 'The evidence base is now strong enough for deployment.',
    image: PITCH_IMAGES.evidence,
    imageAlt: 'Clinical evidence overview',
    href: '/pitch/clinical-proof',
    ctaLabel: 'View evidence',
  },
  {
    id: 'pitch-pilot-structure',
    slug: 'chronobiobank',
    eyebrow: 'Chronobiobank',
    title: 'Building chronomedicine research infrastructure from the ground up.',
    subtitle: 'DIOS is designed as a research and innovation system, not just a point solution.',
    image: PITCH_IMAGES.model,
    imageAlt: 'Chronobiobank research infrastructure',
    href: '/contact',
    ctaLabel: 'Contact DIOS',
  },
  {
    id: 'pitch-credibility',
    slug: 'credibility',
    eyebrow: 'Credibility',
    title: 'Built for clinical governance from day one.',
    subtitle: 'Safety framing, standards, and accountable rollout.',
    image: PITCH_IMAGES.governance.regulatory,
    imageAlt: 'Governance and compliance',
    href: '/pitch/credibility',
    ctaLabel: 'View credibility',
  },
] as const

export const PITCH_DETAIL_PAGES: readonly PitchDetailPage[] = [
  {
    slug: 'hook',
    eyebrow: 'Medication timing',
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
        title: 'Clinical impact',
        body: 'Mistimed dosing can worsen tolerability, reduce efficacy, and erode adherence.',
      },
      {
        title: 'System impact',
        body: 'When timing is not addressed, care pathways absorb avoidable waste and repeat workload.',
        bullets: [
          'More medication switches and escalations',
          'Higher review burden',
          'Avoidable medicines waste',
        ],
      },
    ],
    sources: [
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
    eyebrow: 'Chronobiobank',
    title: 'Research and innovation infrastructure for precision chronomedicine.',
    subtitle: 'DIOS builds a governed foundation for continuous clinical learning and translational research.',
    image: PITCH_IMAGES.model,
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
    image: PITCH_IMAGES.governance.regulatory,
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
