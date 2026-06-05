import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'
import {
  RETINOMIC_FEATURES_SECTION,
  RETINOMIC_LANDING_PHILOSOPHY,
} from '@/lib/pitch/retinomic-landing-copy'

/** Keep in sync with {@link LANDING_FOOTER_SECTIONS} in components/sections/navigation.ts */
const LANDING_FOOTER_ROUTES = [
  '/how-it-works',
  '/signup/clinician',
  '/contact',
  '/evidence',
  '/circadian-digital-twin',
  '/tiptraq',
  '/privacy',
  '/terms',
] as const

/** Pitch detail pages linked from landing deck tiles only */
const LANDING_PITCH_ROUTES = ['/pitch/clinical-proof', '/pitch/credibility'] as const

/** Internal routes linked from landing — prefetched after home loads */
export function getPitchLandingPrefetchRoutes(): string[] {
  const fromTiles = PITCH_MINIMAL_TILES.flatMap((tile) => {
    const routes = [tile.href.split('#')[0]!]
    if (tile.secondaryHref) routes.push(tile.secondaryHref.split('#')[0]!)
    return routes
  })

  const fromDeck = [
    RETINOMIC_FEATURES_SECTION.primaryCtaHref,
    RETINOMIC_FEATURES_SECTION.secondaryCtaHref,
    RETINOMIC_LANDING_PHILOSOPHY.ctaHref,
    '/onboarding',
  ]

  return [
    ...new Set([
      ...fromTiles,
      ...fromDeck,
      ...LANDING_FOOTER_ROUTES,
      ...LANDING_PITCH_ROUTES,
      '/auth/signin',
    ]),
  ]
}
