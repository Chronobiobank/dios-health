import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  TIPTRAQ_STUDY_PRICING_UK,
  formatTipTraqBaselineFee,
  formatTipTraqQuarterlyFee,
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
  const quarterly = formatTipTraqQuarterlyFee()
  const privateAnchor = `£${TIPTRAQ_STUDY_PRICING_UK.ukWatchPat3NightGbp}`

  return (
    <article className="seco-page seco-hometest">
      <div className="seco-landing__section-inner">
        <header className="seco-hometest__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">TipTraQ home kit</p>
          <h1 className="seco-page__title">Clinical sleep insight, from your bedside</h1>
          <p className="seco-page__lede seco-hometest__intro-lede">
            Three nights at home with a reusable TipTraQ sensor — {baseline} for the baseline read,
            about half a typical private test (~{privateAnchor}). Your clinician uploads the results;
            {` ${DEEPDOSE_NAME}`} turns them into precision dosing windows on your dashboard.
          </p>
          <div className="seco-hometest__hero-actions">
            <Link href="/pricing" className="seco-landing__btn seco-landing__btn--primary">
              Order your test →
            </Link>
            <Link href="/tiptraq" className="seco-landing__btn seco-landing__btn--secondary">
              How the kit works
            </Link>
          </div>
        </header>

        <figure className="seco-hometest__panorama seco-reveal seco-reveal--2">
          <Image
            src="/home-test/three-nights.png"
            alt="A sleep sensor on a bedside at twilight, with three moon phases over a dawn-to-dusk sky"
            fill
            priority
            sizes="(min-width: 960px) 72rem, 100vw"
            className="seco-hometest__panorama-img"
          />
          <figcaption className="seco-hometest__hero-badge">
            <span aria-hidden="true">🛡️</span> Verified clinical-grade data
          </figcaption>
        </figure>

        <section className="seco-hometest__kit-band seco-reveal seco-reveal--3" aria-labelledby="hometest-kit-title">
          <figure className="seco-hometest__kit-figure">
            <Image
              src="/tiptraq/tiptraq-v3-1.png"
              alt="Open TipTraQ charging case with the soft fabric finger sensor, beside the companion app"
              fill
              sizes="(min-width: 880px) 42vw, 100vw"
              className="seco-hometest__kit-img"
            />
          </figure>
          <div className="seco-hometest__kit-copy">
            <p className="seco-hometest__kit-eyebrow">The kit</p>
            <h2 id="hometest-kit-title" className="seco-hometest__kit-title">
              Everything you need for three nights at home
            </h2>
            <p className="seco-hometest__kit-lede">
              A soft fabric finger sensor, charging case, and companion app — FDA-cleared sleep staging
              and respiratory analysis, reviewed by your clinician.
            </p>
            <ul className="seco-hometest__checklist">
              {TIPTRAQ_STUDY_PRICING_UK.includes.map((item) => (
                <li key={item} className="seco-hometest__check-item">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="seco-hometest__kit-price">
              <span className="seco-hometest__kit-price-figure">{baseline}</span>
              <span className="seco-hometest__kit-price-note">three-night baseline · reusable device</span>
            </p>
          </div>
        </section>

        <section className="seco-hometest__section seco-reveal seco-reveal--4">
          <div className="seco-hometest__section-head">
            <h2 className="seco-hometest__h2">How it works</h2>
            <p className="seco-hometest__section-sub">
              From GP referral to personalised dosing windows — four clear steps.
            </p>
          </div>
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

        <section className="seco-hometest__section seco-reveal seco-reveal--5" aria-labelledby="hometest-benefits-title">
          <div className="seco-hometest__section-head">
            <h2 id="hometest-benefits-title" className="seco-hometest__h2">
              What you get on {DEEPDOSE_NAME}
            </h2>
            <p className="seco-hometest__section-sub">
              More than a sleep report — a body-clock baseline that powers your daily plan.
            </p>
          </div>
          <SpectrumTile
            cue="#c9b6f2"
            label="Outcome"
            title="Your precision dosing profile"
            titleTag="h3"
            variant="hero"
            body={
              <ul className="seco-hometest__checklist seco-hometest__checklist--benefits">
                {BENEFITS.map((item) => (
                  <li key={item} className="seco-hometest__check-item">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            }
          />
        </section>

        <section className="seco-hometest__section seco-reveal seco-reveal--6" aria-labelledby="hometest-pricing-title">
          <div className="seco-hometest__section-head">
            <h2 id="hometest-pricing-title" className="seco-hometest__h2">
              Simple pricing
            </h2>
            <p className="seco-hometest__section-sub">
              About half the cost of a typical private three-night test.
            </p>
          </div>
          <div className="seco-hometest__pricing">
            <article className="seco-hometest__price-card seco-hometest__price-card--feature">
              <span className="seco-hometest__price-flag">Start here</span>
              <p className="seco-hometest__price-tier">Baseline</p>
              <p className="seco-hometest__price-figure">{baseline}</p>
              <p className="seco-hometest__price-note">
                Three nights at home · reusable TipTraQ kit · clinician-reviewed report
              </p>
            </article>
            <article className="seco-hometest__price-card">
              <p className="seco-hometest__price-tier">Quarterly re-read</p>
              <p className="seco-hometest__price-figure">{quarterly}</p>
              <p className="seco-hometest__price-note">
                Every three months — like a blood panel, to catch circadian drift early
              </p>
            </article>
            <article className="seco-hometest__price-card seco-hometest__price-card--muted">
              <p className="seco-hometest__price-tier">Private clinic</p>
              <p className="seco-hometest__price-figure">~{privateAnchor}</p>
              <p className="seco-hometest__price-note">
                Typical UK WatchPAT three-night rental — for comparison
              </p>
            </article>
          </div>
        </section>

        <aside className="seco-hometest__close seco-reveal seco-reveal--7">
          <p className="seco-hometest__close-eyebrow">Ready when your GP agrees</p>
          <h2 className="seco-hometest__close-title">Order your three-night test</h2>
          <p className="seco-hometest__close-sub">
            {baseline} for the baseline kit. Your clinician adds the nights to {DEEPDOSE_NAME}; you
            get verified clinical-grade timing on your dashboard — and optional quarterly re-reads at{' '}
            {quarterly}.
          </p>
          <div className="seco-hometest__close-actions">
            <Link href="/pricing" className="seco-landing__btn seco-landing__btn--primary">
              View pricing →
            </Link>
            <Link href="/tiptraq" className="seco-landing__btn seco-landing__btn--secondary">
              Setup guide
            </Link>
          </div>
        </aside>
      </div>
    </article>
  )
}
