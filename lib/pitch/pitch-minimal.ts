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
        title: 'Quantify your meds',
        body: 'DIOS turns your light, eye, blood, and sleep signals into a personal dose window — when to take medicine, not just what the label says.',
      },
      {
        title: 'Why the eye scan comes first',
        body: 'Founder Grant Munro built the Retinomic baseline after several failed vitrectomy operations. He learned that measuring the retina clock early is prevention; waiting for surgical crisis is too late.',
        bullets: [
          'Free smartphone eye scan anchors your timing baseline',
          'Light and sleep refine the window over days',
          'Blood and overnight sleep escalate only when risk is flagged',
        ],
      },
      {
        title: 'Built for shared decisions',
        body: 'Output is clinician-ready: a practical schedule your GP can act on inside existing pathways — not another adherence pamphlet.',
      },
    ],
    sources: [
      { label: 'Start free baseline scan', href: '/onboarding' },
      { label: 'Live demo dashboard', href: '/how-it-works' },
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
        title: 'One schedule on every label',
        body: 'Medicine optimises what to take and how much — but rarely when. Morning statins, meal-linked metformin, and bedtime rules only where a trial forced the question. Most bodies need another window.',
      },
      {
        title: 'Population averages miss biology',
        body: 'Delayed sleep phase, shift work, and seasonal light change how drugs are absorbed and tolerated. Handing the same clock instruction to every patient drives non-adherence, switches, and avoidable harm.',
        bullets: RETINOMIC_LANDING_PROBLEM_CARDS.map((c) => `${c.lead}: ${c.body}`),
      },
      {
        title: 'Founder paper',
        body: `Grant Munro’s ${GRANT_MUNRO_PAPER_TITLE} connects chronotherapy evidence to NHS medicines optimisation — and to his own fight to preserve vision after failed surgery. Read the full paper below.`,
      },
    ],
    sources: [
      { label: 'Read the full founder paper', href: '/pitch/problem' },
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
        body: 'Start with a free Retinomic eye scan and photic baseline on your phone. DIOS scores your timing state and returns a dose window you and your clinician can use this week.',
      },
      {
        title: 'Four pillars — all tailored',
        body: 'No textbook schedule. Each signal is read and tuned to you through the Gominak protocol.',
        bullets: RETINOMIC_LANDING_FEATURES.map((f) => `${f.lead}: ${f.body}`),
      },
      {
        title: 'Escalate on risk',
        body: 'When DIOS flags elevated metabolic or circadian risk, care escalates to Gominak blood panels and FDA-cleared overnight sleep verification — still inside one dose intelligence workflow.',
      },
    ],
    sources: [
      { label: 'Live demo dashboard', href: '/how-it-works' },
      { label: 'Clinical evidence library', href: '/evidence' },
    ],
  },
  {
    slug: 'clinical-proof',
    eyebrow: 'Clinical proof',
    title: 'Personal timing beats standard dose.',
    subtitle:
      'Cardiovascular, metabolic, photic, and safety evidence converges — the same biology DIOS measures before decline becomes irreversible.',
    image: PITCH_IMAGES.evidence,
    imageAlt: 'Clinical evidence for chronotherapy',
    sections: [
      {
        title: 'Landmark trials',
        body: 'Bedtime antihypertensives, circadian metabolic risk, melanopic light dose, and medicines safety all point one way: timing is a modifiable clinical lever.',
        bullets: RETINOMIC_LANDING_EVIDENCE.map((s) => `${s.lead}: ${s.body}`),
      },
      {
        title: 'From evidence to deployment',
        body: 'Chronotherapy stalled because measurement and workflow were missing. DIOS supplies patient-specific timing evidence — starting with the retinomic eye scan Grant Munro wished had existed before his vitrectomies.',
      },
    ],
    sources: [
      { label: 'Full evidence library', href: '/evidence' },
      { label: 'Dedicated clinical proof page', href: '/pitch/clinical-proof' },
      { label: 'EHJ Hygia trial', href: 'https://doi.org/10.1093/eurheartj/ehz754' },
    ],
  },
  {
    slug: 'chronobiobank',
    eyebrow: RETINOMIC_LANDING_VISION.eyebrow,
    title: RETINOMIC_LANDING_VISION.headline,
    subtitle: RETINOMIC_LANDING_VISION.subheadline,
    image: RETINOMIC_LANDING_VISION.image,
    imageAlt: RETINOMIC_LANDING_VISION.imageAlt,
    sections: [
      {
        title: 'Your data helps everyone',
        body: 'Co-own the Chronobiobank: longitudinal circadian evidence you control, linked to care pathways and governed research.',
      },
      {
        title: 'Infrastructure for prevention',
        body: 'The same signals that personalise your dose window — light, eye, blood, sleep — become population evidence when you opt in. Returns flow back to participants as validation compounds.',
      },
      {
        title: 'Research by design',
        body: 'Governed data flows support translational protocols, NHS medicines optimisation, and the preventive monitoring stack DIOS was founded to deploy.',
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
