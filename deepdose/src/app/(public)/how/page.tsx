import type { Metadata } from 'next'
import Link from 'next/link'

import { MarketingFoldTileGrid } from '@/components/deepdose/MarketingFoldTileGrid'
import {
  HOW_IT_WORKS_CTA,
  HOW_IT_WORKS_INTRO,
  HOW_IT_WORKS_META,
  HOW_IT_WORKS_STEPS,
} from '@/lib/deepdose-marketing/how-it-works-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: HOW_IT_WORKS_META.title,
  description: HOW_IT_WORKS_META.description,
  alternates: { canonical: '/how' },
}

export default function HowItWorksPage() {
  return (
    <article className="seco-page seco-marketing-page seco-mission">
      <div className="seco-landing__section-inner">
        <header className="seco-chronobiobank__intro seco-reveal seco-reveal--1">
          <h1 className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_INTRO.title}</span>
          </h1>
        </header>

        <div className="seco-chronobiobank__mission-stack seco-reveal seco-reveal--2">
          <MarketingFoldTileGrid
            className="seco-chronobiobank__feature-grid"
            tiles={HOW_IT_WORKS_STEPS.map((step) => ({
              id: step.id,
              badge: step.badge,
              title: step.title,
              teaser: step.teaser,
              cue: step.cue,
              href: step.href,
            }))}
          />
        </div>

        <div className={marketingCtaClass('seco-reveal seco-reveal--3')}>
          <Link href={HOW_IT_WORKS_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {HOW_IT_WORKS_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
