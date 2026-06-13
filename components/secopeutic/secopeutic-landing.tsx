import Link from 'next/link'

import { DATA_LABEL, DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import {
  SECOPEUTIC_LANDING_DISCLAIMER,
  SECOPEUTIC_LANDING_HERO,
  SECOPEUTIC_LANDING_PATHWAYS,
  SECOPEUTIC_LANDING_PILOT,
  SECOPEUTIC_LANDING_PLATFORM,
  SECOPEUTIC_LANDING_PRODUCT,
  SECOPEUTIC_LANDING_SPECTRUM,
  SECOPEUTIC_LANDING_STAKES,
} from '@/lib/secopeutic/landing-content'
import { cn } from '@/lib/utils'

function SectionNumber({ value }: { value: string }) {
  return <p className={cn(DATA_LABEL, 'seco-landing__number')}>{value}</p>
}

export function SecopeuticLanding() {
  return (
    <div className="seco-landing">
      <section className="seco-landing__hero secopeutic-demo__page">
        <p className={DATA_LABEL}>{SECOPEUTIC_LANDING_HERO.eyebrow}</p>
        <h1 className={`${DASHBOARD_HEADLINE} seco-landing__headline`}>
          {SECOPEUTIC_LANDING_HERO.headline}
        </h1>
        <p className="secopeutic-demo__lede font-ui text-ui-body">{SECOPEUTIC_LANDING_HERO.support}</p>
        <div className="seco-landing__actions">
          <Link href={SECOPEUTIC_LANDING_HERO.primaryCta.href} className="seco-landing__btn seco-landing__btn--primary">
            {SECOPEUTIC_LANDING_HERO.primaryCta.label} →
          </Link>
          <Link
            href={SECOPEUTIC_LANDING_HERO.secondaryCta.href}
            className="seco-landing__btn seco-landing__btn--secondary"
          >
            {SECOPEUTIC_LANDING_HERO.secondaryCta.label} →
          </Link>
        </div>
      </section>

      <section className="seco-landing__section secopeutic-demo__page">
        <SectionNumber value={SECOPEUTIC_LANDING_STAKES.number} />
        <h2 className="seco-landing__section-title">{SECOPEUTIC_LANDING_STAKES.headline}</h2>
        <p className="seco-landing__support">{SECOPEUTIC_LANDING_STAKES.support}</p>
      </section>

      <section id="platform" className="seco-landing__section secopeutic-demo__page">
        <SectionNumber value={SECOPEUTIC_LANDING_PLATFORM.number} />
        <h2 className="seco-landing__section-title">{SECOPEUTIC_LANDING_PLATFORM.headline}</h2>
        <p className="seco-landing__support">{SECOPEUTIC_LANDING_PLATFORM.support}</p>
        <ul className="seco-landing__layer-grid">
          {SECOPEUTIC_LANDING_PLATFORM.pillars.map((pillar) => (
            <li key={pillar.id} className="secopeutic-panel seco-landing__layer-card">
              <p className={DATA_LABEL}>{pillar.label}</p>
              <p className="seco-landing__card-body">{pillar.body}</p>
              <Link
                href={pillar.href}
                className="secopeutic-audience-card__link mt-4 inline-block"
              >
                {pillar.linkLabel} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="seco-landing__section secopeutic-demo__page">
        <SectionNumber value={SECOPEUTIC_LANDING_PRODUCT.number} />
        <h2 className="seco-landing__section-title">{SECOPEUTIC_LANDING_PRODUCT.headline}</h2>
        <p className="seco-landing__support">{SECOPEUTIC_LANDING_PRODUCT.support}</p>
        <ul className="seco-landing__layer-grid">
          {SECOPEUTIC_LANDING_PRODUCT.layers.map((layer) => (
            <li key={layer.id} className="secopeutic-panel seco-landing__layer-card">
              <p className={DATA_LABEL}>{layer.label}</p>
              <p className="seco-landing__card-body">{layer.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="seco-landing__section secopeutic-demo__page">
        <SectionNumber value={SECOPEUTIC_LANDING_SPECTRUM.number} />
        <h2 className="seco-landing__section-title">{SECOPEUTIC_LANDING_SPECTRUM.headline}</h2>
        <p className="seco-landing__support">{SECOPEUTIC_LANDING_SPECTRUM.support}</p>
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
      </section>

      <section id="clinics" className="seco-landing__section secopeutic-demo__page">
        <SectionNumber value={SECOPEUTIC_LANDING_PATHWAYS.number} />
        <h2 className="seco-landing__section-title">{SECOPEUTIC_LANDING_PATHWAYS.headline}</h2>
        <p className="seco-landing__support">{SECOPEUTIC_LANDING_PATHWAYS.support}</p>
        <div className="secopeutic-audience-cards secopeutic-demo__section">
          {SECOPEUTIC_LANDING_PATHWAYS.cards.map((card) => (
            <Link key={card.id} href={card.demoHref} className="secopeutic-audience-card">
              <p className={DATA_LABEL}>{card.label}</p>
              <p className="mt-2 font-ui text-ui-body font-semibold text-black">{card.headline}</p>
              <p className="mt-2 font-ui text-ui-sm leading-relaxed text-black/65">{card.support}</p>
              <span className="secopeutic-audience-card__link">{card.demoLabel} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="seco-landing__section seco-landing__close secopeutic-demo__page">
        <SectionNumber value={SECOPEUTIC_LANDING_PILOT.number} />
        <h2 className="seco-landing__section-title">{SECOPEUTIC_LANDING_PILOT.headline}</h2>
        <p className="seco-landing__support">{SECOPEUTIC_LANDING_PILOT.support}</p>
        <div className="seco-landing__actions">
          <Link href={SECOPEUTIC_LANDING_PILOT.cta.href} className="seco-landing__btn seco-landing__btn--primary">
            {SECOPEUTIC_LANDING_PILOT.cta.label} →
          </Link>
          <Link href={SECOPEUTIC_LANDING_PILOT.demoCta.href} className="seco-landing__btn seco-landing__btn--secondary">
            {SECOPEUTIC_LANDING_PILOT.demoCta.label} →
          </Link>
        </div>
        <p className="seco-landing__disclaimer">{SECOPEUTIC_LANDING_DISCLAIMER}</p>
      </section>
    </div>
  )
}
