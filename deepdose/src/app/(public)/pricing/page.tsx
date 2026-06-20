import type { Metadata } from 'next'
import Link from 'next/link'

import { PricingTiers, type PricingTier } from '@/components/secopeutic/PricingTiers'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  TIPTRAQ_STUDY_PRICING_UK,
  formatTipTraqBaselineFee,
  formatTipTraqQuarterlyFee,
} from '@/lib/clinical/tiptraq-program'

export const metadata: Metadata = {
  title: `Pricing · ${DEEPDOSE_NAME}`,
  description:
    'Start free with a phone-based proxy DLMO, or order a clinically-driven TipTraQ home sleep test — £149 for three nights, about half a typical private test, with £99 quarterly re-reads.',
}

export default function PricingPage() {
  const baseline = formatTipTraqBaselineFee()
  const quarterly = formatTipTraqQuarterlyFee()
  const privateAnchor = `£${TIPTRAQ_STUDY_PRICING_UK.ukWatchPat3NightGbp}`
  const oursPct = Math.round(
    (TIPTRAQ_STUDY_PRICING_UK.baselineGbp / TIPTRAQ_STUDY_PRICING_UK.ukWatchPat3NightGbp) * 100
  )

  const tiers: PricingTier[] = [
    {
      id: 'dlmo-baseline',
      name: 'DLMO Baseline',
      figure: 'Free',
      cadence: 'Phone & wearable data',
      note: 'Share your phone and wearable sensor data — our AI estimates your body-clock timing (a proxy DLMO) at no cost.',
      flag: 'Start here',
      feature: true,
      cta: { label: 'Start free', href: '/login' },
      includes: [
        'Proxy DLMO from your phone and wearable data',
        'Personalised dosing windows on your dashboard',
        'Contributes to our chronotherapy research',
        'Upgrade to a clinical-grade reading anytime',
      ],
    },
    {
      id: 'clinical-baseline',
      name: 'Clinical sleep test',
      figure: baseline,
      cadence: 'TipTraQ kit · three nights',
      note: 'Three nights with the TipTraQ home kit for a clinically-driven DLMO reading and your verified data badge.',
      cta: { label: 'Order your test', href: '/home-test' },
      includes: [
        ...TIPTRAQ_STUDY_PRICING_UK.includes,
        'Personalised dosing windows on your dashboard',
        'Verified clinical-grade data badge on your record',
        'Contributes to our chronotherapy research',
      ],
    },
    {
      id: 'quarterly',
      name: 'Quarterly re-read',
      figure: quarterly,
      cadence: 'Every three months',
      note: 'A clinical TipTraQ re-read every quarter, like a blood panel, to keep your plan accurate.',
      cta: { label: 'Order a re-read', href: '/home-test' },
      includes: [
        'Re-order the reusable TipTraQ kit every three months',
        'Fresh clinical DLMO and chronotype read',
        'Catches circadian drift before it shows in labs',
        'Contributes to our chronotherapy research',
      ],
    },
  ]

  return (
    <article className="seco-page seco-pricing">
      <div className="seco-landing__section-inner">
        <header className="seco-pricing__intro seco-reveal seco-reveal--1">
          <div className="seco-pricing__intro-copy">
            <p className="seco-page__eyebrow">Pricing</p>
            <h1 className="seco-page__title">Simple, honest pricing</h1>
            <p className="seco-page__lede">
              Everyone starts free with a body-clock estimate from their own phone and wearables.
              Upgrade to a clinically-driven TipTraQ reading for {baseline} — about half a typical
              private test (~{privateAnchor}).
            </p>
          </div>
          <aside className="seco-pricing__compare" aria-label="Cost compared with a private sleep test">
            <p className="seco-pricing__compare-label">Three nights at home</p>
            <div className="seco-pricing__compare-rows">
              <div className="seco-pricing__compare-row">
                <span className="seco-pricing__compare-name">{DEEPDOSE_NAME}</span>
                <span className="seco-pricing__compare-track">
                  <span
                    className="seco-pricing__compare-fill seco-pricing__compare-fill--ours"
                    style={{ width: `${oursPct}%` }}
                  />
                </span>
                <span className="seco-pricing__compare-figure">{baseline}</span>
              </div>
              <div className="seco-pricing__compare-row">
                <span className="seco-pricing__compare-name">Private clinic</span>
                <span className="seco-pricing__compare-track">
                  <span className="seco-pricing__compare-fill seco-pricing__compare-fill--theirs" />
                </span>
                <span className="seco-pricing__compare-figure">~{privateAnchor}</span>
              </div>
            </div>
            <p className="seco-pricing__compare-save">≈ {100 - oursPct}% less than a private test</p>
          </aside>
        </header>

        <section className="seco-pricing__tiers seco-reveal seco-reveal--2" aria-label="Plans">
          <PricingTiers tiers={tiers} />
        </section>

        <section className="seco-pricing__close seco-reveal seco-reveal--3">
          <p className="seco-pricing__close-note">
            Order on the advice of your GP or another healthcare professional — no clinic visit, no
            waiting list. Your clinician adds the results to {DEEPDOSE_NAME} and your dashboard shows
            the best times for light, meals, medicines, exercise, and sleep.{' '}
            <Link href="/tiptraq" className="seco-research-inline-link">
              How the home test works ↗
            </Link>
          </p>
        </section>
      </div>
    </article>
  )
}
