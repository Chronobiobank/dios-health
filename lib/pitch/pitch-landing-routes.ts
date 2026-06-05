import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'
import {
  RETINOMIC_EVIDENCE_SECTION,
  RETINOMIC_FEATURES_SECTION,
  RETINOMIC_LANDING_EVIDENCE,
  RETINOMIC_LANDING_FEATURES,
  RETINOMIC_LANDING_PHILOSOPHY,
  RETINOMIC_LANDING_PROBLEM_CARDS,
  RETINOMIC_PROBLEM_SECTION,
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
const LANDING_PITCH_ROUTES = ['/pitch/problem', '/pitch/clinical-proof', '/pitch/chronobiobank'] as const

function landingSubgridRoutes(): string[] {
  const cards = [
    ...RETINOMIC_LANDING_PROBLEM_CARDS,
    ...RETINOMIC_LANDING_FEATURES,
    ...RETINOMIC_LANDING_EVIDENCE,
  ]
  return cards
    .filter((card) => card.href && !card.external)
    .map((card) => card.href!.split('#')[0]!)
}

/** Internal routes linked from landing — prefetched after home loads */
export function getPitchLandingPrefetchRoutes(): string[] {
  const fromTiles = PITCH_MINIMAL_TILES.flatMap((tile) => {
    const routes = [tile.href.split('#')[0]!]
    if (tile.secondaryHref) routes.push(tile.secondaryHref.split('#')[0]!)
    return routes
  })

  const fromDeck = [
    RETINOMIC_PROBLEM_SECTION.primaryCtaHref,
    RETINOMIC_PROBLEM_SECTION.secondaryCtaHref,
    RETINOMIC_FEATURES_SECTION.primaryCtaHref,
    RETINOMIC_FEATURES_SECTION.secondaryCtaHref,
    RETINOMIC_LANDING_PHILOSOPHY.ctaHref,
    RETINOMIC_EVIDENCE_SECTION.primaryCtaHref,
    RETINOMIC_EVIDENCE_SECTION.secondaryCtaHref,
    '/onboarding',
  ]

  return [
    ...new Set([
      ...fromTiles,
      ...fromDeck,
      ...LANDING_FOOTER_ROUTES,
      ...LANDING_PITCH_ROUTES,
      ...landingSubgridRoutes(),
      '/auth/signin',
    ]),
  ]
}
