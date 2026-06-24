import Link from 'next/link'

import { ChronobiobankPlaneTile } from '@/components/deepdose/ChronobiobankPlaneTile'
import { TechnologyLayerStack } from '@/components/deepdose/TechnologyLayerStack'
import {
  EVIDENCE_PAGE_CTA,
  EVIDENCE_PAGE_INTRO,
  EVIDENCE_RESEARCH,
  EVIDENCE_TRACK_LAYERS,
  EVIDENCE_WHY_NOW,
  type EvidenceResearchLink,
} from '@/lib/deepdose-marketing/evidence-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { marketingImages } from '@/lib/marketing/images'

function EvidenceResearchLinks({ links }: { links: readonly EvidenceResearchLink[] }) {
  return (
    <ul className="seco-evidence-theme-links">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="seco-evidence-theme-links__row"
          >
            <span className="seco-evidence-theme-links__label">{link.label}</span>
            <span className="seco-evidence-theme-links__meta">{link.meta} ↗</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function EvidencePage() {
  return (
    <article className="seco-page seco-evidence-page seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-evidence-page__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{EVIDENCE_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-evidence-page__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {EVIDENCE_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {EVIDENCE_PAGE_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-evidence-page__lede">{EVIDENCE_PAGE_INTRO.lede}</p>
        </header>

        <ChronobiobankPlaneTile
          variant="light"
          cue={EVIDENCE_WHY_NOW.cue}
          label={EVIDENCE_WHY_NOW.label}
          title={EVIDENCE_WHY_NOW.title}
          beats={EVIDENCE_WHY_NOW.beats}
          iconId="sleep"
          className="seco-evidence-page__why-now seco-reveal seco-reveal--2"
        />

        <TechnologyLayerStack
          className="seco-evidence-page__track seco-reveal seco-reveal--3"
          layers={EVIDENCE_TRACK_LAYERS}
        />

        <ChronobiobankPlaneTile
          cue={EVIDENCE_RESEARCH.cue}
          label={EVIDENCE_RESEARCH.label}
          title={EVIDENCE_RESEARCH.title}
          beats={[EVIDENCE_RESEARCH.body]}
          image={marketingImages.circadianMedicine}
          iconId="partner-academic"
          foot={<EvidenceResearchLinks links={EVIDENCE_RESEARCH.links} />}
          className="seco-evidence-page__research seco-reveal seco-reveal--4"
        />

        <div className={marketingCtaClass('seco-evidence-page__cta seco-reveal seco-reveal--5')}>
          <Link href={EVIDENCE_PAGE_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {EVIDENCE_PAGE_CTA.label} →
          </Link>
          <p className="seco-marketing-cta__note">{EVIDENCE_PAGE_CTA.note}</p>
        </div>
      </div>
    </article>
  )
}
