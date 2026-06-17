import { DEEPDOSE_LANDING_HERO } from '@/lib/secopeutic/landing-content'

export function SecopeuticHeroHeadline() {
  return (
    <div className="seco-landing__hero-head">
      <h1 className="seco-landing__hero-title">
        <span className="seco-landing__hero-line">{DEEPDOSE_LANDING_HERO.headlineLead}</span>
        <span className="seco-landing__hero-line seco-landing__hero-spectrum">
          {DEEPDOSE_LANDING_HERO.headlineAccent}
        </span>
      </h1>
      <p className="seco-landing__hero-sub">{DEEPDOSE_LANDING_HERO.headlineSub}</p>
    </div>
  )
}
