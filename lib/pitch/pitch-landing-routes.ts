import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

/** Keep in sync with {@link LANDING_FOOTER_SECTIONS} in components/sections/navigation.ts */
const LANDING_FOOTER_ROUTES = [
  MARKETING_ROUTES.howItWorks,
  MARKETING_ROUTES.howItWorksDemo,
  MARKETING_ROUTES.clinicians,
  MARKETING_ROUTES.cliniciansTriage,
  MARKETING_ROUTES.science,
  MARKETING_ROUTES.chronobiobank,
  '/signup/clinician',
  '/contact',
  MARKETING_ROUTES.evidence,
  '/circadian-digital-twin',
  '/tiptraq',
  '/privacy',
  '/terms',
] as const

/** Med-timing narrative pages — prefetched after home loads */
export function getPitchLandingPrefetchRoutes(): string[] {
  return [
    ...new Set([
      ...LANDING_FOOTER_ROUTES,
      MARKETING_ROUTES.onboarding,
      '/auth/signin',
      '/pitch/problem',
      '/pitch/clinical-proof',
    ]),
  ]
}
