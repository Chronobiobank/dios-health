import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import {
  FOUNDERS_CLOSE,
  FOUNDERS_INTRO,
  FOUNDERS_PAGE_META,
  FOUNDERS_PERKS,
} from '@/lib/deepdose-marketing/founders-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: FOUNDERS_PAGE_META.title,
  description: FOUNDERS_PAGE_META.description,
  alternates: { canonical: '/founders' },
}

/** /founders — Manjam cohort: one-screen welcome + perks + CTA. */
export default function FoundersPage() {
  return (
    <article className="seco-page seco-mission seco-marketing-page seco-how-page dd-founders">
      <div className="seco-landing__section-inner seco-how-page__inner dd-founders__inner">
        <header className="seco-how-page__why seco-reveal seco-reveal--1" aria-labelledby="founders-title">
          <h1 id="founders-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{FOUNDERS_INTRO.title}</span>
          </h1>
        </header>

        <ul
          className="seco-how-page__story seco-how-page__why-tiles seco-how-page__perks seco-reveal seco-reveal--2"
          aria-label="Founder perks"
        >
          {FOUNDERS_PERKS.items.map((perk) => (
            <li
              key={perk.id}
              className="seco-spectrum-tile seco-spectrum-tile--compact"
              style={{ '--cue': perk.cue } as CSSProperties}
            >
              <p className="seco-spectrum-tile__title">{perk.title}</p>
            </li>
          ))}
        </ul>

        <section className="seco-how-page__founding seco-reveal seco-reveal--3">
          <div className={marketingCtaClass('seco-how-page__cta')}>
            <Link
              href={FOUNDERS_CLOSE.cta.href}
              className="seco-landing__btn seco-landing__btn--ghost"
            >
              {FOUNDERS_CLOSE.cta.label}
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
