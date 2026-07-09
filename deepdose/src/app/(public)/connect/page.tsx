import type { Metadata } from 'next'
import Link from 'next/link'

import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { CommunityStoryFeed } from '@/components/patient/CommunityStoryFeed'
import { CONNECT_PAGE, CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { buildPatientLandingPath } from '@/lib/medications/home-to-onboarding'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/connect' },
}

type PageProps = {
  searchParams: Promise<{ med?: string; meds?: string; times?: string; time?: string; wake?: string }>
}

export default async function ConnectPage({ searchParams }: PageProps) {
  const copy = CONNECT_PAGE
  const params = await searchParams
  const medCodes = params.meds?.split(',').map((c) => c.trim()).filter(Boolean) ?? []
  const medTimes = params.times?.split(',').map((t) => t.trim().slice(0, 5)).filter(Boolean) ?? []
  const wake = params.wake?.trim().slice(0, 5) ?? params.time?.trim().slice(0, 5) ?? undefined
  const profileHref = buildPatientLandingPath({
    medCodes: medCodes.length ? medCodes : undefined,
    medTimes: medTimes.length ? medTimes : undefined,
    med: params.med?.trim() || undefined,
    wake,
  })

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
              <Link
                href={profileHref}
                className="seco-landing__btn seco-landing__btn--ghost sw-dash__cta-btn"
              >
                {copy.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
