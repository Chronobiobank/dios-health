import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import {
  TESTKIT_CTA,
  TESTKIT_INTRO,
  TESTKIT_KIT,
  TESTKIT_META,
  TESTKIT_STEPS,
} from '@/lib/deepdose-marketing/testkit-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = {
  title: TESTKIT_META.title,
  description: TESTKIT_META.description,
  alternates: { canonical: '/testkit' },
}

function CheckIcon() {
  return (
    <svg className="seco-homekit__check" viewBox="0 0 20 20" width="18" height="18" aria-hidden>
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

export default function TestkitPage() {
  return (
    <article className="seco-page seco-homekit seco-hometest seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-homekit__intro seco-reveal seco-reveal--1">
          <h1 className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{TESTKIT_INTRO.title}</span>
          </h1>
          <p className="seco-page__lede">{TESTKIT_INTRO.lede}</p>
        </header>

        <section className="seco-homekit__kit seco-reveal seco-reveal--2" aria-labelledby="homekit-kit-title">
          <figure className="seco-homekit__kit-figure">
            <Image
              src="/tiptraq/tiptraq-v3-1.png"
              alt="Open Homekit charging case with the soft fabric finger sensor, beside the companion app"
              fill
              sizes="(min-width: 880px) 42vw, 100vw"
              className="seco-homekit__kit-img"
            />
          </figure>
          <div className="seco-homekit__kit-copy">
            <p className="seco-homekit__kit-eyebrow">{TESTKIT_KIT.eyebrow}</p>
            <h2 id="homekit-kit-title" className="seco-homekit__kit-title">
              {TESTKIT_KIT.title}
            </h2>
            <p className="seco-homekit__kit-lede">{TESTKIT_KIT.lede}</p>
            <ul className="seco-homekit__checklist">
              {TESTKIT_KIT.includes.map((item) => (
                <li key={item} className="seco-homekit__check-item">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ol className="seco-homekit__steps seco-reveal seco-reveal--3" aria-label="How Homekit works">
          {TESTKIT_STEPS.map((step) => (
            <li
              key={step.id}
              className={cn('seco-spectrum-tile', 'seco-homekit__step')}
              style={{ '--cue': step.cue } as CSSProperties}
            >
              <span className="seco-homekit__step-rank" aria-hidden>
                {step.rank}
              </span>
              <p className="seco-homekit__step-label">{step.label}</p>
              <h3 className="seco-homekit__step-title">{step.title}</h3>
              <p className="seco-homekit__step-body">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className={marketingCtaClass('seco-homekit__cta seco-reveal seco-reveal--4')}>
          <Link href={TESTKIT_CTA.primary.href} className="seco-landing__btn seco-landing__btn--primary">
            {TESTKIT_CTA.primary.label} →
          </Link>
          <Link href={TESTKIT_CTA.secondary.href} className="seco-landing__btn seco-landing__btn--ghost">
            {TESTKIT_CTA.secondary.label}
          </Link>
        </div>
      </div>
    </article>
  )
}
