import Link from 'next/link'

import { SecopeuticFooter } from '@/components/secopeutic/secopeutic-footer'
import { SecopeuticHeroHeadline } from '@/components/secopeutic/secopeutic-hero-headline'
import { SecopeuticHeroTabs } from '@/components/secopeutic/secopeutic-hero-tabs'
import {
  SECOPEUTIC_LANDING_DISCLAIMER,
  SECOPEUTIC_LANDING_HERO,
  SECOPEUTIC_LANDING_PILOT,
} from '@/lib/secopeutic/landing-content'

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
