import { SECOPEUTIC_UK_STARTER_CLINICS } from '@/lib/secopeutic/certified-clinics'
import { CLINICAL_GUIDE_CLINICIANS } from '@/lib/secopeutic/clinical-guide-clinicians'
import { SECOPUTIC_CLINICS_PATH, SECOPUTIC_DEMO_PATH, SECOPUTIC_EVIDENCE_PATH, SECOPUTIC_PILOT_PATH } from '@/lib/secopeutic/site'

export const SECOPEUTIC_LANDING_META = {
  title: 'DIOS — Dose intelligence for clinicians',
  description:
    'Dose windows from mobile diagnostics, blood panels, and TipTraQ sleep blocks for high-dose vitamin D practice.',
} as const

export const SECOPEUTIC_LANDING_HERO = {
  headlineLead: 'Learn',
  headlineAccent: 'Dose Intelligence',
  headlineSub: 'from leading experts',
  support:
    'Our clinical-grade tools ensure protocols are tailored to your patients changing needs.',
  primaryCta: { label: 'Claim free pilot', href: SECOPUTIC_PILOT_PATH },
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
      body: 'Studies on titration and outcomes.',
      href: SECOPUTIC_EVIDENCE_PATH,
      linkLabel: 'Browse evidence',
      icon: 'book',
      panelTitle: 'Evidence for prescribers',
      panelSeeAll: { label: 'See all', href: SECOPUTIC_EVIDENCE_PATH },
      panelLayout: 'grid',
      panelItems: [
        {
          title: 'Sleep architecture and high-dose vitamin D.',
          meta: 'Clinical guide · Sleep-led practice',
          href: `${SECOPUTIC_EVIDENCE_PATH}#gominak-sleep-2012`,
          clinicians: [CLINICAL_GUIDE_CLINICIANS.gominak, CLINICAL_GUIDE_CLINICIANS.munro],
        },
        {
          title: 'PTH suppression between lab draws.',
          meta: 'Clinical guide · PTH-led practice',
          href: `${SECOPUTIC_EVIDENCE_PATH}#coimbra-cns-2014`,
          clinicians: [CLINICAL_GUIDE_CLINICIANS.coimbra],
        },
        {
          title: 'Population dosing misses biology.',
          meta: 'Position paper · Precision chronotherapy',
          href: `${SECOPUTIC_EVIDENCE_PATH}#munro-precision-timing`,
          clinicians: [CLINICAL_GUIDE_CLINICIANS.munro],
        },
        {
          title: 'Low vitamin D worsens COVID outcomes.',
          meta: 'Clinical guide · COVID review',
          href: `${SECOPUTIC_EVIDENCE_PATH}#castillo-covid-2020`,
          clinicians: [CLINICAL_GUIDE_CLINICIANS.seheult],
        },
      ],
    },
    {
      id: 'tools',
      label: 'Safety tools',
      body: 'Tools shaped to your practice.',
      href: SECOPUTIC_DEMO_PATH,
      linkLabel: 'Open monitoring demo',
      icon: 'tools',
      panelTitle: 'Monitoring this week',
      panelSeeAll: { label: 'Open demo', href: SECOPUTIC_DEMO_PATH },
      panelLayout: 'grid',
      panelItems: [
        {
          title: 'Sean James record.',
          meta: 'TipTraQ leads the 90-day draw.',
          href: `${SECOPUTIC_DEMO_PATH}/patients/sean-james`,
        },
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
          title: 'Helena Kowalski record.',
          meta: 'Sleep-led demo patient.',
          href: `${SECOPUTIC_DEMO_PATH}/patients/helena-kowalski`,
        },
      ],
    },
    {
      id: 'clinics',
      label: 'Certified clinics',
      body: 'UK directory. Verified opt-in soon.',
      href: SECOPUTIC_CLINICS_PATH,
      linkLabel: 'Open clinic directory',
      icon: 'clinics',
      panelTitle: 'UK high-dose D3 directory',
      panelSeeAll: { label: 'Open directory', href: SECOPUTIC_CLINICS_PATH },
      panelLayout: 'grid',
      panelItems: SECOPEUTIC_UK_STARTER_CLINICS.map((clinic) => ({
        title: clinic.cardTitle,
        meta: clinic.cardMeta,
        href: `${SECOPUTIC_CLINICS_PATH}#${clinic.id}`,
      })),
    },
  ],
} as const

export const SECOPEUTIC_LANDING_PILOT = {
  number: '06',
  headline: 'Free pilot for three patients.',
  support: 'Run real cases for six months. Keep your existing lab workflow.',
  cta: { label: 'Claim free pilot', href: SECOPUTIC_PILOT_PATH },
  demoCta: { label: 'Open monitoring demo', href: SECOPUTIC_DEMO_PATH },
} as const

export const SECOPEUTIC_LANDING_DISCLAIMER =
  'Education and monitoring infrastructure only. DIOS flags and escalates. It does not prescribe. The licensed clinician owns every treatment decision.'
