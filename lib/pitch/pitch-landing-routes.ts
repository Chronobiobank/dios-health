import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'

/** Keep in sync with {@link LANDING_FOOTER_SECTIONS} in components/sections/navigation.ts */
const LANDING_FOOTER_ROUTES = [
  '/how-it-works',
  '/how-it-works/demo',
  '/clinicians',
  '/clinicians/triage',
  '/science',
  '/chronobiobank',
  '/signup/clinician',
  '/contact',
  '/evidence',
  '/circadian-digital-twin',
  '/tiptraq',
  '/privacy',
  '/terms',
] as const

const LANDING_PITCH_ROUTES = [
  '/pitch/hook',
  '/pitch/problem',
  '/pitch/clinical-proof',
  '/pitch/chronobiobank',
  '/pitch/how-it-works',
] as const

/** Internal routes linked from landing — prefetched after home loads */
export function getPitchLandingPrefetchRoutes(): string[] {
  const fromTiles = PITCH_MINIMAL_TILES.flatMap((tile) => {
    const routes = [tile.href.split('#')[0]!]
    if (tile.secondaryHref) routes.push(tile.secondaryHref.split('#')[0]!)
    return routes
  })

  return [
    ...new Set([
      ...fromTiles,
      ...LANDING_FOOTER_ROUTES,
      ...LANDING_PITCH_ROUTES,
      '/onboarding',
      '/auth/signin',
    ]),
  ]
}
