import { SECOPUTIC_DEMO_PATH } from '@/lib/secopeutic/site'

export const SECOPEUTIC_LANDING_META = {
  title: 'Secopeutic — Clinician safety infrastructure',
  description:
    'Monitoring infrastructure for high-dose secohormone practice. City Labs, TipTraQ sleep blocks, and dose windows on one audit trail.',
} as const

export const SECOPEUTIC_LANDING_HERO = {
  eyebrow: 'For clinicians',
  headline: 'Safe secohormone monitoring for you.',
  support: 'Replace spreadsheets with audit-ready safety, sleep, and timing between blood draws.',
  primaryCta: { label: 'Claim free pilot', href: '/clinicians' },
  secondaryCta: { label: 'View pilot demo', href: SECOPUTIC_DEMO_PATH },
} as const

export const SECOPEUTIC_LANDING_STAKES = {
  number: '01',
  headline: 'The safety gap is real.',
  support: 'High-dose protocols still run on quarterly panels and manual spreadsheets today.',
} as const

export const SECOPEUTIC_LANDING_PRODUCT = {
  number: '02',
  headline: 'One ledger. Three signal layers.',
  support: 'City Labs ingested, TipTraQ ordered, dose windows logged on one timeline.',
  layers: [
    {
      id: 'safety',
      label: 'Safety gate',
      body: 'Calcium, PTH, 25-OH-D, urinary calcium, and eGFR on every draw.',
    },
    {
      id: 'sleep',
      label: 'Sleep architecture',
      body: 'Clinician-ordered TipTraQ blocks between City Labs panels.',
    },
    {
      id: 'timing',
      label: 'Dose intelligence',
      body: 'Morning-window adherence logged without autonomous dose advice.',
    },
  ],
} as const

export const SECOPEUTIC_LANDING_SPECTRUM = {
  number: '03',
  headline: 'Stable, Review, and Hold.',
  support: 'You set thresholds. Secopeutic flags drift and exports the audit trail.',
  zones: [
    { id: 'stable', label: 'Stable', body: 'Markers in range. Routine monitoring cadence.' },
    { id: 'review', label: 'Review', body: 'Drift toward limits. Clinician prompt tightens cadence.' },
    { id: 'hold', label: 'Hold', body: 'Toxicity signal. Alert and recommend clinical review.' },
  ],
} as const

export const SECOPEUTIC_LANDING_PRACTICES = {
  number: '04',
  headline: 'Built for your practice type.',
  support: 'Gominak sleep-led or Coimbra PTH-led, same safety gate underneath.',
  cards: [
    {
      id: 'gominak',
      label: 'Gominak practice',
      headline: 'Sleep leads the B phase.',
      support: 'Keep City Labs. Add TipTraQ sleep blocks on the same patient row.',
      demoHref: `${SECOPUTIC_DEMO_PATH}/patients/helena-kowalski`,
      demoLabel: 'See Gominak demo patient',
    },
    {
      id: 'coimbra',
      label: 'Coimbra practice',
      headline: 'PTH trajectory between draws.',
      support: 'Safety ledger plus timing adherence before the next IU decision.',
      demoHref: `${SECOPUTIC_DEMO_PATH}/patients/marcus-okonkwo`,
      demoLabel: 'See Coimbra demo patient',
    },
  ],
} as const

export const SECOPEUTIC_LANDING_PILOT = {
  number: '05',
  headline: 'Free pilot for three patients.',
  support: 'Run real cases for six months. No change to your City Labs workflow.',
  cta: { label: 'Claim free pilot', href: '/clinicians' },
  demoCta: { label: 'Open pilot dashboard', href: SECOPUTIC_DEMO_PATH },
} as const

export const SECOPEUTIC_LANDING_DISCLAIMER =
  'Monitoring infrastructure only. Secopeutic flags and escalates. It does not prescribe. The licensed clinician owns every treatment decision.'
