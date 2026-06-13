import { SECOPEUTIC_UK_STARTER_CLINICS } from '@/lib/secopeutic/certified-clinics'
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
      panelLayout: 'grid',
      panelItems: [
        {
          title: 'Cohort safety dashboard.',
          meta: 'Stable, Review, and Hold on one row.',
          href: SECOPUTIC_DEMO_PATH,
        },
        {
          title: 'Marcus Okonkwo record.',
          meta: 'PTH-led demo patient.',
          href: `${SECOPUTIC_DEMO_PATH}/patients/marcus-okonkwo`,
        },
        {
          title: 'Renata Ferreira record.',
          meta: 'Review zone · timing gate.',
          href: `${SECOPUTIC_DEMO_PATH}/patients/renata-ferreira`,
        },
        {
          title: 'Helena Kowalski record.',
          meta: 'Sleep-led demo patient.',
          href: `${SECOPUTIC_DEMO_PATH}/patients/helena-kowalski`,
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
      panelTitle: 'UK starter clinics',
      panelSeeAll: { label: 'Find clinics', href: '/clinicians' },
      panelLayout: 'grid',
      panelItems: SECOPEUTIC_UK_STARTER_CLINICS.map((clinic) => ({
        title: clinic.cardTitle,
        meta: clinic.cardMeta,
        href: clinic.href,
      })),
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
