import type { Metadata } from 'next'
import Link from 'next/link'

import {
  HOMEKIT_RISK_CTA,
  HOMEKIT_RISK_INTRO,
  HOMEKIT_RISK_META,
  HOMEKIT_RISK_POINTS,
} from '@/lib/deepdose-marketing/homekit-risk-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: HOMEKIT_RISK_META.title,
  description: HOMEKIT_RISK_META.description,
  alternates: { canonical: '/homekit' },
}

/** /homekit — SRI-flagged cardio-metabolic risk → take the Homekit test. */
export default function HomekitRiskPage() {
  return (
    <article className="seco-page seco-homekit seco-marketing-page seco-how-page">
      <div className="seco-landing__section-inner seco-how-page__inner">
        <header className="seco-how-page__why seco-reveal seco-reveal--1" aria-labelledby="homekit-risk-title">
          <h1 id="homekit-risk-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOMEKIT_RISK_INTRO.title}</span>
          </h1>
          <p className="seco-page__lede">{HOMEKIT_RISK_INTRO.lede}</p>
        </header>

        <ul
          className="seco-how-page__story seco-how-page__why-tiles seco-reveal seco-reveal--2"
          aria-label="Why Homekit"
        >
          {HOMEKIT_RISK_POINTS.map((point) => (
            <li key={point.id}>
              <div className="seco-how-page__story-tile">
                <p className="seco-how-page__story-label">{point.title}</p>
                <p className="seco-how-page__story-body">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={marketingCtaClass('seco-how-page__cta seco-reveal seco-reveal--3')}>
          <Link
            href={HOMEKIT_RISK_CTA.primary.href}
            className="seco-landing__btn seco-landing__btn--primary"
          >
            {HOMEKIT_RISK_CTA.primary.label}
          </Link>
          <Link
            href={HOMEKIT_RISK_CTA.secondary.href}
            className="seco-landing__btn seco-landing__btn--ghost"
          >
            {HOMEKIT_RISK_CTA.secondary.label}
          </Link>
        </div>
      </div>
    </article>
  )
}
