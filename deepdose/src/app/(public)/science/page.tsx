import type { Metadata } from 'next'
import Link from 'next/link'

import { ScienceTrustFeatures } from '@/components/deepdose/ScienceTrustFeatures'
import {
  SCIENCE_TRUST_CTA,
  SCIENCE_TRUST_INTRO,
  SCIENCE_TRUST_META,
} from '@/lib/deepdose-marketing/science-trust-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: SCIENCE_TRUST_META.title,
  description: SCIENCE_TRUST_META.description,
}

export default function SciencePage() {
  return (
    <article className="seco-page seco-science seco-chronobiobank seco-mission seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-chronobiobank__intro seco-science__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{SCIENCE_TRUST_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-science__title seco-chronobiobank__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {SCIENCE_TRUST_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {SCIENCE_TRUST_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-chronobiobank__lede seco-science__lede">{SCIENCE_TRUST_INTRO.lede}</p>
        </header>

        <div className="seco-chronobiobank__mission-stack">
          <ScienceTrustFeatures className="seco-chronobiobank__folds seco-reveal seco-reveal--2" />
        </div>

        <div className={marketingCtaClass('seco-science__cta seco-reveal seco-reveal--3')}>
          <Link href={SCIENCE_TRUST_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {SCIENCE_TRUST_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
