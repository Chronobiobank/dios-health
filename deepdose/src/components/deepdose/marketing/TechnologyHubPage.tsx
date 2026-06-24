import Link from 'next/link'

import { ChronobiobankPlaneTile } from '@/components/deepdose/ChronobiobankPlaneTile'
import { TechnologyLayerStack } from '@/components/deepdose/TechnologyLayerStack'
import {
  TECHNOLOGY_HUB_INTRO,
  TECHNOLOGY_LAYERS,
  TECHNOLOGY_RESEARCH,
} from '@/lib/deepdose-marketing/technology-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { marketingImages } from '@/lib/marketing/images'

export function TechnologyHubPage() {
  return (
    <article className="seco-page seco-technology seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header id="tech-stack-title" className="seco-technology__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{TECHNOLOGY_HUB_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-technology__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {TECHNOLOGY_HUB_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {TECHNOLOGY_HUB_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-technology__lede">{TECHNOLOGY_HUB_INTRO.lede}</p>
        </header>

        <TechnologyLayerStack className="seco-reveal seco-reveal--2" layers={TECHNOLOGY_LAYERS} />

        <ChronobiobankPlaneTile
          cue={TECHNOLOGY_RESEARCH.cue}
          className="seco-technology__research seco-reveal seco-reveal--3"
          label={TECHNOLOGY_RESEARCH.label}
          title={TECHNOLOGY_RESEARCH.title}
          beats={TECHNOLOGY_RESEARCH.beats}
          image={marketingImages.circadianMedicine}
          iconId="partner-academic"
        />

        <div className={marketingCtaClass('seco-technology__cta seco-reveal seco-reveal--4')}>
          <Link href={TECHNOLOGY_RESEARCH.cta.href} className="seco-landing__btn seco-landing__btn--primary">
            {TECHNOLOGY_RESEARCH.cta.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
