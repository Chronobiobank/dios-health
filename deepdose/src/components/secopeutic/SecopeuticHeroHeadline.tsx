import { DEEPDOSE_LANDING_HERO } from '@/lib/secopeutic/landing-content'

export function SecopeuticHeroHeadline() {
  return (
    <div className="seco-landing__hero-head">
      <h1 className="seco-landing__hero-title">
        <span className="seco-landing__hero-line seco-landing__hero-line--white">
          {DEEPDOSE_LANDING_HERO.headlineWhite}
        </span>
        <span className="seco-landing__hero-line seco-landing__hero-spectrum">
          {DEEPDOSE_LANDING_HERO.headlineAccent}
        </span>
      </h1>
    </div>
  )
}
