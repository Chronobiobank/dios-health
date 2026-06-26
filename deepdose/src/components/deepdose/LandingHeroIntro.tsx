import Link from 'next/link'

import { DeepDoseHeroHeadline } from '@/components/deepdose/DeepDoseHeroHeadline'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

type LandingHeroIntroProps = {
  hero: LandingHeroContent
  /** `splash` — home `/` video hero; same headline/lede stack as navy landings, no band padding. */
  variant?: 'navy' | 'splash'
}

export function LandingHeroIntro({ hero, variant = 'navy' }: LandingHeroIntroProps) {
  const content = (
    <>
      <div className="seco-reveal seco-reveal--1">
        <DeepDoseHeroHeadline hero={hero} />
      </div>
      <p className="seco-landing__hero-lede seco-reveal seco-reveal--2">{hero.support}</p>
      {hero.context ? (
        <p className="seco-landing__hero-context seco-reveal seco-reveal--2">{hero.context}</p>
      ) : null}
      {hero.cta ? (
        <div className="seco-landing__hero-actions seco-reveal seco-reveal--2">
          <Link href={hero.cta.href} className="seco-landing__btn seco-landing__btn--primary">
            {hero.cta.label}
          </Link>
        </div>
      ) : null}
    </>
  )

  if (variant === 'splash') {
    return <div className="seco-splash__hero-marketing">{content}</div>
  }

  return (
    <div className="seco-landing__hero-navy">
      <div className="seco-landing__section-inner">{content}</div>
    </div>
  )
}
