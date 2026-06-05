import { PITCH_IMAGES } from '@/lib/pitch/landing-images'
import { GRANT_MUNRO_PAPER_TITLE } from '@/lib/pitch/grant-munro-founder'
import {
  RETINOMIC_LANDING_CONSEQUENCE,
  RETINOMIC_LANDING_EVIDENCE,
  RETINOMIC_LANDING_FEATURES,
  RETINOMIC_LANDING_HERO,
  RETINOMIC_LANDING_PHOTONIC_AGE,
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

/** Five full-bleed narrative tiles — problem first, no jargon until tile 4 */
export const PITCH_MINIMAL_TILES: readonly PitchMinimalTile[] = [
  {
    id: 'pitch-hook',
    slug: 'hook',
    eyebrow: RETINOMIC_LANDING_HERO.eyebrow,
    title: RETINOMIC_LANDING_HERO.headline,
    subtitle: RETINOMIC_LANDING_HERO.subheadline,
    image: PITCH_IMAGES.retinomic.lightDose,
    imageAlt: 'Outdoor light — primary source of vitamin D and circadian entrainment',
    href: RETINOMIC_LANDING_HERO.detailHref,
    ctaLabel: RETINOMIC_LANDING_HERO.ctaLabel,
    secondaryHref: RETINOMIC_LANDING_HERO.secondaryCtaHref,
    secondaryCtaLabel: RETINOMIC_LANDING_HERO.secondaryCtaLabel,
  },
  {
    id: 'pitch-consequence',
    slug: 'consequence',
    eyebrow: RETINOMIC_LANDING_CONSEQUENCE.eyebrow,
    title: RETINOMIC_LANDING_CONSEQUENCE.headline,
    subtitle: RETINOMIC_LANDING_CONSEQUENCE.subheadline,
    image: RETINOMIC_LANDING_CONSEQUENCE.image,
    imageAlt: RETINOMIC_LANDING_CONSEQUENCE.imageAlt,
    href: RETINOMIC_LANDING_CONSEQUENCE.detailHref,
    ctaLabel: RETINOMIC_LANDING_CONSEQUENCE.ctaLabel,
    secondaryHref: RETINOMIC_LANDING_CONSEQUENCE.secondaryCtaHref,
    secondaryCtaLabel: RETINOMIC_LANDING_CONSEQUENCE.secondaryCtaLabel,
  },
  {
    id: 'pitch-photonic-age',
    slug: 'photonic-age',
    eyebrow: RETINOMIC_LANDING_PHOTONIC_AGE.eyebrow,
    title: RETINOMIC_LANDING_PHOTONIC_AGE.headline,
    subtitle: RETINOMIC_LANDING_PHOTONIC_AGE.subheadline,
    image: RETINOMIC_LANDING_PHOTONIC_AGE.image,
    imageAlt: RETINOMIC_LANDING_PHOTONIC_AGE.imageAlt,
    href: RETINOMIC_LANDING_PHOTONIC_AGE.detailHref,
    ctaLabel: RETINOMIC_LANDING_PHOTONIC_AGE.ctaLabel,
    secondaryHref: RETINOMIC_LANDING_PHOTONIC_AGE.secondaryCtaHref,
    secondaryCtaLabel: RETINOMIC_LANDING_PHOTONIC_AGE.secondaryCtaLabel,
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
    image: PITCH_IMAGES.retinomic.lightDose,
    imageAlt: 'Outdoor light — vitamin D deficiency and modern indoor life',
    sections: [
      {
        title: 'Holick in three sentences',
        body: 'Global vitamin D deficiency affects over one billion people — not because the sun changed but because modern indoor life eliminated the primary evolutionary source of D3 synthesis. Holick\'s 2007 NEJM paper established this as a pandemic. DIOS measures what modern life took from your biology and builds a protocol to restore it.',
      },
      {
        title: 'From deficit to protocol',
        body: 'The First Light Protocol addresses the deficit directly — morning outdoor exposure at civil twilight activates melanopsin-driven circadian entrainment and cutaneous UVB D3 precursor synthesis simultaneously. One ritual. Two biological mechanisms. Both measured.',
        bullets: [
          'D3 status via the Gominak blood panel when indicated',
          'Circadian amplitude via the First Light MLux score',
          'Sleep architecture as downstream outcome via TipTraQ',
        ],
      },
      {
        title: 'Built for shared decisions',
        body: 'Output is clinician-ready: Photonic Age, eating window, and protocol timing your GP or specialist can act on — not another adherence pamphlet.',
      },
    ],
    sources: [
      { label: 'Holick NEJM 2007', href: 'https://www.nejm.org/doi/full/10.1056/NEJMra070553' },
      { label: 'Clinical evidence library', href: '/evidence' },
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
