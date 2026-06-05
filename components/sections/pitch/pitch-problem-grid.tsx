'use client'

import {
  RETINOMIC_LANDING_PROBLEM_CARDS,
  RETINOMIC_PROBLEM_SECTION,
} from '@/lib/pitch/retinomic-landing-copy'

import { PitchCtaLink } from './pitch-cta-link'
import { PitchSubgridTile } from './pitch-subgrid-tile'

/** Landing screen 1 — light glass panel on standardised dosing in medicine */
export function PitchProblemGrid() {
  const section = RETINOMIC_PROBLEM_SECTION

  return (
    <div className="pitch-feature-panel dios-glass-outer">
      <header className="pitch-feature-panel__head">
        <p className="pitch-feature-panel__eyebrow">{section.eyebrow}</p>
        <h1 className="pitch-feature-panel__title">{section.title}</h1>
        <p className="pitch-feature-panel__subtitle">{section.subtitle}</p>
      </header>

      <ul className="pitch-feature-subgrid">
        {RETINOMIC_LANDING_PROBLEM_CARDS.map((card) => (
          <li key={card.id}>
            <PitchSubgridTile card={card} />
          </li>
        ))}
      </ul>

      <div className="pitch-feature-panel__ctas flex flex-wrap gap-2.5 sm:gap-3">
        <PitchCtaLink href={section.primaryCtaHref} className="dios-btn-on-light pitch-feature-panel__cta">
          {section.primaryCtaLabel}
        </PitchCtaLink>
        <PitchCtaLink href={section.secondaryCtaHref} className="dios-btn-on-light--secondary pitch-feature-panel__cta">
          {section.secondaryCtaLabel} →
        </PitchCtaLink>
      </div>
    </div>
  )
}
