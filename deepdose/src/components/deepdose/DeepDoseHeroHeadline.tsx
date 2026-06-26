import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

type DeepDoseHeroHeadlineProps = {
  hero: LandingHeroContent
}

export function DeepDoseHeroHeadline({ hero }: DeepDoseHeroHeadlineProps) {
  return (
    <div className="seco-landing__hero-head">
      {hero.eyebrow ? <p className="seco-landing__hero-eyebrow">{hero.eyebrow}</p> : null}
      <h1 className="seco-landing__hero-title">
        {hero.headlineAccent ? (
          <>
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {hero.headlineWhite}
            </span>{' '}
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {hero.headlineAccent}
            </span>
          </>
        ) : (
          <span className="seco-landing__hero-line seco-landing__hero-line--white">
            {hero.headlineWhite}
          </span>
        )}
      </h1>
    </div>
  )
}
