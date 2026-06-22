import Link from 'next/link'

import { AboutFounderSection } from '@/components/deepdose/AboutFounderSection'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { DoseIcon, DOSE_TIMING } from '@/components/chronobiology/DoseVisual'
import { ZEITGEBER_DOMAINS } from '@/lib/chronobiology/zeitgebers'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export default function AboutPage() {
  return (
    <article className="seco-page seco-about">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">About {DEEPDOSE_NAME}</p>
        <h1 className="seco-page__title">Built around your clock</h1>
        <p className="seco-page__lede">
          {DEEPDOSE_NAME} helps you take everyday care at the right time of day. Most advice tells
          you what to take, not when your body is ready to use it. We find the best time of day for
          the habits that set your body clock, and your clinician stays in the loop when it matters.
        </p>

        <AboutFounderSection />

        <section className="seco-about__section seco-reveal seco-reveal--1">
          <h2 className="seco-about__h2">Your daily doses</h2>
          <p className="seco-about__intro">
            Six cues set your body clock, and each has a distinct job in the body. {DEEPDOSE_NAME}{' '}
            treats every one as a dose and finds the best time of day to take it.
          </p>
          <SpectrumTileGrid as="ul" cols={3} className="seco-about__list">
            {ZEITGEBER_DOMAINS.map((domain) => {
              const timing = DOSE_TIMING[domain.id]
              return (
                <SpectrumTile
                  key={domain.id}
                  as="li"
                  cue={timing.color}
                  label={domain.cue}
                  title={domain.label}
                  body={domain.description}
                  titleTag="h3"
                  icon={<DoseIcon id={domain.id} />}
                  foot={
                    <div className="seco-about__timing">
                      <span className="seco-about__track" aria-hidden="true">
                        <span className="seco-about__marker" style={{ left: `${timing.pct}%` }} />
                      </span>
                      <span className="seco-about__time-label">{timing.label}</span>
                    </div>
                  }
                />
              )
            })}
          </SpectrumTileGrid>
        </section>

        <section className="seco-about__section seco-reveal seco-reveal--2">
          <h2 className="seco-about__h2">One simple dashboard</h2>
          <p className="seco-about__intro">
            A home sleep test, your wearable, and a short sleep-timing quiz feed one dashboard. You
            see what to do next. Your clinician sees your nights, any drift, and when to step in.
            You choose what data we can use, and you can change your mind at any time.
          </p>
        </section>

        <div className="seco-about__actions seco-reveal seco-reveal--3">
          <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
            Start free →
          </Link>
        </div>
      </div>
    </article>
  )
}
