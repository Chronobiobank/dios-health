/** Clinician-first home — concise, mobile-first, four-metric pRGC narrative. */

import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export { MARKETING_ROUTES }

export const HOME_LANDING_META = {
  title: 'DIOS — Is the pRGC system working?',
  description:
    'Four numbers per patient. Sleep, REM latency, PTH, D3 timing — nightly TipTraQ, quarterly bloods. Built for Coimbra and Gominak practice.',
  openGraphTitle: 'DIOS — Cohort intelligence for high-dose D',
  openGraphDescription:
    'TipTraQ turns a quarterly blood test into a nightly progress report.',
} as const

export const HOME_HERO = {
  eyebrow: 'High-dose D practice',
  tagline: ['Four numbers.', 'One answer.'] as const,
  subline: 'Sleep · REM · PTH · D3 timing. Nightly TipTraQ. Quarterly bloods.',
  video: '/optimise-your-script.mp4',
  poster: '/your-light-dose.jpg',
  primaryCta: { label: 'Open cohort demo', href: MARKETING_ROUTES.cliniciansTriage },
  secondaryCta: { label: 'Enrol practice', href: '/signup/clinician' },
} as const

export const HOME_METRICS = {
  eyebrow: 'The readout',
  question: 'Is the pRGC system working?',
  columns: [
    { id: 'sleep', label: 'Sleep efficiency', target: '>85%' },
    { id: 'rem', label: 'REM latency', target: '<90 min' },
    { id: 'pth', label: 'PTH', target: '<20 pg/mL' },
    { id: 'd3', label: 'D3 timing', target: 'Morning window' },
  ],
  footnote: 'Everything else is downstream.',
} as const

export const HOME_PROBLEM = {
  eyebrow: 'The gap',
  headline: ['D3 works.', 'Your stack doesn’t.'] as const,
  emphasisLine: 1,
  lede: 'PTH on a spreadsheet. Sleep invisible for ninety days. DIOS closes the loop.',
  primaryCta: { label: 'See the board', href: MARKETING_ROUTES.cliniciansTriage },
  evidenceCta: { label: 'Evidence', href: MARKETING_ROUTES.evidence },
} as const

export const HOME_INSIGHT = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'Quarterly labs.',
  headlineEmphasis: 'Nightly proof.',
  statement:
    'TipTraQ shows whether the protocol works every night — not every ninety days.',
  ctaLabel: 'Circadian model',
  ctaHref: '/circadian-digital-twin',
} as const

export const HOME_CASE_STUDY = {
  eyebrow: 'Summit Immune',
  headline: '38 patients. Monday scan.',
  subhead: 'Denver · NHS evaluation arm',
  metrics: [
    { label: 'Review', value: '3', tone: 'red' as const },
    { label: 'Watch', value: '4', tone: 'amber' as const },
    { label: 'On track', value: '31', tone: 'green' as const },
  ],
  rows: [
    {
      patient: 'Sarah Mitchell',
      read: '71% sleep · PTH 38 · D3 29% in window — timing education, not dose.',
      tone: 'red' as const,
    },
    {
      patient: 'Sean James',
      read: 'PTH 27 ↓ · sleep 79% ↑ — protocol working six weeks before next draw.',
      tone: 'amber' as const,
    },
  ],
  quote: {
    attribution: 'Dr. Amara Okonkwo',
    text: 'Three patients need me before coffee. The board tells me why.',
  },
  cta: { label: 'Open triage demo', href: MARKETING_ROUTES.cliniciansTriage },
} as const

export const HOME_AUDIENCE = {
  eyebrow: 'Two surfaces',
  headline: ['You read.', 'They time.'] as const,
  clinician: {
    who: 'Practitioner',
    line: 'Four columns. One row per patient.',
    href: MARKETING_ROUTES.cliniciansTriage,
  },
  patient: {
    who: 'Patient',
    line: 'DINA — three sentences. Right window.',
    href: MARKETING_ROUTES.dina,
  },
} as const

export const HOME_STEPS = {
  eyebrow: 'How it works',
  headline: 'Scan. Time. Triage.',
  steps: [
    { n: '01', line: 'TipTraQ — sleep architecture nightly.' },
    { n: '02', line: 'Morning D3 window — patient-controlled.' },
    { n: '03', line: 'Cohort board — PTH confirms what sleep shows.' },
  ],
  walkthroughCta: { label: 'Clinician walkthrough', href: MARKETING_ROUTES.clinicians },
  demoCta: { label: 'DINA demo', href: MARKETING_ROUTES.dina },
} as const

export const HOME_CLINICAL_DISCLAIMER =
  'Clinical decision support. You retain escalation authority.' as const

export const HOME_GOVERNANCE_LINE =
  'Clinician review before dose changes · UK GDPR · HIPAA path · FDA-cleared TipTraQ where stated' as const

export const HOME_PROOF = {
  headline: ['Published.', 'Cited in clinic.'] as const,
  ctaLabel: 'Evidence library',
  ctaHref: MARKETING_ROUTES.science,
  soundbites: [
    'Gominak — D3 restores sleep staging when timing is correct.',
    'Coimbra — PTH surveillance is the endpoint.',
    'Hygia — same drug, different window, fewer events.',
  ] as const,
  cards: [
    {
      ref: 'Coimbra et al. — CNS Drugs',
      finding: 'High-dose D3 requires structured PTH and calcium surveillance.',
      emphasis: 'PTH',
      doi: 'https://pubmed.ncbi.nlm.nih.gov/24804229/',
    },
    {
      ref: 'Gominak — RightSleep',
      finding: 'Vitamin D and B-vitamins restore sleep-state switching with correct photic timing.',
      emphasis: 'sleep-state switching',
      doi: 'https://pubmed.ncbi.nlm.nih.gov/27164492/',
    },
    {
      ref: 'UK Biobank — n≈89,000',
      finding: 'Light–dark rhythm predicts metabolic and cardiovascular risk.',
      emphasis: '89,000',
      doi: 'https://doi.org/10.1073/pnas.2405924121',
    },
    {
      ref: 'Hermida et al. — Hygia · n=19,084',
      finding: 'Bedtime antihypertensives cut cardiovascular events by 45%.',
      emphasis: '45%',
      doi: 'https://doi.org/10.1093/eurheartj/ehz754',
    },
  ],
} as const

export const HOME_CTA_MEDIA = {
  video: '/first-light.mp4',
  poster: '/your-light-dose.jpg',
} as const

export const HOME_CTA = {
  headline: 'Enrol your cohort.',
  clinician: {
    who: 'Practitioner',
    line: 'Start with the demo',
    detail: 'US · UK PCN · integrative',
    href: MARKETING_ROUTES.cliniciansTriage,
  },
  patient: {
    who: 'Patient',
    line: 'Meet DINA',
    detail: 'Invited by your clinic',
    href: MARKETING_ROUTES.dina,
  },
  briefing: {
    label: 'ICS briefing',
    href: '/contact?intent=clinical-briefing',
  },
} as const
