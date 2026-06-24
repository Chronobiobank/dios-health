import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: `Using your TipTraQ kit · ${DEEPDOSE_NAME}`,
  description:
    'How the TipTraQ home sleep test works: charge the sensor, wear it overnight, upload each night, and receive a validated report on sleep apnea risk — a classic sign of body-clock desynchrony.',
}

type GuideStep = {
  image: string
  alt: string
  title: string
  body: string
  tips?: readonly string[]
  /** Scale the cut-out up and anchor it into the tile's bottom-left corner. */
  corner?: boolean
}

const STEPS: readonly GuideStep[] = [
  {
    image: '/tiptraq/tiptraq-v3-1.png',
    alt: 'Open TipTraQ charging case with the soft fabric finger sensor, beside the companion app',
    title: 'Charge the sensor',
    body: 'TipTraQ is a soft fabric finger sensor that lives in a small charging case. Top it up the night before — a full charge records several nights — then open the companion app.',
  },
  {
    image: '/tiptraq/tiptraq-v3-2.png',
    alt: 'TipTraQ app screen for setting up a new sleep study',
    title: 'Set up the app',
    body: 'In the app, activate the test set up for you and complete the short sleep survey. The number of nights and scoring are already configured — you just confirm your details.',
  },
  {
    image: '/tiptraq/tiptraq-v3-3cut.png',
    alt: 'A hand wearing the soft TipTraQ fabric sensor around the finger',
    title: 'Wear it overnight',
    body: 'Wrap the soft sensor around your finger so it rests against the finger pad, start the recording, and sleep as you normally would.',
    corner: true,
    tips: [
      'Snug but comfortable — the app confirms when the signal looks good.',
      'Keep the app running with your phone plugged in and face down.',
    ],
  },
  {
    image: '/tiptraq/tiptraq-v3-4c.png',
    alt: 'TipTraQ sleep centre dashboard listing each night’s recording progress',
    title: 'Your nights sync',
    body: 'Each morning, end the recording to upload the night. Your study progresses securely in the sleep centre — usually across three nights.',
  },
  {
    image: '/tiptraq/tiptraq-v3-5.png',
    alt: 'TipTraQ recording view with SpO₂, pulse rate and sleep-stage traces',
    title: 'An expert reviews',
    body: 'A sleep professional validates each night — checking oxygen dips, breathing pauses, and sleep staging. This is clinical-grade signal for sleep apnea risk, not a smartphone estimate.',
  },
  {
    image: '/tiptraq/tiptraq-v3-6b.png',
    alt: 'A validated TipTraQ sleep report with TQ-AHI, SpO₂ and sleep-stage summary',
    title: 'Your results',
    body: `Your report shows sleep apnea severity (TQ-AHI), oxygen through the night, and sleep staging. Disrupted breathing is a classic sign of body-clock desynchrony — ${DEEPDOSE_NAME} adds this to your free baseline so your clinician can see the full picture.`,
  },
] as const

function CheckIcon() {
  return (
    <svg className="seco-tiptraq__check" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
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

export default function TipTraqGuidePage() {
  return (
    <article className="seco-page seco-tiptraq">
      <div className="seco-landing__section-inner">
        <header className="seco-tiptraq__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">TipTraQ home kit</p>
          <h1 className="seco-page__title">Using your TipTraQ kit</h1>
          <p className="seco-page__lede">
            Your free baseline estimates body-clock timing from smartphone and wearable data. TipTraQ
            goes further — three nights at home to measure sleep apnea risk: breathing events,
            oxygen dips, and sleep staging. That pattern is a classic sign of body-clock
            desynchrony.
          </p>
        </header>

        <ol className="seco-tiptraq__steps">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`seco-tiptraq__step seco-reveal seco-reveal--${Math.min(index + 2, 6)}`}
            >
              <figure className="seco-tiptraq__media">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={`seco-tiptraq__img${step.corner ? ' seco-tiptraq__img--corner' : ''}`}
                />
              </figure>
              <div className="seco-tiptraq__copy">
                <span className="seco-marketing-num" aria-hidden="true">
                  {index + 1}
                </span>
                <h2 className="seco-tiptraq__step-title">{step.title}</h2>
                <p className="seco-tiptraq__step-body">{step.body}</p>
                {step.tips && (
                  <ul className="seco-tiptraq__tips">
                    {step.tips.map((tip) => (
                      <li key={tip} className="seco-tiptraq__tip">
                        <CheckIcon />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className={marketingCtaClass('seco-tiptraq__order seco-reveal seco-reveal--6')}>
          <Link href="/pricing" className="seco-landing__btn seco-landing__btn--primary">
            Order your test →
          </Link>
        </div>
      </div>
    </article>
  )
}
