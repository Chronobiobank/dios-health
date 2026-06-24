import Link from 'next/link'

import { TechnologyLayerTiles } from '@/components/deepdose/TechnologyLayerTiles'
import {
  TECHNOLOGY_HUB_CTA,
  TECHNOLOGY_HUB_INTRO,
  TECHNOLOGY_LAYERS,
} from '@/lib/deepdose-marketing/technology-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

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

        <TechnologyLayerTiles layers={TECHNOLOGY_LAYERS} />

        <div className={marketingCtaClass('seco-technology__cta seco-reveal seco-reveal--3')}>
          <Link href={TECHNOLOGY_HUB_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {TECHNOLOGY_HUB_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
