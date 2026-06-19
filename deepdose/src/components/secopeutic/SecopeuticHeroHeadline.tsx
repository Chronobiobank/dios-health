import { DEEPDOSE_LANDING_HERO } from '@/lib/secopeutic/landing-content'

export function SecopeuticHeroHeadline() {
  return (
    <div className="seco-landing__hero-head">
      <h1 className="seco-landing__hero-title">
        <span className="seco-landing__hero-line seco-landing__hero-spectrum">
          {DEEPDOSE_LANDING_HERO.headline}
        </span>
      </h1>
    </div>
  )
}
