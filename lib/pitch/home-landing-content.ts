/** Clinician education landing — Precision Immunology / Soltriol narrative. */

import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export { MARKETING_ROUTES }

export const HOME_LANDING_META = {
  title: 'DIOS — Vitamin D is a steroid hormone',
  description:
    'Soltriol regulates immune tolerance in every patient in your practice. DIOS closes the 90-day visibility gap with TipTraQ sleep architecture, quarterly bloods, and DINA dose timing.',
  openGraphTitle: 'DIOS — Precision Immunology for your practice',
  openGraphDescription:
    'Sleep architecture is your missing biomarker. Four readouts. One complete picture — before your patient walks through the door.',
} as const

export const HOME_HERO = {
  eyebrow: 'For clinicians',
  lines: [
    'Vitamin D is not a vitamin.',
    'It is a steroid hormone.',
  ] as const,
  emphasisLine: 'It regulates the immune system of every patient in your practice. And the curriculum you trained under did not teach you that.',
  pullQuote: 'The science moved on. Prescribing did not.',
  primaryCta: { label: 'Enrol your first patient', href: '/signup/clinician' },
  video: '/optimise-your-script.mp4',
  poster: '/your-light-dose.jpg',
} as const

export const HOME_SOLTRIOL = {
  eyebrow: '1,25-dihydroxyvitamin D3',
  headline: 'Soltriol binds nuclear VDR receptors.',
  paragraphs: [
    'Soltriol regulates over 200 genes including the entire Th17 immune tolerance pathway.',
    'Your patients with MS, Hashimoto\'s, rheumatoid arthritis, and lupus are on a protocol that depends on this hormone working precisely. It only works precisely when it is timed correctly.',
  ],
} as const

export const HOME_BLIND = {
  eyebrow: 'The visibility gap',
  headline: ['You are currently flying blind', 'for 87 days out of every 90.'] as const,
  emphasisLine: 0,
  paragraphs: [
    'You adjust the dose. You wait for the next blood panel. You hope the protocol is working.',
    'It is not good enough. And you know it.',
  ],
} as const

export const HOME_SLEEP = {
  eyebrow: 'Your missing biomarker',
  headline: 'Sleep architecture is your missing biomarker.',
  paragraphs: [
    'When Soltriol activates the pRGC system correctly, sleep efficiency exceeds 85% and REM latency falls below 90 minutes. These changes appear weeks before PTH moves on a blood panel.',
    'Your patient\'s sleep is telling you whether the protocol is working. You just have not had a way to hear it.',
  ],
} as const

export const HOME_UNTIL_NOW = {
  eyebrow: 'Until now',
  headline: 'TipTraQ plus DIOS.',
  headlineEmphasis: 'A complete immune picture.',
  paragraphs: [
    'TipTraQ measures three nights of sleep architecture every six months. DIOS reads that data alongside your quarterly blood panels and your patient\'s daily dose timing.',
    'The result is a complete picture of immune response — not a quarterly guess.',
  ],
} as const

export const HOME_DASHBOARD = {
  eyebrow: 'Your clinical dashboard',
  headline: 'Four readouts. One Precision Immunology picture.',
  intro:
    'The DIOS clinical dashboard shows you four things. That is the complete picture — updated as data arrives. Available before your patient walks through the door.',
  columns: [
    { id: 'sleep', label: 'Sleep efficiency', target: '>85%' },
    { id: 'rem', label: 'REM latency', target: '<90 min' },
    { id: 'pth', label: 'PTH trajectory', target: 'Trend + target' },
    { id: 'soltriol', label: 'Soltriol timing score', target: 'Morning window' },
  ],
  cta: { label: 'See the dashboard', href: MARKETING_ROUTES.cliniciansTriage },
} as const

export const HOME_DINA = {
  eyebrow: 'What you give your patient',
  headline: 'You give your patient DINA.',
  paragraphs: [
    'DINA is the patient agent built into DIOS. It tells your patient when to take their Soltriol, confirms the morning window is met, monitors cofactor adherence, and flags conflicts before they become clinical problems.',
    'Your patient does not need to understand chrono-immunotherapy. DINA understands it for them.',
  ],
} as const

