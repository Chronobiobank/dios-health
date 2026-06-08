/** Marketing routes — landing section CTAs map to these full pages */
export const MARKETING_ROUTES = {
  home: '/',
  dina: '/dina',
  howItWorks: '/how-it-works',
  howItWorksDemo: '/how-it-works/demo',
  technology: '/technology',
  science: '/science',
  scienceFourCadences: '/science#four-cadences',
  /** HTML prototype `/learn` — maps to science curriculum */
  learn: '/science',
  evidence: '/evidence',
  /** Slide 01 — 87-day protocol visibility gap (patients + clinicians) */
  visibilityGap: '/evidence#visibility-gap',
  onboarding: '/onboarding',
  clinicians: '/clinicians',
  signupClinician: '/signup/clinician',
  cliniciansTriage: '/clinicians/triage',
  cliniciansTriagePrgc: '/clinicians/triage?tab=prgc',
  chronobiobank: '/chronobiobank',
  circadianDigitalTwin: '/circadian-digital-twin',
  cpoBriefing: '/contact?intent=cpo-briefing',
} as const
