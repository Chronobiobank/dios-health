import type { Metadata } from 'next'
import Link from 'next/link'

import { ChronobiobankPlaneTile } from '@/components/deepdose/ChronobiobankPlaneTile'
import { FounderQuoteTile } from '@/components/deepdose/FounderQuoteTile'
import {
  CHRONOBIOBANK_INTRO,
  CHRONOBIOBANK_LETTER,
  CHRONOBIOBANK_META,
  CHRONOBIOBANK_MISSION_CTA,
  CHRONOBIOBANK_PLANE,
} from '@/lib/deepdose-marketing/chronobiobank-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: CHRONOBIOBANK_META.title,
  description: CHRONOBIOBANK_META.description,
}

export default function MissionPage() {
  return (
    <article className="seco-page seco-chronobiobank seco-mission seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-chronobiobank__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{CHRONOBIOBANK_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-chronobiobank__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {CHRONOBIOBANK_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {CHRONOBIOBANK_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-chronobiobank__lede">{CHRONOBIOBANK_INTRO.lede}</p>
        </header>

        <div className="seco-chronobiobank__mission-stack">
          <FounderQuoteTile
            quote={CHRONOBIOBANK_INTRO.quote}
            className="seco-chronobiobank__founder-quote seco-reveal seco-reveal--2"
          />

          <div className="seco-chronobiobank__letter seco-reveal seco-reveal--3">
            {CHRONOBIOBANK_LETTER.paragraphs.map((paragraph) => (
              <p key={paragraph} className="seco-chronobiobank__letter-p">
                {paragraph}
              </p>
            ))}
          </div>

          <ChronobiobankPlaneTile
            cue={CHRONOBIOBANK_PLANE.cue}
            className="seco-chronobiobank__planes seco-chronobiobank__plane-visual--centered seco-reveal seco-reveal--4"
            label={CHRONOBIOBANK_PLANE.label}
            title={CHRONOBIOBANK_PLANE.title}
            beats={CHRONOBIOBANK_PLANE.beats}
            videoSrc="/first-light.mp4"
          />
        </div>

        <div className={marketingCtaClass('seco-chronobiobank__cta seco-reveal seco-reveal--5')}>
          <Link href={CHRONOBIOBANK_MISSION_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {CHRONOBIOBANK_MISSION_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
