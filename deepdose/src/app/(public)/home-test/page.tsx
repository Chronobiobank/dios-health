import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  TIPTRAQ_STUDY_PRICING_UK,
  formatTipTraqBaselineFee,
  formatTipTraqQuarterlyFee,
} from '@/lib/clinical/tiptraq-program'

export const metadata: Metadata = {
  title: `Home sleep test · ${DEEPDOSE_NAME}`,
  description:
    'A three-night home sleep test for £149, about half a typical private test. Your clinician adds the results to DeepDose and your dashboard shows the best times for light, meals, medicines, exercise, and sleep.',
}

const STEPS = [
  {
    title: 'Order on your GP’s advice',
    body: 'If your GP suggests a home sleep test, order a TipTraQ kit. No clinic visit, no waiting list.',
  },
  {
    title: 'Three nights at home',
    body: 'Wear the reusable device for three nights. It captures medical-grade oxygen (SpO₂), breathing events, and sleep staging.',
  },
  {
    title: 'Your clinician adds the results',
    body: `Your clinician reviews the nights and adds your profile to ${DEEPDOSE_NAME}, setting your body-clock baseline and chronotype.`,
  },
  {
    title: 'See your best times',
    body: 'Your dashboard shows the best times for light, meals, medicines, exercise, and sleep, personalised to your body clock.',
  },
  {
    title: 'Re-check every three months',
    body: 'Like a blood test, a quarterly re-read catches circadian drift before it shows up in labs.',
  },
] as const

const BENEFITS = [
  'Personalised timing windows for light, meals, medicines, exercise, and sleep.',
  'A verified clinical-grade data badge on your record.',
  'Early warning for metabolic drift, before it shows in routine labs.',
  'A quarterly check-in, like a blood panel, to keep your plan accurate.',
] as const

type PriceTier = {
  tier: string
  figure: string
  note: string
  flag?: string
  feature?: boolean
}

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
  const quarterly = formatTipTraqQuarterlyFee()
  const privateAnchor = `£${TIPTRAQ_STUDY_PRICING_UK.ukWatchPat3NightGbp}`

  const heroPoints = [
    'Three nights at home',
    `${baseline} baseline`,
    'About half a private test',
    'Free on the research programme',
  ]

  const priceTiers: PriceTier[] = [
    {
      tier: 'Baseline',
      figure: baseline,
      note: 'Three nights at home. Sets your dosing baseline.',
    },
    {
      tier: 'Quarterly re-read',
      figure: quarterly,
      note: 'A check every three months, like a blood panel.',
    },
    {
      tier: 'Research programme',
      figure: 'Free',
      note: 'No charge when you opt into our research.',
      flag: 'Most chosen',
      feature: true,
    },
  ]

  return (
    <article className="seco-page seco-hometest">
      <div className="seco-landing__section-inner">
        <header className="seco-hometest__hero seco-reveal seco-reveal--1">
          <div className="seco-hometest__hero-copy">
            <p className="seco-page__eyebrow">TipTraQ home kit</p>
            <h1 className="seco-page__title">Get your home sleep test</h1>
            <p className="seco-page__lede">
              If your GP suggests a home sleep test, three nights at home costs {baseline}, about
              half a typical private test. Your clinician adds your results to {DEEPDOSE_NAME}, and
              your dashboard shows the best times for light, meals, medicines, exercise, and sleep.
            </p>
            <ul className="seco-hometest__chips">
              {heroPoints.map((point) => (
                <li key={point} className="seco-hometest__chip">
                  {point}
                </li>
              ))}
            </ul>
            <div className="seco-hometest__hero-actions">
              <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
                Get your test →
              </Link>
              <Link href="/research" className="seco-landing__btn seco-landing__btn--ghost">
                See the research →
              </Link>
            </div>
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
          <h2 className="seco-app-section-title">How it works</h2>
          <ol className="seco-hometest__steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="seco-hometest__step">
                <span className="seco-hometest__step-index" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="seco-hometest__step-copy">
                  <p className="seco-hometest__step-title">{step.title}</p>
                  <p className="seco-hometest__step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="seco-hometest__section seco-reveal seco-reveal--3">
          <div className="seco-hometest__section-head">
            <h2 className="seco-app-section-title">Simple pricing</h2>
            <p className="seco-hometest__section-sub">
              About half a typical private test. A three-night clinic rental is around{' '}
              {privateAnchor}.
            </p>
          </div>
          <div className="seco-hometest__pricing">
            {priceTiers.map((tier) => (
              <div
                key={tier.tier}
                className={
                  tier.feature
                    ? 'seco-hometest__price-card seco-hometest__price-card--feature'
                    : 'seco-hometest__price-card'
                }
              >
                {tier.flag ? <span className="seco-hometest__price-flag">{tier.flag}</span> : null}
                <span className="seco-hometest__price-tier">{tier.tier}</span>
                <span className="seco-hometest__price-figure">{tier.figure}</span>
                <span className="seco-hometest__price-note">{tier.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="seco-hometest__section seco-reveal seco-reveal--4">
          <div className="seco-hometest__cols">
            <div className="seco-hometest__panel">
              <h2 className="seco-app-section-title">What’s in the kit</h2>
              <ul className="seco-hometest__checklist">
                {TIPTRAQ_STUDY_PRICING_UK.includes.map((item) => (
                  <li key={item} className="seco-hometest__check-item">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="seco-hometest__panel">
              <h2 className="seco-app-section-title">What you get</h2>
              <ul className="seco-hometest__checklist">
                {BENEFITS.map((item) => (
                  <li key={item} className="seco-hometest__check-item">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="seco-hometest__close seco-reveal seco-reveal--4">
          <p className="seco-hometest__close-eyebrow">Clinician-led, patient-owned</p>
          <h2 className="seco-hometest__close-title">Start with three nights</h2>
          <p className="seco-hometest__close-sub">
            Order on your GP’s advice and we will turn three nights into a personalised dosing plan.
            Free when you join our research programme.
          </p>
          <div className="seco-hometest__close-actions">
            <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
              Get your test →
            </Link>
            <Link href="/about" className="seco-landing__btn seco-landing__btn--ghost">
              About {DEEPDOSE_NAME} →
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
