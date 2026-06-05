'use client'

import { RETINOMIC_LANDING_PHILOSOPHY } from '@/lib/pitch/retinomic-landing-copy'

import { PitchCtaLink } from './pitch-cta-link'
import { PitchMediaTile } from './pitch-media-tile'
import { PitchTileEyebrow, PitchTileSub, PitchTileTitle } from './pitch-primitives'

export function PitchPhilosophySection() {
  const { eyebrow, headline, subheadline, image, imageAlt, ctaLabel, ctaHref } =
    RETINOMIC_LANDING_PHILOSOPHY

  return (
    <PitchMediaTile image={image} imageAlt={imageAlt} size="hero" priority unoptimized>
      <div className="pitch-tile-copy">
        <PitchTileEyebrow light>{eyebrow}</PitchTileEyebrow>
        <PitchTileTitle light className="mt-2">
          {headline}
        </PitchTileTitle>
        <PitchTileSub light className="mt-3 sm:mt-4">
          {subheadline}
        </PitchTileSub>

        <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5 sm:gap-3">
          <PitchCtaLink href={ctaHref} className="dios-btn-on-dark">
            {ctaLabel}
          </PitchCtaLink>
          <PitchCtaLink href="/onboarding" className="dios-btn-on-dark--secondary">
            Free scan
          </PitchCtaLink>
        </div>
      </div>
    </PitchMediaTile>
  )
}
