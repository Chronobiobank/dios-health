'use client'

import type { PitchMinimalTile } from '@/lib/pitch/pitch-minimal'

import { PitchCtaLink } from './pitch-cta-link'
import { PitchMediaTile } from './pitch-media-tile'
import { PitchTileEyebrow, PitchTileSub, PitchTileTitle } from './pitch-primitives'

export function PitchMinimalTileCard({ tile }: { tile: PitchMinimalTile }) {
  const isPrimaryHero = tile.id === 'pitch-hook'

  return (
    <PitchMediaTile image={tile.image} imageAlt={tile.imageAlt} videoSrc={tile.videoSrc} size="hero">
      <div className="pitch-tile-copy">
        <PitchTileEyebrow light>{tile.eyebrow}</PitchTileEyebrow>
        <PitchTileTitle
          as={isPrimaryHero ? 'h1' : 'h2'}
          light
          className={isPrimaryHero ? 'pitch-tile-title--hero mt-2' : 'mt-2'}
        >
          {tile.title}
        </PitchTileTitle>
        <PitchTileSub light className="mt-2">
          {tile.subtitle}
        </PitchTileSub>
        <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
          <PitchCtaLink href={tile.href} className="pitch-btn-primary">
            {tile.ctaLabel}
            {!isPrimaryHero ? ' →' : null}
          </PitchCtaLink>
          {tile.secondaryHref && tile.secondaryCtaLabel ? (
            <PitchCtaLink href={tile.secondaryHref} className="pitch-btn-secondary">
              {tile.secondaryCtaLabel} →
            </PitchCtaLink>
          ) : null}
        </div>
      </div>
    </PitchMediaTile>
  )
}
