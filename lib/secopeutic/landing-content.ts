import { SECOPUTIC_DEMO_PATH } from '@/lib/secopeutic/site'

export const SECOPEUTIC_LANDING_META = {
  title: 'Secopeutic — High-dose vitamin D for clinicians',
  description:
    'Guidance, safety monitoring tools, and verified clinic connections for clinicians exploring high-dose vitamin D worldwide.',
} as const

export const SECOPEUTIC_LANDING_HERO = {
  eyebrow: 'For clinicians worldwide',
  headline: 'Your home for high-dose vitamin D.',
  support:
    'Evidence, monitoring tools, and verified clinics for practitioners ready to learn more.',
  primaryCta: { label: 'Claim free pilot', href: '/clinicians' },
  secondaryCta: { label: 'View monitoring demo', href: SECOPUTIC_DEMO_PATH },
} as const

export const SECOPEUTIC_LANDING_STAKES = {
  number: '01',
  headline: 'Curiosity needs a safety floor.',
  support:
    'Many clinicians hear about vitamin D3 at dose. Few have audit-ready monitoring between panels.',
} as const

export const SECOPEUTIC_LANDING_PLATFORM = {
  number: '02',
  headline: 'Learn, monitor, and connect.',
  support: 'One platform whether you are exploring or already running high-dose protocols.',
  pillars: [
    {
      id: 'learn',
      label: 'Clinician guidance',
      body: 'Curated evidence and protocol context. Education for licensed prescribers, not patient dosing advice.',
      href: '/science',
      linkLabel: 'Browse evidence',
    },
    {
      id: 'tools',
      label: 'Safety tools',
      body: 'Calcium, PTH, 25-OH-D, urinary calcium, and eGFR on one timeline between blood draws.',
      href: SECOPUTIC_DEMO_PATH,
      linkLabel: 'Open monitoring demo',
    },
    {
      id: 'clinics',
      label: 'Certified clinics',
      body: 'Verified practices opt in only. Find colleagues running supervised high-dose vitamin D near you.',
      href: '/clinicians',
      linkLabel: 'Find certified clinics',
    },
  ],
} as const

export const SECOPEUTIC_LANDING_PRODUCT = {
  number: '03',
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
      body: 'Clinician-ordered TipTraQ blocks between lab panels.',
    },
    {
      id: 'timing',
      label: 'Dose intelligence',
      body: 'Morning-window adherence logged without autonomous dose advice.',
    },
  ],
} as const

export const SECOPEUTIC_LANDING_SPECTRUM = {
  number: '04',
  headline: 'Stable, Review, and Hold.',
  support: 'You set thresholds. Secopeutic flags drift and exports the audit trail.',
  zones: [
    { id: 'stable', label: 'Stable', body: 'Markers in range. Routine monitoring cadence.' },
    { id: 'review', label: 'Review', body: 'Drift toward limits. Clinician prompt tightens cadence.' },
    { id: 'hold', label: 'Hold', body: 'Toxicity signal. Alert and recommend clinical review.' },
  ],
} as const

export const SECOPEUTIC_LANDING_PATHWAYS = {
  number: '05',
  headline: 'Wherever you are on the pathway.',
  support: 'Exploring, sleep-led, or PTH-led practice. Same safety gate underneath.',
  cards: [
    {
      id: 'exploring',
      label: 'New to high-dose vitamin D',
      headline: 'Start with evidence and peers.',
      support: 'Read the clinician library. Connect with a certified practice before your first panel.',
      demoHref: '/science',
      demoLabel: 'Browse clinician guidance',
    },
    {
      id: 'gominak',
      label: 'Sleep-led practice',
      headline: 'Sleep shapes the next phase.',
      support: 'Keep your lab workflow. Add TipTraQ sleep blocks on the same patient row.',
      demoHref: `${SECOPUTIC_DEMO_PATH}/patients/helena-kowalski`,
      demoLabel: 'See sleep-led demo patient',
    },
    {
      id: 'coimbra',
      label: 'PTH-led practice',
      headline: 'PTH trajectory between draws.',
      support: 'Safety ledger plus timing adherence before the next IU decision.',
      demoHref: `${SECOPUTIC_DEMO_PATH}/patients/marcus-okonkwo`,
      demoLabel: 'See PTH-led demo patient',
    },
  ],
} as const

export const SECOPEUTIC_LANDING_PILOT = {
  number: '06',
  headline: 'Free pilot for three patients.',
  support: 'Run real cases for six months. Keep your existing lab workflow.',
  cta: { label: 'Claim free pilot', href: '/clinicians' },
  demoCta: { label: 'Open monitoring demo', href: SECOPUTIC_DEMO_PATH },
} as const

export const SECOPEUTIC_LANDING_DISCLAIMER =
  'Education and monitoring infrastructure only. Secopeutic flags and escalates. It does not prescribe. The licensed clinician owns every treatment decision.'
