import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { TechnologyLayerStack } from '@/components/deepdose/TechnologyLayerStack'
import {
  TESTKIT_CTA,
  TESTKIT_INTRO,
  TESTKIT_KIT,
  TESTKIT_META,
  TESTKIT_STEPS,
} from '@/lib/deepdose-marketing/testkit-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: TESTKIT_META.title,
  description: TESTKIT_META.description,
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

export default function TestkitPage() {
  return (
    <article className="seco-page seco-hometest seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-hometest__intro seco-reveal seco-reveal--1">
          <h1 className="seco-page__title seco-hometest__title">
            <span className="seco-landing__hero-spectrum">{TESTKIT_INTRO.title}</span>
          </h1>
          <p className="seco-page__lede seco-hometest__lede">{TESTKIT_INTRO.lede}</p>
        </header>

        <section className="seco-hometest__kit-band seco-reveal seco-reveal--2" aria-labelledby="testkit-kit-title">
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
            <p className="seco-hometest__kit-eyebrow">{TESTKIT_KIT.eyebrow}</p>
            <h2 id="testkit-kit-title" className="seco-hometest__kit-title">
              {TESTKIT_KIT.title}
            </h2>
            <p className="seco-hometest__kit-lede">{TESTKIT_KIT.lede}</p>
            <ul className="seco-hometest__checklist">
              {TESTKIT_KIT.includes.map((item) => (
                <li key={item} className="seco-hometest__check-item">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TechnologyLayerStack className="seco-hometest__steps seco-reveal seco-reveal--3" layers={TESTKIT_STEPS} />

        <div className={marketingCtaClass('seco-hometest__cta seco-reveal seco-reveal--4')}>
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
