import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  TIPTRAQ_STUDY_PRICING_UK,
  formatTipTraqBaselineFee,
} from '@/lib/clinical/tiptraq-program'
import { spectrumCue } from '@/lib/design/spectrum-cues'

export const metadata: Metadata = {
  title: `Home sleep test · ${DEEPDOSE_NAME}`,
  description:
    `A three-night home sleep test for £149, about half a typical private test. Your clinician adds the results to ${DEEPDOSE_NAME} and your dashboard shows the best times for light, meals, medicines, exercise, and sleep.`,
}

const STEPS = [
  {
    label: 'Order',
    title: 'Order on your GP’s advice',
    body: 'If your GP suggests a home sleep test, order a TipTraQ kit. No clinic visit, no waiting list.',
  },
  {
    label: 'Wear',
    title: 'Three nights at home',
    body: 'Wear the reusable device for three nights. It captures medical-grade oxygen (SpO₂), breathing events, and sleep staging.',
  },
  {
    label: 'Review',
    title: 'Your clinician adds the results',
    body: `Your clinician reviews the nights and adds your profile to ${DEEPDOSE_NAME}, setting your body-clock baseline and chronotype.`,
  },
  {
    label: 'Plan',
    title: 'See your best times',
    body: 'Your dashboard shows the best times for light, meals, medicines, exercise, and sleep, personalised to your body clock.',
  },
] as const

const BENEFITS = [
  'Personalised timing windows for light, meals, medicines, exercise, and sleep.',
  'A verified clinical-grade data badge on your record.',
  'Early warning for metabolic drift, before it shows in routine labs.',
  'A quarterly check-in, like a blood panel, to keep your plan accurate.',
] as const

function CheckIcon() {
  return (
    <svg
      className="seco-hometest__check"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        d="M5 10.5l3.2 3.2L15 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function HomeTestPage() {
  const baseline = formatTipTraqBaselineFee()

  return (
    <article className="seco-page seco-hometest">
      <div className="seco-landing__section-inner">
        <header className="seco-hometest__hero seco-reveal seco-reveal--1">
          <div className="seco-hometest__hero-copy">
            <p className="seco-page__eyebrow">TipTraQ home kit</p>
            <h1 className="seco-page__title">Your home sleep test</h1>
            <p className="seco-page__lede">
              A clinical-grade sleep test you take at home over three nights — {baseline}, about half
              a typical private test.
            </p>
          </div>
          <figure className="seco-hometest__hero-media">
            <Image
              src="/home-test/three-nights.png"
              alt="A sleep sensor on a bedside at twilight, with three moon phases over a dawn-to-dusk sky"
              fill
              priority
              sizes="(min-width: 880px) 44vw, 100vw"
              className="seco-hometest__hero-img"
            />
            <figcaption className="seco-hometest__hero-badge">
              <span aria-hidden="true">🛡️</span> Verified clinical-grade data
            </figcaption>
          </figure>
        </header>

        <section className="seco-hometest__section seco-reveal seco-reveal--2">
          <h2 className="seco-hometest__h2">How it works</h2>
          <SpectrumTileGrid as="ol" cols={2} sm2 className="seco-hometest__steps">
            {STEPS.map((step, index) => (
              <SpectrumTile
                key={step.title}
                as="li"
                cue={spectrumCue(index)}
                label={step.label}
                title={step.title}
                body={step.body}
                rank={index + 1}
                titleVariant="display"
              />
            ))}
          </SpectrumTileGrid>
          <p className="seco-hometest__guide-note">
            <Link href="/tiptraq" className="seco-research-inline-link">
              See the full setup guide ↗
            </Link>
          </p>
        </section>

        <section className="seco-hometest__section seco-reveal seco-reveal--3">
          <SpectrumTileGrid cols={2} className="seco-hometest__cols">
            <SpectrumTile
              cue="#acd3de"
              label="Kit"
              title="What's in the kit"
              titleTag="h2"
              body={
                <ul className="seco-hometest__checklist">
                  {TIPTRAQ_STUDY_PRICING_UK.includes.map((item) => (
                    <li key={item} className="seco-hometest__check-item">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              }
            />
            <SpectrumTile
              cue="#c9b6f2"
              label="Outcome"
              title="What you get"
              titleTag="h2"
              body={
                <ul className="seco-hometest__checklist">
                  {BENEFITS.map((item) => (
                    <li key={item} className="seco-hometest__check-item">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              }
            />
          </SpectrumTileGrid>
        </section>

        <div className="seco-hometest__order seco-reveal seco-reveal--4">
          <Link href="/pricing" className="seco-landing__btn seco-landing__btn--primary">
            Order your test →
          </Link>
        </div>
      </div>
    </article>
  )
}
