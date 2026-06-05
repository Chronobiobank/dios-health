import { PITCH_IMAGES } from '@/lib/pitch/landing-images'
import { GRANT_MUNRO_PAPER_TITLE } from '@/lib/pitch/grant-munro-founder'
import {
  RETINOMIC_LANDING_EVIDENCE,
  RETINOMIC_LANDING_FEATURES,
  RETINOMIC_LANDING_HERO,
  RETINOMIC_LANDING_PROBLEM,
  RETINOMIC_LANDING_PROBLEM_CARDS,
  RETINOMIC_LANDING_PROTOCOL,
  RETINOMIC_LANDING_VISION,
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

/** Four full-bleed narrative tiles — medtech skim-and-dive; no grids on landing */
export const PITCH_MINIMAL_TILES: readonly PitchMinimalTile[] = [
  {
    id: 'pitch-hook',
    slug: 'hook',
    eyebrow: RETINOMIC_LANDING_HERO.eyebrow,
    title: RETINOMIC_LANDING_HERO.headline,
    subtitle: RETINOMIC_LANDING_HERO.subheadline,
    image: PITCH_IMAGES.hook,
    imageAlt: 'Eye scan baseline — quantify your meds',
    href: RETINOMIC_LANDING_HERO.detailHref,
    ctaLabel: RETINOMIC_LANDING_HERO.ctaLabel,
    secondaryHref: RETINOMIC_LANDING_HERO.secondaryCtaHref,
    secondaryCtaLabel: RETINOMIC_LANDING_HERO.secondaryCtaLabel,
  },
  {
    id: 'pitch-problem',
    slug: 'problem',
    eyebrow: RETINOMIC_LANDING_PROBLEM.eyebrow,
    title: RETINOMIC_LANDING_PROBLEM.headline,
    subtitle: RETINOMIC_LANDING_PROBLEM.subheadline,
    image: RETINOMIC_LANDING_PROBLEM.image,
    imageAlt: RETINOMIC_LANDING_PROBLEM.imageAlt,
    href: RETINOMIC_LANDING_PROBLEM.detailHref,
    ctaLabel: RETINOMIC_LANDING_PROBLEM.ctaLabel,
    secondaryHref: RETINOMIC_LANDING_PROBLEM.secondaryCtaHref,
    secondaryCtaLabel: RETINOMIC_LANDING_PROBLEM.secondaryCtaLabel,
  },
  {
    id: 'pitch-protocol',
    slug: 'how-it-works',
    eyebrow: RETINOMIC_LANDING_PROTOCOL.eyebrow,
    title: RETINOMIC_LANDING_PROTOCOL.headline,
    subtitle: RETINOMIC_LANDING_PROTOCOL.subheadline,
    image: RETINOMIC_LANDING_PROTOCOL.image,
    imageAlt: RETINOMIC_LANDING_PROTOCOL.imageAlt,
    href: RETINOMIC_LANDING_PROTOCOL.detailHref,
    ctaLabel: RETINOMIC_LANDING_PROTOCOL.ctaLabel,
    secondaryHref: RETINOMIC_LANDING_PROTOCOL.secondaryCtaHref,
    secondaryCtaLabel: RETINOMIC_LANDING_PROTOCOL.secondaryCtaLabel,
  },
  {
    id: 'pitch-pilot-structure',
    slug: 'chronobiobank',
    eyebrow: RETINOMIC_LANDING_VISION.eyebrow,
    title: RETINOMIC_LANDING_VISION.headline,
    subtitle: RETINOMIC_LANDING_VISION.subheadline,
    image: RETINOMIC_LANDING_VISION.image,
    imageAlt: RETINOMIC_LANDING_VISION.imageAlt,
    href: RETINOMIC_LANDING_VISION.detailHref,
    ctaLabel: RETINOMIC_LANDING_VISION.ctaLabel,
    secondaryHref: RETINOMIC_LANDING_VISION.secondaryCtaHref,
    secondaryCtaLabel: RETINOMIC_LANDING_VISION.secondaryCtaLabel,
  },
] as const

/** Footer / in-page nav — one link per deck screen */
export const PITCH_LANDING_HASH_LINKS = PITCH_MINIMAL_TILES.map((tile) => ({
  label: tile.eyebrow,
  href: `/#${tile.id}`,
})) as readonly { label: string; href: string }[]

export const PITCH_DETAIL_PAGES: readonly PitchDetailPage[] = [
  {
    slug: 'hook',
    eyebrow: RETINOMIC_LANDING_HERO.eyebrow,
    title: RETINOMIC_LANDING_HERO.headline,
    subtitle: RETINOMIC_LANDING_HERO.subheadline,
    image: PITCH_IMAGES.hook,
    imageAlt: 'Eye scan baseline — quantify your meds',
    sections: [
      {
        title: 'Dose Intelligence OS',
        body: 'DIOS reads your biology and returns a personal dose window — when to take medicine, not just what the label says.',
      },
      {
        title: 'Retinomic Protocol',
        body: 'Four signals — light, eye, blood, and sleep — titrated to you through the Gominak protocol. No population averages.',
        bullets: ['Free baseline scan', 'Clinician-ready output', 'Escalates when risk is flagged'],
      },
    ],
    sources: [{ label: 'See the demo', href: '/how-it-works' }],
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
        body: 'Medicine picks one dose time and one set of micronutrient targets for every patient. Most bodies need a different window.',
      },
      {
        title: 'Founder paper',
        body: `Grant Munro’s position paper, ${GRANT_MUNRO_PAPER_TITLE}, sets out the clinical and system case. Full text and PDF on the problem page.`,
        bullets: RETINOMIC_LANDING_PROBLEM_CARDS.map((c) => `${c.lead}: ${c.body}`),
      },
    ],
    sources: [
      {
        label: `Grant Munro — ${GRANT_MUNRO_PAPER_TITLE} (PDF)`,
        href: '/papers/grant-munro-population-dosing-misses-biology.pdf',
      },
      { label: 'Clinical proof', href: '/pitch/clinical-proof' },
    ],
  },
  {
    slug: 'how-it-works',
    eyebrow: RETINOMIC_LANDING_PROTOCOL.eyebrow,
    title: RETINOMIC_LANDING_PROTOCOL.headline,
    subtitle: RETINOMIC_LANDING_PROTOCOL.subheadline,
    image: RETINOMIC_LANDING_PROTOCOL.image,
    imageAlt: RETINOMIC_LANDING_PROTOCOL.imageAlt,
    sections: [
      {
        title: 'Scan · Score · Schedule',
        body: 'Start with a free smartphone baseline. DIOS scores your timing state and returns a practical dose window for shared decisions.',
      },
      {
        title: 'Four pillars',
        body: 'Each signal is read and tuned to you — not a textbook schedule.',
        bullets: RETINOMIC_LANDING_FEATURES.map((f) => `${f.lead}: ${f.body}`),
      },
      {
        title: 'Escalate on risk',
        body: 'When DIOS flags elevated risk, care escalates to Gominak bloods and overnight sleep verification.',
      },
    ],
    sources: [
      { label: 'Live demo dashboard', href: '/how-it-works' },
      { label: 'Clinical evidence', href: '/evidence' },
    ],
  },
  {
    slug: 'clinical-proof',
    eyebrow: 'Clinical proof',
    title: 'Personal timing beats standard dose.',
    subtitle: 'Landmark studies behind the Retinomic Protocol.',
    image: PITCH_IMAGES.evidence,
    imageAlt: 'Clinical evidence for chronotherapy',
    sections: [
      {
        title: 'The evidence base',
        body: 'Cardiovascular, metabolic, photic, and safety signals converge on one idea: timing changes outcomes.',
        bullets: RETINOMIC_LANDING_EVIDENCE.map((s) => `${s.lead}: ${s.body}`),
      },
    ],
    sources: [
      { label: 'Full evidence library', href: '/evidence' },
      { label: 'EHJ Hygia trial', href: 'https://doi.org/10.1093/eurheartj/ehz754' },
    ],
  },
  {
    slug: 'chronobiobank',
    eyebrow: RETINOMIC_LANDING_VISION.eyebrow,
    title: "The world's first Chronobiobank.",
    subtitle: RETINOMIC_LANDING_VISION.subheadline,
    image: RETINOMIC_LANDING_VISION.image,
    imageAlt: RETINOMIC_LANDING_VISION.imageAlt,
    sections: [
      {
        title: 'Infrastructure first',
        body: 'User-owned longitudinal circadian evidence across care pathways.',
      },
      {
        title: 'Research by design',
        body: 'Governed data flows support validation and translational protocols.',
      },
    ],
    sources: [
      { label: 'Contact DIOS', href: '/contact' },
      { label: 'Privacy policy', href: '/privacy' },
    ],
  },
] as const

export function getPitchDetailPage(slug: string): PitchDetailPage | undefined {
  return PITCH_DETAIL_PAGES.find((page) => page.slug === slug)
}
