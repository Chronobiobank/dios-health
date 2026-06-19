import type { Metadata } from 'next'
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

function Bullet() {
  return (
    <span
      aria-hidden
      className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50"
    />
  )
}

export default function HomeTestPage() {
  const baseline = formatTipTraqBaselineFee()
  const quarterly = formatTipTraqQuarterlyFee()
  const privateAnchor = `£${TIPTRAQ_STUDY_PRICING_UK.ukWatchPat3NightGbp}`

  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">TipTraQ home kit</p>
        <h1 className="seco-page__title">Get your home sleep test</h1>
        <p className="seco-page__lede">
          If your GP suggests a home sleep test, three nights at home costs {baseline}, about half a
          typical private test. Your clinician adds your results to {DEEPDOSE_NAME}, and we show the
          best times for light, meals, medicines, exercise, and sleep on your dashboard. Check again
          every three months, like a blood test. Free if you join our research programme.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
            Get your test →
          </Link>
          <Link href="/research" className="seco-landing__btn seco-landing__btn--secondary">
            See the research →
          </Link>
        </div>

        <section className="mt-12">
          <h2 className="seco-app-section-title">How it works</h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  className="dose-dash-step-index flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="seco-app-section-title">Simple pricing</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="seco-app-card p-5">
              <p className="seco-page__eyebrow">Baseline</p>
              <p className="mt-1 text-2xl font-medium text-ink">{baseline}</p>
              <p className="mt-1 text-sm text-ink-muted">
                Three nights at home. Sets your dosing baseline.
              </p>
            </div>
            <div className="seco-app-card p-5">
              <p className="seco-page__eyebrow">Quarterly re-read</p>
              <p className="mt-1 text-2xl font-medium text-ink">{quarterly}</p>
              <p className="mt-1 text-sm text-ink-muted">
                A check every three months, like a blood panel.
              </p>
            </div>
            <div className="seco-app-card p-5">
              <p className="seco-page__eyebrow">Research programme</p>
              <p className="mt-1 text-2xl font-medium text-ink">Free</p>
              <p className="mt-1 text-sm text-ink-muted">
                No charge when you opt into our research.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            About half a typical private test. A three-night clinic rental is around {privateAnchor}.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="seco-app-section-title">What’s in the kit</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            {TIPTRAQ_STUDY_PRICING_UK.includes.map((item) => (
              <li key={item} className="flex gap-3">
                <Bullet />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="seco-app-section-title">What you get</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            {BENEFITS.map((item) => (
              <li key={item} className="flex gap-3">
                <Bullet />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
            Get your test →
          </Link>
          <Link href="/about" className="seco-landing__btn seco-landing__btn--secondary">
            About {DEEPDOSE_NAME} →
          </Link>
        </div>
      </div>
    </article>
  )
}