export const HOME_VISIBILITY = {
  eyebrow: 'The 90-day gap',
  headline: 'Closed.',
  paragraphs: [
    'Your patient took their Soltriol at the wrong time last Tuesday. DIOS saw it. DINA corrected it. You will see it in the dashboard on Monday morning.',
    'You do not need to wait for the next blood draw.',
  ],
} as const

export const HOME_CLINICIAN_TYPES = {
  eyebrow: 'Built for three kinds of clinician',
  headline: 'Wherever you are in the journey.',
  types: [
    {
      id: 'coimbra',
      title: 'Coimbra or Gominak practice',
      body: 'You already use the protocol. DIOS gives you the infrastructure your protocol has never had.',
    },
    {
      id: 'gp',
      title: 'GP — curriculum sceptic',
      body: 'You suspect Vitamin D is more important than the curriculum suggested. DIOS will show you why — and give you the tools to act on it.',
    },
    {
      id: 'registrar',
      title: 'Registrar or foundation doctor',
      body: 'You want to understand precision immunology before it becomes mainstream. DIOS has a structured clinical curriculum that starts with why Soltriol is a hormone and ends with how to monitor it properly.',
    },
  ],
} as const

export const HOME_CHRONOBIOBANK = {
  eyebrow: 'Free for your patients',
  headline: 'Evidence-generating for the field.',
  paragraphs: [
    'Every patient on DIOS contributes de-identified data to the Chronobiobank — the only longitudinal dataset linking Soltriol timing, sleep architecture, and immune markers in a single research instrument.',
    'You are not just improving your patient\'s protocol. You are building the evidence base that will change how the NHS prescribes this hormone.',
  ],
  cta: { label: 'Chronobiobank', href: MARKETING_ROUTES.chronobiobank },
} as const

export const HOME_START = {
  eyebrow: 'Start here',
  headline: 'Start with one patient.',
  body: 'Not a demo. Not a procurement process. One patient on one protocol. Eight weeks of data. You decide whether it changes how you practice.',
  ctas: [
    {
      id: 'enrol',
      label: 'Enrol your first patient',
      href: '/signup/clinician',
      variant: 'primary' as const,
    },
    {
      id: 'curriculum',
      label: 'Learn the Soltriol curriculum',
      detail: '13 CPD modules · RCGP accredited',
      href: MARKETING_ROUTES.science,
      variant: 'secondary' as const,
    },
    {
      id: 'patient',
      label: 'Your patient has DIOS — get DINA',
      href: MARKETING_ROUTES.dina,
      variant: 'tertiary' as const,
    },
  ],
} as const

export const HOME_CLINICAL_DISCLAIMER =
  'Clinical decision support. You retain escalation authority.' as const

export const HOME_GOVERNANCE_LINE =
  'Clinician review before dose changes · UK GDPR · HIPAA path · FDA-cleared TipTraQ where stated' as const

/** Science page — unchanged export */
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

/** How-it-works page — re-export */
export const HOME_INSIGHT = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'TipTraQ sets the clock.',
  headlineEmphasis: 'DINA proves adherence.',
  statement:
    'Three nights every six months. Quarterly bloods. Daily dose confirmations. A complete Precision Immunology picture.',
  ctaLabel: 'Circadian model',
  ctaHref: '/circadian-digital-twin',
} as const

export const HOME_CTA_MEDIA = {
  video: '/first-light.mp4',
  poster: '/your-light-dose.jpg',
} as const

export const HOME_STEPS = {
  eyebrow: 'How it works',
  headline: 'Scan. Time. Triage.',
  steps: [
    { n: '01', line: 'TipTraQ — three nights every six months.' },
    { n: '02', line: 'Daily DINA — Soltriol window confirmations.' },
    { n: '03', line: 'Quarterly bloods — PTH confirms what sleep shows.' },
  ],
  walkthroughCta: { label: 'Clinician walkthrough', href: MARKETING_ROUTES.clinicians },
  demoCta: { label: 'DINA demo', href: MARKETING_ROUTES.dina },
} as const
