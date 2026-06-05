'use client'

import Image from 'next/image'

import type { PitchMinimalTile } from '@/lib/pitch/pitch-minimal'

import { PitchCtaLink } from './pitch-cta-link'
import { PitchTileEyebrow, PitchTileSub, PitchTileTitle } from './pitch-primitives'

/** Full-viewport glass narrative tile — image in inner glass, copy + CTAs to detail pages */
export function PitchMinimalTileCard({ tile }: { tile: PitchMinimalTile }) {
  const isPrimaryHero = tile.id === 'pitch-hook'

  return (
    <article className="pitch-glass-tile dios-glass-outer">
      <div className="pitch-glass-tile__media dios-glass-inner">
        <Image
          src={tile.image}
          alt={tile.imageAlt}
          fill
          priority={isPrimaryHero}
          sizes="(max-width: 76rem) 100vw, 76rem"
          className="pitch-glass-tile__image object-cover object-center"
        />
        <div className="pitch-glass-tile__scrim" aria-hidden />
      </div>

      <div className="pitch-glass-tile__copy">
        <PitchTileEyebrow>{tile.eyebrow}</PitchTileEyebrow>
        <PitchTileTitle as={isPrimaryHero ? 'h1' : 'h2'} className="mt-2">
          {tile.title}
        </PitchTileTitle>
        <PitchTileSub className="mt-2">{tile.subtitle}</PitchTileSub>

        <div className="pitch-glass-tile__ctas mt-5 flex flex-wrap gap-2.5 sm:gap-3">
          <PitchCtaLink href={tile.href} className="dios-btn-on-light pitch-glass-tile__cta">
            {tile.ctaLabel} →
          </PitchCtaLink>
          {tile.secondaryHref && tile.secondaryCtaLabel ? (
            <PitchCtaLink
              href={tile.secondaryHref}
              className="dios-btn-on-light--secondary pitch-glass-tile__cta"
            >
              {tile.secondaryCtaLabel} →
            </PitchCtaLink>
          ) : null}
        </div>
      </div>
    </article>
  )
}
