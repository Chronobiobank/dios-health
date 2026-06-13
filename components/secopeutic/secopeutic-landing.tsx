import Link from 'next/link'
import type { ReactNode } from 'react'

import { SecopeuticFooter } from '@/components/secopeutic/secopeutic-footer'
import { SecopeuticHeroHeadline } from '@/components/secopeutic/secopeutic-hero-headline'
import { SecopeuticHeroTabs } from '@/components/secopeutic/secopeutic-hero-tabs'
import {
  SECOPEUTIC_LANDING_DISCLAIMER,
  SECOPEUTIC_LANDING_HERO,
  SECOPEUTIC_LANDING_PATHWAYS,
  SECOPEUTIC_LANDING_PILOT,
  SECOPEUTIC_LANDING_PRODUCT,
  SECOPEUTIC_LANDING_SPECTRUM,
  SECOPEUTIC_LANDING_STAKES,
} from '@/lib/secopeutic/landing-content'
import { cn } from '@/lib/utils'

function LightSection({
  id,
  title,
  support,
  canvas,
  seeAllHref,
  seeAllLabel,
  children,
}: {
  id?: string
  title: string
  support?: string
  canvas?: boolean
  seeAllHref?: string
  seeAllLabel?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn('seco-landing__light', canvas && 'seco-landing__light--canvas')}
    >
      <div className="seco-landing__section-inner">
        <div className="seco-landing__section-head">
          <h2 className="seco-landing__section-title">{title}</h2>
          {seeAllHref ? (
            <Link href={seeAllHref} className="seco-landing__section-link">
              {seeAllLabel ?? 'See all'} →
            </Link>
          ) : null}
        </div>
        {support ? <p className="seco-landing__support">{support}</p> : null}
        {children}
      </div>
    </section>
  )
}

export function SecopeuticLanding() {
  return (
    <div className="seco-landing seco-landing--maven">
      <section className="seco-landing__hero">
        <div className="seco-landing__hero-navy">
          <div className="seco-landing__section-inner">
            <SecopeuticHeroHeadline />
            <p className="seco-landing__hero-lede">{SECOPEUTIC_LANDING_HERO.support}</p>
          </div>
        </div>
        <div className="seco-landing__section-inner">
          <SecopeuticHeroTabs />
        </div>
      </section>

      <LightSection title={SECOPEUTIC_LANDING_STAKES.headline} support={SECOPEUTIC_LANDING_STAKES.support} />

      <LightSection
        title={SECOPEUTIC_LANDING_PRODUCT.headline}
        support={SECOPEUTIC_LANDING_PRODUCT.support}
        canvas
      >
        <ul className="seco-landing__layer-grid">
          {SECOPEUTIC_LANDING_PRODUCT.layers.map((layer) => (
            <li key={layer.id} className="seco-landing__feature-card">
              <p className="seco-landing__card-label">{layer.label}</p>
              <p className="seco-landing__card-body">{layer.body}</p>
            </li>
          ))}
        </ul>
      </LightSection>

      <LightSection
        title={SECOPEUTIC_LANDING_SPECTRUM.headline}
        support={SECOPEUTIC_LANDING_SPECTRUM.support}
      >
        <ul className="seco-landing__zone-rail">
          {SECOPEUTIC_LANDING_SPECTRUM.zones.map((zone) => (
            <li
              key={zone.id}
              className={cn(
                'seco-landing__zone',
                zone.id === 'stable' && 'seco-landing__zone--stable',
                zone.id === 'review' && 'seco-landing__zone--review',
                zone.id === 'hold' && 'seco-landing__zone--hold'
              )}
            >
              <p className="seco-landing__zone-label">{zone.label}</p>
              <p className="seco-landing__card-body">{zone.body}</p>
            </li>
          ))}
        </ul>
      </LightSection>

      <LightSection
        id="clinics"
        title="Clinician pathways"
        support={SECOPEUTIC_LANDING_PATHWAYS.support}
        seeAllHref="/clinicians"
        seeAllLabel="Find certified clinics"
        canvas
      >
        <div className="seco-maven-chips" aria-label="Practice types">
          <span className="seco-maven-chip">Exploring</span>
          <span className="seco-maven-chip">Sleep-led</span>
          <span className="seco-maven-chip">PTH-led</span>
        </div>
        <div className="seco-maven-trending">
          {SECOPEUTIC_LANDING_PATHWAYS.cards.map((card, index) => (
            <Link key={card.id} href={card.demoHref} className="seco-maven-course-card">
              <span className="seco-maven-course-card__rank">{index + 1}</span>
              <p className="seco-maven-course-card__title">{card.headline}</p>
              <p className="seco-maven-course-card__meta">{card.support}</p>
              <span className="seco-maven-course-card__link">{card.demoLabel} →</span>
            </Link>
          ))}
        </div>
      </LightSection>

      <section className="seco-landing__close-navy">
        <div className="seco-landing__section-inner">
          <h2 className="seco-landing__section-title">{SECOPEUTIC_LANDING_PILOT.headline}</h2>
          <p className="seco-landing__support">{SECOPEUTIC_LANDING_PILOT.support}</p>
          <div className="seco-landing__actions">
            <Link
              href={SECOPEUTIC_LANDING_PILOT.cta.href}
              className="seco-landing__btn seco-landing__btn--primary"
            >
              {SECOPEUTIC_LANDING_PILOT.cta.label} →
            </Link>
            <Link
              href={SECOPEUTIC_LANDING_PILOT.demoCta.href}
              className="seco-landing__btn seco-landing__btn--secondary"
            >
              {SECOPEUTIC_LANDING_PILOT.demoCta.label} →
            </Link>
          </div>
          <p className="seco-landing__disclaimer">{SECOPEUTIC_LANDING_DISCLAIMER}</p>
        </div>
      </section>

      <SecopeuticFooter />
    </div>
  )
}
