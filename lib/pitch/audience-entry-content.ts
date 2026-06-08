import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

/** Canonical labels — patient preview vs clinician signup */
export const PATIENT_PREVIEW_ENTRY = {
  label: 'Patient preview',
  navLabel: 'Patient preview',
  ctaLabel: 'Try patient scan',
  href: MARKETING_ROUTES.onboarding,
  detail: '60-second phone scan — saved on this device, no account yet',
} as const

export const PATIENT_ACCOUNT_ENTRY = {
  label: 'Create patient account',
  href: '/auth/signup',
  detail: 'Full signup with chronoprofile and dashboard access',
} as const

export const CLINICIAN_ENTRY = {
  label: 'Clinician sign up',
  navLabel: 'Clinician sign up',
  cohortLabel: 'Enrol your cohort',
  href: MARKETING_ROUTES.signupClinician,
  detail: 'Four-step wizard — practice details, verification, first patient invite',
} as const

export const ONBOARDING_PREVIEW_NOTE =
  'Patient preview only — no account is created. Your clinician maps the protocol after cohort enrolment.'
