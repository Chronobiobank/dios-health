import type { LandingHeroContent } from '@/lib/secopeutic/landing-hero'

type SecopeuticHeroHeadlineProps = {
  hero: LandingHeroContent
}

export function SecopeuticHeroHeadline({ hero }: SecopeuticHeroHeadlineProps) {
  return (
    <div className="seco-landing__hero-head">
      <p className="seco-landing__hero-eyebrow">{hero.eyebrow}</p>
      <h1 className="seco-landing__hero-title">
        <span className="seco-landing__hero-line seco-landing__hero-line--white">
          {hero.headlineWhite}
        </span>
        <span className="seco-landing__hero-line seco-landing__hero-spectrum">
          {hero.headlineAccent}
        </span>
      </h1>
    </div>
  )
}
