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
        title: 'Standardised guesswork',
        body: 'Medicine optimises what to take and how much — but rarely when. Morning statins, meal-linked metformin, and bedtime rules only where a trial forced the question. Most bodies need another window.',
      },
      {
        title: 'Biology beats the label',
        body: 'Delayed sleep phase, shift work, and seasonal light change how drugs are absorbed and tolerated. The same script at the wrong biological moment drives non-adherence, switches, and avoidable harm.',
        bullets: [
          'Hermida — 45% fewer cardiovascular events when timing matched biology',
          'Pigazzani — chronotype modulates antihypertensive response',
          'UK Biobank — light–dark rhythm predicts metabolic and cardiovascular risk',
        ],
      },
      {
        title: 'Built for shared decisions',
        body: 'Output is clinician-ready: personal dose windows, adherence context, and timing evidence your GP or specialist can act on — not another pamphlet.',
      },
    ],
    sources: [
      { label: 'Peer-reviewed library', href: '/science' },
      { label: 'Clinical validation framework', href: '/evidence' },
      { label: 'Live demo dashboard', href: '/how-it-works/demo' },
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
        body: `Grant Munro’s ${GRANT_MUNRO_PAPER_TITLE} connects chronotherapy evidence to NHS medicines optimisation — and to the layered measurement stack DIOS deploys with City Labs and PranaQ TipTraQ. Read the full paper below.`,
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
      { label: 'Live demo dashboard', href: '/how-it-works/demo' },
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
        body: 'Chronotherapy stalled because measurement and workflow were missing. DIOS supplies patient-specific timing evidence — smartphone retinomic screening, City Labs panels, and PranaQ TipTraQ verification in one workflow.',
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
        title: 'The Coimbra Paradox — solved',
        body: 'Mainstream medicine requires clinical trial evidence for treatments it will endorse. Clinical trials for vitamin D are not funded because vitamin D cannot be patented. When enough participants contribute enough longitudinal data, the community itself generates the evidence that no pharmaceutical company will fund. The patients create the proof. The patients own the proof. The patients decide who uses it and on what terms.',
      },
      {
        title: 'Governance proportional to data fidelity',
        body: 'Daily First Light scans establish base contribution. Verified City Labs panels and 90-day TipTraQ sleep files increase your voting weight on data access proposals. Phase 2 adds zero-knowledge proofs so institutions can verify cohort facts without seeing identity. Phase 3 activates the collective veto — participants vote on pharmaceutical and research access terms.',
        bullets: [
          'Academic non-profit research — allow or deny',
          'Pharmaceutical discovery — allow or deny',
          'Independent AI model training — allow or deny',
          'Open source data challenges — allow or deny',
        ],
      },
      {
        title: 'Phase 1 — launch now',
        body: 'Supabase custodian, GDPR-compliant, honest centralised architecture. Your consent toggles are logged immutably. Decentralised storage and ZKP verification follow when the dataset is valuable enough to protect at that level.',
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
