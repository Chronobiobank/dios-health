'use client'

import {
  RETINOMIC_EVIDENCE_SECTION,
  RETINOMIC_LANDING_EVIDENCE,
} from '@/lib/pitch/retinomic-landing-copy'

import { PitchCtaLink } from './pitch-cta-link'
import { PitchSubgridTile } from './pitch-subgrid-tile'

/** Landing evidence screen — same light 2×2 glass panel as Retinomic Protocol */
export function PitchEvidenceGrid() {
  const section = RETINOMIC_EVIDENCE_SECTION

  return (
    <div className="pitch-feature-panel dios-glass-outer">
      <header className="pitch-feature-panel__head">
        <p className="pitch-feature-panel__eyebrow">{section.eyebrow}</p>
        <h2 className="pitch-feature-panel__title">{section.title}</h2>
      </header>

      <ul className="pitch-feature-subgrid">
        {RETINOMIC_LANDING_EVIDENCE.map((study) => (
          <li key={study.id}>
            <PitchSubgridTile card={study} />
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
