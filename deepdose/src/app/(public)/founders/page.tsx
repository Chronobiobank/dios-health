import type { Metadata } from 'next'
import Link from 'next/link'

import { FounderQuoteTile } from '@/components/deepdose/FounderQuoteTile'
import { HowLoopDiagram } from '@/components/deepdose/HowLoopDiagram'
import { MarketingSceneTile } from '@/components/deepdose/MarketingSceneTile'
import { PhenotypeIcon } from '@/components/deepdose/PhenotypeIcon'
import {
  FOUNDERS_CTA,
  FOUNDERS_INTRO,
  FOUNDERS_PAGE_META,
} from '@/lib/deepdose-marketing/founders-content'
import {
  HOW_IT_WORKS_PHENOTYPES,
  HOW_IT_WORKS_SCENE,
  HOW_IT_WORKS_STORY,
  HOW_IT_WORKS_WHY,
} from '@/lib/deepdose-marketing/how-it-works-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: FOUNDERS_PAGE_META.title,
  description: FOUNDERS_PAGE_META.description,
  alternates: { canonical: '/founders' },
}

/** /founders — Manjam invite + How content + claim account. */
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

        <MarketingSceneTile
          image={HOW_IT_WORKS_SCENE.image}
          objectPosition={HOW_IT_WORKS_SCENE.objectPosition}
          scrim={false}
        >
          <HowLoopDiagram />
        </MarketingSceneTile>

        <header
          id="phenotype"
          className="seco-how-page__why seco-reveal seco-reveal--2"
          aria-labelledby="founders-phenotype-title"
        >
          <h2 id="founders-phenotype-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_PHENOTYPES.title}</span>
          </h2>
        </header>

        <ul
          className="seco-how-page__story seco-how-page__phenotypes seco-reveal seco-reveal--2"
          aria-label="Know Your Phenotype"
        >
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

        <header className="seco-how-page__why seco-reveal seco-reveal--3" aria-labelledby="founders-why-title">
          <h2 id="founders-why-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_WHY.title}</span>
          </h2>
        </header>

        <ul className="seco-how-page__story seco-how-page__why-tiles seco-reveal seco-reveal--3" aria-label="Why Deepdose">
          {HOW_IT_WORKS_STORY.map((tile) => (
            <li key={tile.id} className="seco-how-page__story-tile">
              <p className="seco-how-page__story-label">{tile.label}</p>
              <p className="seco-how-page__story-body">{tile.body}</p>
            </li>
          ))}
        </ul>

        <section className="seco-how-page__founding seco-reveal seco-reveal--4">
          <div className={marketingCtaClass('seco-how-page__cta')}>
            <Link href={FOUNDERS_CTA.href} className="seco-landing__btn seco-landing__btn--ghost">
              {FOUNDERS_CTA.label}
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
