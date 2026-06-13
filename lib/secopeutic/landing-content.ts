import { CLINICAL_GUIDE_CLINICIANS } from '@/lib/secopeutic/clinical-guide-clinicians'
import { SECOPUTIC_DEMO_PATH } from '@/lib/secopeutic/site'

export const SECOPEUTIC_LANDING_META = {
  title: 'Secopeutic — High-dose vitamin D for clinicians',
  description:
    'Guidance, safety monitoring tools, and verified clinic connections for clinicians exploring high-dose vitamin D worldwide.',
} as const

export const SECOPEUTIC_LANDING_HERO = {
  headlineLead: 'Activate',
  headlineAccent: 'Vitamin D Therapy',
  headlineSub: 'with clinical precision',
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
      label: 'Clinical guide',
      body: 'Curated evidence and protocol context for licensed prescribers.',
      href: '/science',
      linkLabel: 'Browse evidence',
      icon: 'book',
      panelTitle: 'Evidence for prescribers',
      panelSeeAll: { label: 'See all', href: '/science' },
      panelLayout: 'grid',
      panelItems: [
        {
          title: 'Sleep architecture and high-dose vitamin D.',
          meta: 'Clinical guide · Sleep-led practice',
          href: `${SECOPUTIC_DEMO_PATH}/patients/helena-kowalski`,
          clinicians: [CLINICAL_GUIDE_CLINICIANS.gominak, CLINICAL_GUIDE_CLINICIANS.munro],
        },
        {
          title: 'PTH suppression between lab draws.',
          meta: 'Clinical guide · PTH-led practice',
          href: `${SECOPUTIC_DEMO_PATH}/patients/marcus-okonkwo`,
          clinicians: [CLINICAL_GUIDE_CLINICIANS.coimbra],
        },
        {
          title: 'Population dosing misses biology.',
          meta: 'Position paper · Precision chronotherapy',
          href: '/science',
          clinicians: [CLINICAL_GUIDE_CLINICIANS.munro],
        },
        {
          title: 'Low vitamin D worsens COVID outcomes.',
          meta: 'Clinical guide · COVID review',
          href: '/science',
          clinicians: [CLINICAL_GUIDE_CLINICIANS.seheult],
        },
      ],
    },
    {
      id: 'tools',
      label: 'Safety tools',
      body: 'Calcium, PTH, 25-OH-D, and eGFR on one timeline.',
      href: SECOPUTIC_DEMO_PATH,
      linkLabel: 'Open monitoring demo',
      icon: 'tools',
      panelTitle: 'Monitoring this week',
      panelSeeAll: { label: 'Open demo', href: SECOPUTIC_DEMO_PATH },
      panelItems: [
        {
          title: 'Cohort safety dashboard.',
          meta: 'Stable, Review, and Hold on one row.',
          href: SECOPUTIC_DEMO_PATH,
        },
        {
          title: 'Helena Kowalski record.',
          meta: 'Sleep-led demo patient.',
          href: `${SECOPUTIC_DEMO_PATH}/patients/helena-kowalski`,
        },
        {
          title: 'Marcus Okonkwo record.',
          meta: 'PTH-led demo patient.',
          href: `${SECOPUTIC_DEMO_PATH}/patients/marcus-okonkwo`,
        },
      ],
    },
    {
      id: 'clinics',
      label: 'Certified clinics',
      body: 'Verified practices opt in only. Find colleagues near you.',
      href: '/clinicians',
      linkLabel: 'Find certified clinics',
      icon: 'clinics',
      panelTitle: 'Clinician pathways',
      panelSeeAll: { label: 'Find clinics', href: '/clinicians' },
      panelItems: [
        {
          title: 'Exploring high-dose vitamin D.',
          meta: 'Connect before your first panel.',
          href: '/science',
        },
        {
          title: 'Sleep-led certified practices.',
          meta: 'TipTraQ blocks between lab panels.',
          href: '/clinicians',
        },
        {
          title: 'PTH-led certified practices.',
          meta: 'Safety ledger plus timing adherence.',
          href: '/clinicians',
        },
      ],
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
