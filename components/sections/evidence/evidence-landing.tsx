import Link from 'next/link'

import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import {
  EVIDENCE_CTA,
  EVIDENCE_HERO,
  EVIDENCE_LOOP,
  EVIDENCE_PILLARS,
} from '@/lib/pitch/evidence-landing-content'

function PillarBullet({
  label,
  body,
  href,
  linkLabel,
}: {
  label: string
  body: string
  href?: string
  linkLabel?: string
}) {
  return (
    <li className="home-landing__pillar-bullet">
      <span className="home-landing__pillar-bullet-mark" aria-hidden>
        →
      </span>
      <span>
        <strong>{label}:</strong> {body}
        {href && linkLabel ? (
          <>
            {' '}
            <a className="home-landing__pillar-link" href={href} target="_blank" rel="noopener noreferrer">
              {linkLabel}
            </a>
          </>
        ) : null}
      </span>
    </li>
  )
}

export function EvidenceLanding() {
  return (
    <div className="home-landing dios-nav-tone-paper">
      <HomeLandingReveal />

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--from-top dios-page-top-bleed">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">{EVIDENCE_HERO.eyebrow}</p>
          <h1 className="home-landing__hero-title">
            {EVIDENCE_HERO.headline}
            <br />
            <em>{EVIDENCE_HERO.headlineEmphasis}</em>
          </h1>
          <p className="home-landing__card-detail home-landing__lede">{EVIDENCE_HERO.lede}</p>
        </div>
      </section>

      <section
        className="home-landing__idea home-landing__idea--from-top dios-surface-dark"
        data-nav-surface="dark"
        id="framework"
      >
        <div className="home-landing__inner">
          <p className="dios-on-dark-eyebrow">Four pillars</p>
          <h2 className="home-landing__title dios-on-dark-title">
            Measure. Fuel. Verify. <em>Synthesise.</em>
          </h2>
          <p className="home-landing__insight-statement dios-on-dark-copy">
            Each layer closes a gap that population dosing ignores — from melanopsin thresholds to
            overnight sleep architecture.
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted home-landing__idea--stack" id="pillars">
        <div className="home-landing__inner home-landing__inner--wide">
          <div className="home-landing__pillars">
            {EVIDENCE_PILLARS.map((pillar) => (
              <article key={pillar.id} className="home-landing__pillar">
                <p className="home-landing__pillar-label">{pillar.label}</p>
                <h3 className="home-landing__pillar-title">{pillar.title}</h3>
                <p className="home-landing__pillar-summary">{pillar.summary}</p>
                <ul className="home-landing__pillar-bullets">
                  {pillar.bullets.map((bullet) => (
                    <PillarBullet key={bullet.label} {...bullet} />
                  ))}
                </ul>
                <p className="home-landing__pillar-ref">{pillar.reference}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--stack">
        <div className="home-landing__inner">
          <h2 className="home-landing__title">{EVIDENCE_LOOP.headline}</h2>
          <p className="home-landing__card-detail home-landing__lede">{EVIDENCE_LOOP.body}</p>
          <div className="home-landing__hero-actions home-landing__hero-actions--wide">
            <Link className="home-landing__btn-solid" href={EVIDENCE_CTA.primary.href}>
              {EVIDENCE_CTA.primary.label}
            </Link>
            <Link className="home-landing__btn-ghost" href={EVIDENCE_CTA.secondary.href}>
              {EVIDENCE_CTA.secondary.label}
            </Link>
          </div>
          <p className="home-landing__proof-more">
            <Link href={EVIDENCE_CTA.tertiary.href}>{EVIDENCE_CTA.tertiary.label} ↗</Link>
          </p>
        </div>
      </section>

    </div>
  )
}
