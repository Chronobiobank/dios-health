import Link from 'next/link'

import { DeepDoseHeroHeadline } from '@/components/deepdose/DeepDoseHeroHeadline'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

type LandingHeroIntroProps = {
  hero: LandingHeroContent
}

export function LandingHeroIntro({ hero }: LandingHeroIntroProps) {
  return (
    <div className="seco-landing__hero-navy">
      <div className="seco-landing__section-inner">
        <div className="seco-reveal seco-reveal--1">
          <DeepDoseHeroHeadline hero={hero} />
        </div>
        <p className="seco-landing__hero-lede seco-reveal seco-reveal--2">{hero.support}</p>
        {hero.cta ? (
          <div className="seco-landing__hero-actions seco-reveal seco-reveal--2">
            <Link href={hero.cta.href} className="seco-landing__btn seco-landing__btn--primary">
              {hero.cta.label}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
