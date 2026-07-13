import type { Metadata } from 'next'
import Link from 'next/link'

import { HowLoopDiagram } from '@/components/deepdose/HowLoopDiagram'
import { MarketingSceneTile } from '@/components/deepdose/MarketingSceneTile'
import { PhenotypeIcon } from '@/components/deepdose/PhenotypeIcon'
import { WhyClocksBrainTile } from '@/components/deepdose/WhyClocksBrainTile'
import {
  HOW_IT_WORKS_CTAS,
  HOW_IT_WORKS_FOUNDING,
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

        <ul className="seco-how-page__story seco-how-page__phenotypes seco-reveal seco-reveal--3" aria-label="Know Your Chronotype">
          {HOW_IT_WORKS_PHENOTYPES.items.map((tile) => (
            <li key={tile.id} className="seco-how-page__story-tile">
              <div className="seco-how-page__pheno-mark">
                <p className="seco-how-page__story-label">{tile.label}</p>
                <PhenotypeIcon id={tile.id} size="sm" className="seco-how-page__pheno-icon" />
              </div>
              <div className="seco-how-page__pheno-rule" aria-hidden />
              <p className="seco-how-page__story-body seco-how-page__pheno-sub">{tile.body}</p>
            </li>
          ))}
        </ul>

        <section
          className="seco-how-page__founding seco-reveal seco-reveal--4"
          aria-labelledby="how-founding-title"
        >
          <h2 id="how-founding-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_FOUNDING.title}</span>
          </h2>
          <p className="seco-page__lede">{HOW_IT_WORKS_FOUNDING.body}</p>
          <div className={marketingCtaClass('seco-how-page__cta')}>
            {HOW_IT_WORKS_CTAS.map((cta) => (
              <Link
                key={cta.href + cta.label}
                href={cta.href}
                className="seco-landing__btn seco-landing__btn--ghost"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}
