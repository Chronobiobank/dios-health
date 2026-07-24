import type { Metadata } from 'next'
import Link from 'next/link'

import { ChronotypeTiles } from '@/components/deepdose/ChronotypeTiles'
import { FounderQuoteTile } from '@/components/deepdose/FounderQuoteTile'
import { HowLoopDiagram } from '@/components/deepdose/HowLoopDiagram'
import { MarketingSceneTile } from '@/components/deepdose/MarketingSceneTile'
import { WhyClocksBrainTile } from '@/components/deepdose/WhyClocksBrainTile'
import {
  FOUNDERS_CTAS,
  FOUNDERS_INTRO,
  FOUNDERS_PAGE_META,
} from '@/lib/deepdose-marketing/founders-content'
import {
  HOW_IT_WORKS_INTRO,
  HOW_IT_WORKS_PHENOTYPES,
  HOW_IT_WORKS_SCENE,
  HOW_IT_WORKS_WHY,
} from '@/lib/deepdose-marketing/how-it-works-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: FOUNDERS_PAGE_META.title,
  description: FOUNDERS_PAGE_META.description,
  alternates: { canonical: '/founders' },
}

/** /founders — Manjam invite + Why clocks + How + claim account. */
export default function FoundersPage() {
  return (
    <article className="seco-page seco-science seco-chronobiobank seco-mission seco-marketing-page seco-how-page">
      <div className="seco-landing__section-inner seco-how-page__inner">
        <header className="seco-how-page__why seco-reveal seco-reveal--1" aria-labelledby="founders-title">
          <h1 id="founders-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{FOUNDERS_INTRO.title}</span>
          </h1>
        </header>

        <FounderQuoteTile
          quote={FOUNDERS_INTRO.quote}
          name={FOUNDERS_INTRO.quoteName}
          role={FOUNDERS_INTRO.quoteRole || undefined}
          className="seco-reveal seco-reveal--1"
        />

        <header className="seco-how-page__why seco-reveal seco-reveal--2" aria-labelledby="founders-why-title">
          <h2 id="founders-why-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_WHY.title}</span>
          </h2>
        </header>

        <WhyClocksBrainTile className="seco-reveal seco-reveal--2" />

        <header className="seco-how-page__why seco-reveal seco-reveal--3" aria-labelledby="founders-how-title">
          <h2 id="founders-how-title" className="seco-page__title">
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
          aria-labelledby="founders-chronotype-title"
        >
          <h2 id="founders-chronotype-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_PHENOTYPES.title}</span>
          </h2>
        </header>

        <ChronotypeTiles className="seco-reveal seco-reveal--3" />

        <section className="seco-how-page__founding seco-reveal seco-reveal--4">
          <div className={marketingCtaClass('seco-how-page__cta')}>
            <Link
              href={FOUNDERS_CTAS[0].href}
              className="seco-landing__btn seco-landing__btn--primary"
            >
              {FOUNDERS_CTAS[0].label}
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
