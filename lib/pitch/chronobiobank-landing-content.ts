import { COIMBRA_PARADOX_STATEMENT } from '@/lib/chronobiobank/coimbra-paradox'
import { CLINICIAN_ENTRY, PATIENT_PREVIEW_ENTRY } from '@/lib/pitch/audience-entry-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const CHRONOBIOBANK_LANDING_META = {
  title: 'Chronobiobank — DIOS',
  description:
    'The first clinical dataset with biological time and clock time together. Cannot be rebuilt from old records.',
} as const

export const CHRONOBIOBANK_HERO = {
  eyebrow: 'Data infrastructure',
  headline: 'Chronobiobank',
  headlineEmphasis: 'indexed by biological time.',
  lede: 'Every drug was tested on clock time. DIOS records biological time too — the first dataset with both.',
} as const

export const CHRONOBIOBANK_SECTIONS = [
  {
    id: 'what',
    eyebrow: 'What it is',
    body: 'Daily medicine logs, monthly phone light scans, 90-day bloods, and six-month TipTraQ sleep blocks — each tagged with biological time and wall-clock time. Patients choose what they share.',
  },
  {
    id: 'why',
    eyebrow: 'Why it cannot be retrofitted',
    body: 'Most health apps record when a dose happened on the wall clock. They do not record biological time at that moment. You cannot rebuild timed-medicine outcomes from those datasets alone.',
  },
  {
    id: 'contribute',
    eyebrow: 'How to contribute',
    body: `${COIMBRA_PARADOX_STATEMENT}\n\nClinical consent and research contribution are separate toggles. Patients control what enters the bank; practitioners enrol cohorts through DIOS.`,
  },
] as const

export const CHRONOBIOBANK_CTA = {
  primary: { label: PATIENT_PREVIEW_ENTRY.ctaLabel, href: PATIENT_PREVIEW_ENTRY.href },
  secondary: {
    label: CLINICIAN_ENTRY.cohortLabel,
    href: CLINICIAN_ENTRY.href,
  },
  tertiary: { label: 'Clinical evidence', href: MARKETING_ROUTES.evidence },
} as const
