'use client'

import {
  RETINOMIC_FEATURES_SECTION,
  RETINOMIC_LANDING_FEATURES,
} from '@/lib/pitch/retinomic-landing-copy'

import { PitchCtaLink } from './pitch-cta-link'
import { PitchMediaTile } from './pitch-media-tile'

export function PitchFeatureGrid() {
  const section = RETINOMIC_FEATURES_SECTION

  return (
    <div className="pitch-feature-panel dios-glass-outer">
      <header className="pitch-feature-panel__head">
        <p className="pitch-feature-panel__eyebrow">{section.eyebrow}</p>
        <h2 className="pitch-feature-panel__title">{section.title}</h2>
      </header>

      <ul className="pitch-feature-subgrid min-h-0 flex-1">
        {RETINOMIC_LANDING_FEATURES.map((feature) => (
          <li key={feature.id}>
            <PitchMediaTile image={feature.image} imageAlt={feature.imageAlt} size="subgrid">
              <p className="pitch-tile-card-title line-clamp-2 text-[0.8125rem] leading-snug sm:text-sm">
                {feature.lead}
              </p>
              <p className="pitch-tile-sub pitch-tile-sub--light !mt-1.5 hidden !text-[0.6875rem] !leading-snug sm:block sm:!text-xs">
                {feature.body}
              </p>
            </PitchMediaTile>
          </li>
        ))}
      </ul>

      <div className="pitch-feature-panel__ctas flex flex-wrap gap-2.5 sm:gap-3">
        <PitchCtaLink href={section.primaryCtaHref} className="pitch-btn-primary">
          {section.primaryCtaLabel}
        </PitchCtaLink>
        <PitchCtaLink href={section.secondaryCtaHref} className="pitch-btn-secondary">
          {section.secondaryCtaLabel} →
        </PitchCtaLink>
      </div>
    </div>
  )
}
