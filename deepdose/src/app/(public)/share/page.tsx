import type { Metadata } from 'next'
import Link from 'next/link'

import { SHARE_PAGE, SHARE_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: SHARE_PAGE_META.title,
  description: SHARE_PAGE_META.description,
  alternates: { canonical: '/share' },
}

export default function SharePage() {
  const copy = SHARE_PAGE

  return (
    <div className="seco-landing seco-landing--maven seco-landing--sleep-wake-dash">
      <section className="seco-landing__hero seco-landing__hero--sleep-wake-dash">
        <div className="seco-landing__section-inner seco-reveal seco-reveal--1">
          <div className="sw-dash">
            <header className="sw-dash__chrome" aria-labelledby="share-title">
              <p className="seco-page__eyebrow">{copy.eyebrow}</p>
              <h1 id="share-title" className="seco-page__title sw-dash__title sw-dash__title--stacked">
                <span className="seco-landing__hero-line seco-landing__hero-line--white">
                  {copy.titleBefore}
                </span>
                <span className="seco-landing__hero-line seco-landing__hero-spectrum">
                  {copy.titleHighlight}
                </span>
              </h1>
              <p className="seco-page__lede sw-dash__subtitle">{copy.support}</p>
            </header>

            <div className="sw-dash__tiles">
              <article className="dios-glass-outer sw-dash__tile" aria-labelledby="share-points">
                <p id="share-points" className="seco-page__eyebrow sw-dash__tile-eyebrow">
                  {copy.pointsEyebrow}
                </p>
                <ul className="sw-dash__simple-list">
                  {copy.points.map((point) => (
                    <li key={point} className="dios-glass-inner sw-dash__simple-item">
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div className={marketingCtaClass('sw-dash__tile-cta')}>
              <Link
                href={copy.cta.href}
                className="seco-landing__btn seco-landing__btn--primary sw-dash__cta-btn"
              >
                {copy.cta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
