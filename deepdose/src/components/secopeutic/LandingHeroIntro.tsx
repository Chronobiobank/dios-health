import { SecopeuticHeroHeadline } from '@/components/secopeutic/SecopeuticHeroHeadline'
import type { LandingHeroContent } from '@/lib/secopeutic/landing-hero'

type LandingHeroIntroProps = {
  hero: LandingHeroContent
}

export function LandingHeroIntro({ hero }: LandingHeroIntroProps) {
  return (
    <div className="seco-landing__hero-navy">
      <div className="seco-landing__section-inner">
        <div className="seco-reveal seco-reveal--1">
          <SecopeuticHeroHeadline hero={hero} />
        </div>
        <p className="seco-landing__hero-lede seco-reveal seco-reveal--2">{hero.support}</p>
      </div>
    </div>
  )
}
