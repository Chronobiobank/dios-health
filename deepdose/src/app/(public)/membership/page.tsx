import type { Metadata } from 'next'

import { MembershipTiers } from '@/components/deepdose/MembershipTiers'
import {
  MEMBERSHIP_PAGE_INTRO,
  MEMBERSHIP_PAGE_META,
  MEMBERSHIP_TIERS,
} from '@/lib/deepdose-marketing/membership-content'

export const metadata: Metadata = {
  title: MEMBERSHIP_PAGE_META.title,
  description: MEMBERSHIP_PAGE_META.description,
}

export default function MembershipPage() {
  return (
    <article className="seco-page seco-pricing seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-pricing__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{MEMBERSHIP_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-pricing__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {MEMBERSHIP_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {MEMBERSHIP_PAGE_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-pricing__lede">{MEMBERSHIP_PAGE_INTRO.lede}</p>
        </header>

        <section className="seco-pricing__tiers seco-reveal seco-reveal--2" aria-label="Membership options">
          <MembershipTiers tiers={MEMBERSHIP_TIERS} />
        </section>
      </div>
    </article>
  )
}
