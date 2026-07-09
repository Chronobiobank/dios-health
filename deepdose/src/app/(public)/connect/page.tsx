import type { Metadata } from 'next'
import Link from 'next/link'

import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { CommunityStoryFeed } from '@/components/patient/CommunityStoryFeed'
import { CONNECT_PAGE, CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/connect' },
}

export default function ConnectPage() {
  const copy = CONNECT_PAGE

  return (
    <div className="seco-landing seco-landing--maven seco-landing--sleep-wake-dash">
      <section className="seco-landing__hero seco-landing__hero--sleep-wake-dash">
        <div className="seco-landing__section-inner seco-reveal seco-reveal--1">
          <div className="sw-dash">
            <header className="sw-dash__chrome" aria-labelledby="connect-title">
              <p className="seco-page__eyebrow">{copy.eyebrow}</p>
              <h1 id="connect-title" className="seco-page__title sw-dash__title sw-dash__title--stacked">
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
              <CommunityMatchesPanel variant="marketing" />
              <CommunityStoryFeed variant="marketing" />
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
