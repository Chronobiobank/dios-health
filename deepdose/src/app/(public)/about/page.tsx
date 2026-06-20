import type { CSSProperties } from 'react'
import Link from 'next/link'

import { AboutFounderSection } from '@/components/secopeutic/AboutFounderSection'
import { ZEITGEBER_DOMAINS, type ZeitgeberId } from '@/lib/chronobiology/zeitgebers'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Time-of-day marker (0 = dawn, 100 = night) + colour, per cue. */
/** Six defined circadian shades — dawn (white) through to night (dark lilac). */
const ZEITGEBER_TIMING: Record<ZeitgeberId, { pct: number; label: string; color: string }> = {
  light: { pct: 6, label: 'Dawn', color: '#eef4f8' },
  meals: { pct: 22, label: 'Morning', color: '#acd3de' },
  meds: { pct: 40, label: 'Midday', color: '#f4c19e' },
  exercise: { pct: 58, label: 'Afternoon', color: '#f2a3c0' },
  cognition: { pct: 76, label: 'Evening', color: '#c9b6f2' },
  sleep: { pct: 94, label: 'Night', color: '#8a76c6' },
}

function ZeitgeberIcon({ id }: { id: ZeitgeberId }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (id) {
    case 'light':
      return (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <circle cx="12" cy="12" r="4" {...common} />
          <path
            d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"
            {...common}
          />
        </svg>
      )
    case 'meals':
      return (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10" {...common} />
          <path d="M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM16 12v9" {...common} />
        </svg>
      )
    case 'meds':
      return (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <rect x="3.5" y="8" width="17" height="8" rx="4" {...common} />
          <path d="M12 8v8" {...common} />
        </svg>
      )
    case 'exercise':
      return (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M2.5 12h3l2.5-6 4 12 2.5-6h3" {...common} />
        </svg>
      )
    case 'cognition':
      return (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <g transform="translate(12 11.75) scale(1.4) translate(-12 -11.75)">
            <path
              d="M12 5.5a3 3 0 0 0-3 3 2.6 2.6 0 0 0-1 5 2.6 2.6 0 0 0 2 3.4 3 3 0 0 0 2 1.1M12 5.5a3 3 0 0 1 3 3 2.6 2.6 0 0 1 1 5 2.6 2.6 0 0 1-2 3.4 3 3 0 0 1-2 1.1M12 5.5V18"
              {...common}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      )
    case 'sleep':
      return (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M20 13.5A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.5z" {...common} />
        </svg>
      )
  }
}

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
          <ul className="seco-about__list">
            {ZEITGEBER_DOMAINS.map((domain) => {
              const timing = ZEITGEBER_TIMING[domain.id]
              return (
                <li
                  key={domain.id}
                  className="seco-about__item"
                  style={{ '--cue': timing.color } as CSSProperties}
                >
                  <div className="seco-about__item-head">
                    <span className="seco-about__item-icon" aria-hidden="true">
                      <ZeitgeberIcon id={domain.id} />
                    </span>
                    <span className="seco-about__item-heads">
                      <span className="seco-about__item-cue">{domain.cue}</span>
                      <span className="seco-about__item-label">{domain.label}</span>
                    </span>
                  </div>
                  <p className="seco-about__item-desc">{domain.description}</p>
                  <div className="seco-about__timing">
                    <span className="seco-about__track" aria-hidden="true">
                      <span className="seco-about__marker" style={{ left: `${timing.pct}%` }} />
                    </span>
                    <span className="seco-about__time-label">{timing.label}</span>
                  </div>
                </li>
              )
            })}
          </ul>
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
            Start onboarding →
          </Link>
          <Link href="/research" className="seco-landing__btn seco-landing__btn--ghost">
            Research →
          </Link>
        </div>
      </div>
    </article>
  )
}
