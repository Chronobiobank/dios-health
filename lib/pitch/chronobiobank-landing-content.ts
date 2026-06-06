import { COIMBRA_PARADOX_STATEMENT } from '@/lib/chronobiobank/coimbra-paradox'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const CHRONOBIOBANK_LANDING_META = {
  title: 'Chronobiobank — DIOS',
  description:
    'The first clinical dataset indexed by biological time and clock time together. Cannot be retrofitted.',
} as const

export const CHRONOBIOBANK_HERO = {
  eyebrow: 'Data infrastructure',
  headline: 'Chronobiobank',
  headlineEmphasis: 'indexed by biological time.',
  lede: 'Every drug was developed assuming clock time. DIOS is built on biological time — and the Chronobiobank is the first clinical dataset indexed by both.',
} as const

export const CHRONOBIOBANK_SECTIONS = [
  {
    id: 'what',
    eyebrow: 'What it is',
    body: 'A dual-indexed outcomes layer: each dose event, lab draw, and sleep session is tagged with BTI (biological time) and wall-clock time. Coimbra, Gominak, and circadian cohorts contribute structured protocol data with granular, revocable consent.',
  },
  {
    id: 'why',
    eyebrow: 'Why it cannot be retrofitted',
    body: 'Medisafe, Huma, and UK Biobank record when a dose happened on the wall clock. They do not record biological time at confirmation. Without BTI at dose, chronomedicine outcomes cannot be reconstructed from existing datasets.',
  },
  {
    id: 'contribute',
    eyebrow: 'How to contribute',
    body: `${COIMBRA_PARADOX_STATEMENT}\n\nClinical consent and research contribution are separate toggles. Patients control what enters the bank; practitioners enrol cohorts through DIOS.`,
  },
] as const

export const CHRONOBIOBANK_CTA = {
  primary: { label: 'Start as patient', href: MARKETING_ROUTES.onboarding },
  secondary: {
    label: 'Enrol a cohort',
    href: 'mailto:grant@dios.health?subject=Chronobiobank%20cohort%20enquiry',
  },
  tertiary: { label: 'Clinical evidence', href: MARKETING_ROUTES.evidence },
} as const
