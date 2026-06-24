import type { Metadata } from 'next'
import Link from 'next/link'

import { BodyClockCompareStrip } from '@/components/deepdose/BodyClockCompareStrip'
import { PricingTiers } from '@/components/deepdose/PricingTiers'
import {
  PRICING_PAGE_CTA,
  PRICING_PAGE_INTRO,
  PRICING_PAGE_META,
  buildPricingTiers,
} from '@/lib/deepdose-marketing/pricing-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { formatTipTraqBaselineFee, formatTipTraqQuarterlyFee } from '@/lib/clinical/tiptraq-program'

export const metadata: Metadata = {
  title: PRICING_PAGE_META.title,
  description: PRICING_PAGE_META.description,
}

export default function PricingPage() {
  const baseline = formatTipTraqBaselineFee()
  const quarterly = formatTipTraqQuarterlyFee()
  const tiers = buildPricingTiers(baseline, quarterly)

  return (
    <article className="seco-page seco-pricing seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-pricing__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{PRICING_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-pricing__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {PRICING_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {PRICING_PAGE_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-pricing__lede">{PRICING_PAGE_INTRO.lede}</p>
        </header>

        <BodyClockCompareStrip clinicalFigure={baseline} />

        <section className="seco-pricing__tiers seco-reveal seco-reveal--3" aria-label="Plans">
          <PricingTiers tiers={tiers} />
        </section>

        <div className={marketingCtaClass('seco-pricing__cta seco-reveal seco-reveal--4')}>
          <Link href={PRICING_PAGE_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {PRICING_PAGE_CTA.label} →
          </Link>
          <p className="seco-marketing-cta__note">{PRICING_PAGE_CTA.note}</p>
        </div>
      </div>
    </article>
  )
}
