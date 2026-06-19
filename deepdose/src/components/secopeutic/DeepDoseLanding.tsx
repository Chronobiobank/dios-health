import Link from 'next/link'

import { SecopeuticFooter } from '@/components/secopeutic/SecopeuticFooter'
import { SecopeuticHeroHeadline } from '@/components/secopeutic/SecopeuticHeroHeadline'
import { SecopeuticHeroTabs } from '@/components/secopeutic/SecopeuticHeroTabs'
import { DEEPDOSE_LANDING_CLOSE, DEEPDOSE_LANDING_HERO } from '@/lib/secopeutic/landing-content'

export function DeepDoseLanding() {
  return (
    <div className="seco-landing seco-landing--maven">
      <section className="seco-landing__hero">
        <div className="seco-landing__hero-navy">
          <div className="seco-landing__section-inner">
            <SecopeuticHeroHeadline />
            <p className="seco-landing__hero-lede">{DEEPDOSE_LANDING_HERO.support}</p>
          </div>
        </div>
        <div className="seco-landing__section-inner">
          <SecopeuticHeroTabs />
        </div>
      </section>

      <section className="seco-landing__close-navy">
        <div className="seco-landing__section-inner">
          <h2 className="seco-landing__section-title">{DEEPDOSE_LANDING_CLOSE.headline}</h2>
          <p className="seco-landing__support">{DEEPDOSE_LANDING_CLOSE.support}</p>
          <div className="seco-landing__actions">
            <Link
              href={DEEPDOSE_LANDING_CLOSE.cta.href}
              className="seco-landing__btn seco-landing__btn--primary"
            >
              {DEEPDOSE_LANDING_CLOSE.cta.label} →
            </Link>
            <Link
              href={DEEPDOSE_LANDING_CLOSE.secondaryCta.href}
              className="seco-landing__btn seco-landing__btn--secondary"
            >
              {DEEPDOSE_LANDING_CLOSE.secondaryCta.label} →
            </Link>
          </div>
        </div>
      </section>

      <SecopeuticFooter />
    </div>
  )
}
