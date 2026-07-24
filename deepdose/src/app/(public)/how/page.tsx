import type { Metadata } from 'next'
import Link from 'next/link'

import { ChronotypeTiles } from '@/components/deepdose/ChronotypeTiles'
import { HowLoopDiagram } from '@/components/deepdose/HowLoopDiagram'
import { MarketingSceneTile } from '@/components/deepdose/MarketingSceneTile'
import { WhyClocksBrainTile } from '@/components/deepdose/WhyClocksBrainTile'
import {
  HOW_IT_WORKS_CTAS,
  HOW_IT_WORKS_INTRO,
  HOW_IT_WORKS_META,
  HOW_IT_WORKS_PHENOTYPES,
  HOW_IT_WORKS_SCENE,
  HOW_IT_WORKS_WHY,
} from '@/lib/deepdose-marketing/how-it-works-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: HOW_IT_WORKS_META.title,
  description: HOW_IT_WORKS_META.description,
  alternates: { canonical: '/how' },
}

export default function HowItWorksPage() {
  return (
    <article className="seco-page seco-science seco-chronobiobank seco-mission seco-marketing-page seco-how-page">
      <div className="seco-landing__section-inner seco-how-page__inner">
        <header className="seco-how-page__why seco-reveal seco-reveal--1" aria-labelledby="how-why-title">
          <h1 id="how-why-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_WHY.title}</span>
          </h1>
        </header>

        <WhyClocksBrainTile className="seco-reveal seco-reveal--1" />

        <header
          className="seco-how-page__why seco-reveal seco-reveal--2"
          aria-labelledby="how-loop-title"
        >
          <h2 id="how-loop-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_INTRO.title}</span>
          </h2>
        </header>

        <MarketingSceneTile
          image={HOW_IT_WORKS_SCENE.image}
          objectPosition={HOW_IT_WORKS_SCENE.objectPosition}
          scrim={false}
        >
          <HowLoopDiagram />
        </MarketingSceneTile>

        <header
          id="chronotype"
          className="seco-how-page__why seco-reveal seco-reveal--3"
          aria-labelledby="how-chronotype-title"
        >
          <h2 id="how-chronotype-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_PHENOTYPES.title}</span>
          </h2>
        </header>

        <ChronotypeTiles className="seco-reveal seco-reveal--3" />

        <div className="seco-how-page__founding seco-reveal seco-reveal--4">
          <div className={marketingCtaClass('seco-how-page__cta', 'seco-marketing-cta--row')}>
            {HOW_IT_WORKS_CTAS.map((cta) => (
              <Link
                key={cta.href + cta.label}
                href={cta.href}
                className={`seco-landing__btn seco-landing__btn--${cta.variant}`}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
