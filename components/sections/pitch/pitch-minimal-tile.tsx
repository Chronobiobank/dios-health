'use client'

import Link from 'next/link'

import type { PitchMinimalTile } from '@/lib/pitch/pitch-minimal'

import { PitchMediaTile } from './pitch-media-tile'
import { PitchTileEyebrow, PitchTileSub, PitchTileTitle } from './pitch-primitives'

export function PitchMinimalTileCard({ tile }: { tile: PitchMinimalTile }) {
  const isPrimaryHero = tile.id === 'pitch-hook'

  return (
    <PitchMediaTile image={tile.image} imageAlt={tile.imageAlt} videoSrc={tile.videoSrc} size="hero">
      <PitchTileEyebrow light>{tile.eyebrow}</PitchTileEyebrow>
      <PitchTileTitle
        as="h2"
        light
        className={isPrimaryHero ? 'mt-2 max-w-3xl text-4xl leading-tight sm:text-6xl' : 'mt-2 max-w-xl'}
      >
        {tile.title}
      </PitchTileTitle>
      <PitchTileSub light className="mt-2 max-w-lg">
        {tile.subtitle}
      </PitchTileSub>
      <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
        <Link href={tile.href} className="pitch-btn-primary">
          {tile.ctaLabel} →
        </Link>
        {tile.secondaryHref && tile.secondaryCtaLabel ? (
          <Link href={tile.secondaryHref} className="pitch-btn-secondary">
            {tile.secondaryCtaLabel} →
          </Link>
        ) : null}
      </div>
    </PitchMediaTile>
  )
}
