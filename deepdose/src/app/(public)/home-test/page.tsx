import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { TechnologyLayerStack } from '@/components/deepdose/TechnologyLayerStack'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { TIPTRAQ_STUDY_PRICING_UK } from '@/lib/clinical/tiptraq-program'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: `Testkit · ${DEEPDOSE_NAME}`,
  description:
    `A three-night TipTraQ Testkit. Your clinician adds the results to ${DEEPDOSE_NAME} and your dashboard shows personalised timing for light, meals, medicines, movement, and sleep.`,
}

const HOME_TEST_STEPS = [
  {
    id: 'order',
    rank: 1,
    label: 'Order',
    cue: '#acd3de',
    title: 'On your GP\u2019s advice',
    body: 'When your GP suggests a home sleep test, order a TipTraQ kit — no clinic visit, no waiting list.',
  },
  {
    id: 'wear',
    rank: 2,
    label: 'Wear',
    cue: '#c9b6f2',
    title: 'Three nights at home',
    body: 'Wear the reusable finger sensor. It captures SpO\u2082, breathing events, and FDA-cleared sleep staging.',
  },
  {
    id: 'review',
    rank: 3,
    label: 'Review',
    cue: '#f2b8a2',
    title: 'Clinician uploads results',
    body: `Your clinician reviews the nights and adds your body-clock baseline to ${DEEPDOSE_NAME}.`,
  },
  {
    id: 'plan',
    rank: 4,
    label: 'Plan',
    cue: '#8b9cf8',
    title: 'See your best times',
    body: 'Your dashboard shows personalised windows for light, meals, medicines, movement, and sleep.',
  },
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
  return (
    <article className="seco-page seco-hometest seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-hometest__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">Testkit</p>
          <h1 className="seco-page__title seco-hometest__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">Monitor</span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">from home</span>
          </h1>
          <p className="seco-page__lede seco-hometest__lede">
            Three nights at home with a reusable TipTraQ sensor. Your clinician adds the read;{' '}
            {DEEPDOSE_NAME} turns it into precision dosing windows on your dashboard.
          </p>
        </header>

        <section className="seco-hometest__kit-band seco-reveal seco-reveal--2" aria-labelledby="hometest-kit-title">
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
              Three nights, one reusable sensor
            </h2>
            <p className="seco-hometest__kit-lede">
              Soft fabric finger sensor, charging case, and companion app — sleep staging and respiratory
              analysis your clinician can trust.
            </p>
            <ul className="seco-hometest__checklist">
              {TIPTRAQ_STUDY_PRICING_UK.includes.map((item) => (
                <li key={item} className="seco-hometest__check-item">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TechnologyLayerStack className="seco-hometest__steps seco-reveal seco-reveal--3" layers={HOME_TEST_STEPS} />

        <div className={marketingCtaClass('seco-hometest__cta seco-reveal seco-reveal--4')}>
          <Link href="/tiptraq" className="seco-landing__btn seco-landing__btn--primary">
            How the kit works →
          </Link>
          <Link href="/patient-landing" className="seco-landing__btn seco-landing__btn--ghost">
            Start with a free risk check
          </Link>
        </div>
      </div>
    </article>
  )
}
