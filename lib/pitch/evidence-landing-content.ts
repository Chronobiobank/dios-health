import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const EVIDENCE_LANDING_META = {
  title: 'Clinical evidence — Dose Intelligence · DIOS',
  description:
    'Melanopsin phototransduction, neurochemistry, and FDA-cleared TipTraQ telemetry — the clinical validation framework behind DIOS Dose Intelligence.',
} as const

export const EVIDENCE_HERO = {
  eyebrow: 'Clinical validation',
  headline: 'The science behind',
  headlineEmphasis: 'dose intelligence.',
  lede: 'We bridge photic signalling, neurochemistry, and medical-grade telemetry to personalise dose timing — not population schedules.',
} as const

export type EvidencePillar = {
  id: string
  label: string
  title: string
  summary: string
  bullets: readonly { label: string; body: string; href?: string; linkLabel?: string }[]
  reference: string
}

export const EVIDENCE_PILLARS: readonly EvidencePillar[] = [
  {
    id: 'photic',
    label: 'Pillar 1',
    title: 'Photic signalling & light',
    summary:
      'Human circadian rhythms are anchored by intrinsically photosensitive retinal ganglion cells (ipRGCs). Melanopsin peaks between 480–490 nm (blue-cyan spectrum).',
    bullets: [
      {
        label: 'ipRGC transduction',
        body: 'Foster and colleagues established melanopsin-expressing ipRGCs as the primary photic input to the suprachiasmatic nucleus — the master clock that sets dose timing windows.',
      },
      {
        label: 'DIOS measurement path',
        body: 'DIOS derives provisional melanopic lux and DLMO from monthly smartphone camera sessions and TipTraQ sleep architecture — no ophthalmic imaging required.',
      },
    ],
    reference:
      'Foster, R. G., et al. (2002). Melanopsin and circadian phototransduction.',
  },
  {
    id: 'fuel',
    label: 'Pillar 2',
    title: 'Neurochemistry & fuel',
    summary:
      'Photic timing signals fail if the brainstem lacks the molecular building blocks to execute sleep state switching. Sustained deep REM paralysis relies on acetylcholine synthesis.',
    bullets: [
      {
        label: 'The microbiome factory',
        body: 'Acetylcholine production is tied to a functioning gut microbiome — the primary manufacturer of critical B vitamins.',
      },
      {
        label: 'The D3/B5 loop',
        body: 'Maintaining Vitamin D3 target levels (60–80 ng/mL) and targeted Vitamin B5 titration reactivates this internal metabolic loop — models from Gominak and Coimbra cohorts.',
      },
    ],
    reference:
      'Gominak, S. C. (2016). The world epidemic of sleep fragmentation: A deficiency of vitamin D3 and pantothenic acid.',
  },
  {
    id: 'telemetry',
    label: 'Pillar 3',
    title: 'Outcome verification',
    summary:
      'We do not track superficial movements or rely on subjective sleep questionnaires. We verify changes in sleep architecture through medical-grade sensor telemetry.',
    bullets: [
      {
        label: 'PranaQ TipTraQ',
        body: 'DIOS streams high-fidelity data from the FDA 510(k) cleared TipTraQ fingertip sensor.',
        href: 'https://pranaq.com/tiptraq/',
        linkLabel: 'TipTraQ fingertip sensor',
      },
      {
        label: 'Medical-grade metrics',
        body: 'Tri-wavelength PPG and 3-axis motion gyroscopes evaluate REM efficiency, micro-arousals, and overnight SpO2 min with clinical precision.',
      },
    ],
    reference: 'FDA K243268 clearance data (2025). PranaQ Pte. Ltd. home sleep apnea evaluation guidelines.',
  },
  {
    id: 'd3',
    label: 'Pillar 4',
    title: 'Cutaneous D3 synthesis',
    summary:
      'Global vitamin D deficiency affects over one billion people — modern indoor life eliminated the primary evolutionary source of D3 synthesis.',
    bullets: [
      {
        label: 'MLux camera proxy',
        body: 'Monthly smartphone light capture refreshes provisional DLMO between TipTraQ blocks — melanopsin-driven entrainment and seasonal light adjustment measured by DIOS.',
        href: 'https://www.nejm.org/doi/full/10.1056/NEJMra070553',
        linkLabel: "Holick's 2007 NEJM paper",
      },
    ],
    reference:
      'Holick, M. F. (2007). Vitamin D deficiency. New England Journal of Medicine, 357(3), 266–281.',
  },
] as const

export const EVIDENCE_LOOP = {
  headline: 'Operationalising the loop',
  body: 'By feeding non-invasive baselines — skin melanin, monthly light capture, and geolocation zenith — into the platform, DIOS flags circadian phase displacement and recommends biochemical intervention only when a broken loop is detected.',
} as const

export const EVIDENCE_CTA = {
  primary: { label: 'Start your baseline scan', href: MARKETING_ROUTES.onboarding },
  secondary: { label: 'Peer-reviewed library', href: MARKETING_ROUTES.science },
  tertiary: { label: 'How it works', href: MARKETING_ROUTES.howItWorks },
} as const
