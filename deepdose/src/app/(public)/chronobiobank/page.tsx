import type { Metadata } from 'next'

import { ChronobiobankTileIcon } from '@/components/deepdose/ChronobiobankTileIcon'
import { ChronobiobankMissionDeepDive } from '@/components/deepdose/ChronobiobankMissionDeepDive'
import { ChronobiobankMissionFeatures } from '@/components/deepdose/ChronobiobankMissionFeatures'
import { FounderQuoteTile } from '@/components/deepdose/FounderQuoteTile'
import { SpectrumTile } from '@/components/deepdose/SpectrumTile'
import {
  CHRONOBIOBANK_INTRO,
  CHRONOBIOBANK_META,
  CHRONOBIOBANK_PLANE,
} from '@/lib/deepdose-marketing/chronobiobank-content'

export const metadata: Metadata = {
  title: CHRONOBIOBANK_META.title,
  description: CHRONOBIOBANK_META.description,
}

export default function ChronobiobankPage() {
  return (
    <article className="seco-page seco-chronobiobank seco-mission">
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

          <SpectrumTile
            cue={CHRONOBIOBANK_PLANE.cue}
            variant="hero"
            className="seco-chronobiobank__planes seco-reveal seco-reveal--3"
            label={CHRONOBIOBANK_PLANE.label}
            title={CHRONOBIOBANK_PLANE.title}
            body={CHRONOBIOBANK_PLANE.body}
            titleTag="h2"
            titleVariant="display"
            icon={<ChronobiobankTileIcon id="device" />}
          />

          <ChronobiobankMissionFeatures className="seco-chronobiobank__folds seco-chronobiobank__feature-grid seco-reveal seco-reveal--4" />

          <ChronobiobankMissionDeepDive />
        </div>
      </div>
    </article>
  )
}
