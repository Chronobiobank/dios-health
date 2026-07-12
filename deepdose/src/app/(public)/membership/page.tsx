import type { Metadata } from 'next'

import { MembershipTiers } from '@/components/deepdose/MembershipTiers'
import {
  MEMBERSHIP_FOUNDING,
  MEMBERSHIP_PAGE_INTRO,
  MEMBERSHIP_PAGE_META,
  MEMBERSHIP_TIERS,
} from '@/lib/deepdose-marketing/membership-content'

export const metadata: Metadata = {
  title: MEMBERSHIP_PAGE_META.title,
  description: MEMBERSHIP_PAGE_META.description,
  alternates: { canonical: '/membership' },
}

/** /membership (and /pricing redirect) — OpenAI grid + spectrum tiles, one-line head. */
export default function MembershipPage() {
  return (
    <article className="seco-page seco-pricing seco-marketing-page">
      <div className="seco-landing__section-inner dd-oai-stack">
        <header className="seco-pricing__intro seco-reveal seco-reveal--1">
          <h1 className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{MEMBERSHIP_PAGE_INTRO.title}</span>
          </h1>
        </header>

        <section className="seco-pricing__tiers seco-reveal seco-reveal--2" aria-label="Membership options">
          <MembershipTiers tiers={MEMBERSHIP_TIERS} />
        </section>

        <section
          className="seco-pricing__founding seco-reveal seco-reveal--3"
          aria-labelledby="membership-founding-title"
        >
          <h2 id="membership-founding-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{MEMBERSHIP_FOUNDING.title}</span>
          </h2>
          <p className="seco-page__lede">{MEMBERSHIP_FOUNDING.body}</p>
        </section>
      </div>
    </article>
  )
}
