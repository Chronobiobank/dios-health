import { PITCH_DETAIL_PAGES, PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'

/** Internal routes linked from landing tiles — prefetched after home loads */
export function getPitchLandingPrefetchRoutes(): string[] {
  const fromTiles = PITCH_MINIMAL_TILES.flatMap((tile) => {
    const routes = [tile.href.split('#')[0]!]
    if (tile.secondaryHref) routes.push(tile.secondaryHref.split('#')[0]!)
    return routes
  })

  const pitchDetails = PITCH_DETAIL_PAGES.map((page) => `/pitch/${page.slug}`)

  return [...new Set([...fromTiles, ...pitchDetails, '/signin'])]
}
