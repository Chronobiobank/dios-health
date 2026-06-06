import Link from 'next/link'

import { DiosSiteFooter } from '@/components/sections/dios-site-footer'
import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import {
  HOME_AUDIENCE,
  HOME_CTA,
  HOME_INSIGHT,
  HOME_PROBLEM,
  HOME_PROOF,
  HOME_STEPS,
  MARKETING_ROUTES,
} from '@/lib/pitch/home-landing-content'

function ProofFinding({ text, emphasis }: { text: string; emphasis: string }) {
  const parts = text.split(emphasis)
  if (parts.length < 2) return <>{text}</>
  return (
    <>
      {parts[0]}
      <strong>{emphasis}</strong>
      {parts.slice(1).join(emphasis)}
    </>
  )
}

export function HomeLanding() {
  return (
    <div className="home-landing dios-nav-tone-paper">
      <HomeLandingReveal />

      <section className="home-landing__idea home-landing__idea--paper dios-page-top-bleed">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">{HOME_PROBLEM.kicker}</p>
          <h1 className="home-landing__hero-title">
            {HOME_PROBLEM.lines.map((line, i) => (
              <span key={line}>
                {i === HOME_PROBLEM.emphasisLine ? <em>{line}</em> : line}
                {i < HOME_PROBLEM.lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <div className="home-landing__hero-actions">
            <Link className="home-landing__btn-solid" href={HOME_PROBLEM.primaryCta.href}>
              {HOME_PROBLEM.primaryCta.label}
            </Link>
            <Link className="home-landing__btn-ghost" href={HOME_PROBLEM.secondaryCta.href}>
              {HOME_PROBLEM.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-landing__idea dios-surface-dark" data-nav-surface="dark" id="insight">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal dios-on-dark-title">
            {HOME_INSIGHT.headline}{' '}
            <em>{HOME_INSIGHT.headlineEmphasis}</em>
          </h2>
          <p className="home-landing__insight-statement home-landing__reveal dios-on-dark-copy dios-on-dark-copy--strong">
            {HOME_INSIGHT.statement}
          </p>
          <div className="home-landing__insight-actions home-landing__reveal">
            <Link className="home-landing__btn-on-dark" href={HOME_INSIGHT.ctaHref}>
              {HOME_INSIGHT.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted" id="who">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal">
            {HOME_AUDIENCE.headline[0]}
            <br />
            {HOME_AUDIENCE.headline[1]}
          </h2>
          <div className="home-landing__cards home-landing__reveal">
            <Link className="home-landing__card" href={HOME_AUDIENCE.patient.href}>
              <div className="home-landing__card-top dios-dark-block dios-dark-block--solution">
                <p className="dios-on-dark-eyebrow dios-on-dark-eyebrow--accent">{HOME_AUDIENCE.patient.who}</p>
                <p className="home-landing__card-line dios-on-dark-headline">{HOME_AUDIENCE.patient.line}</p>
              </div>
            </Link>
            <Link className="home-landing__card" href={HOME_AUDIENCE.clinician.href}>
              <div className="home-landing__card-top dios-dark-block dios-dark-block--ink">
                <p className="dios-on-dark-eyebrow">{HOME_AUDIENCE.clinician.who}</p>
                <p className="home-landing__card-line dios-on-dark-headline">{HOME_AUDIENCE.clinician.line}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper" id="how">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal">
            {HOME_STEPS.headline[0]}
            <br />
            {HOME_STEPS.headline[1]}
          </h2>
          <div className="home-landing__steps home-landing__reveal">
            {HOME_STEPS.steps.map((step) => (
              <div key={step.n} className="home-landing__step">
                <span className="home-landing__step-n">{step.n}</span>
                <div>
                  <p className="home-landing__step-title">{step.title}</p>
                  <p className="home-landing__step-detail">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="home-landing__proof-more home-landing__reveal">
            <Link href={MARKETING_ROUTES.howItWorks}>Full walkthrough ↗</Link>
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted" id="science">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal">
            {HOME_PROOF.headline[0]}
            <br />
            {HOME_PROOF.headline[1]}
          </h2>
          <div className="home-landing__proof-cards home-landing__reveal">
            {HOME_PROOF.cards.map((card) => (
              <article key={card.ref} className="home-landing__proof-card">
                <p className="home-landing__proof-ref">{card.ref}</p>
                <p className="home-landing__proof-finding">
                  <ProofFinding text={card.finding} emphasis={card.emphasis} />
                </p>
                <a
                  className="home-landing__proof-doi"
                  href={card.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DOI ↗
                </a>
              </article>
            ))}
          </div>
          <p className="home-landing__proof-more home-landing__reveal">
            <Link href={HOME_PROOF.moreHref}>{HOME_PROOF.moreLabel} ↗</Link>
          </p>
        </div>
      </section>

      <section className="home-landing__idea dios-surface-accent" data-nav-surface="dark" id="cta">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal dios-on-dark-title">
            <em>
              {HOME_CTA.headline[0]}
              <br />
              {HOME_CTA.headline[1]}
            </em>
          </h2>
          <div className="home-landing__cta-cards home-landing__reveal">
            <Link className="home-landing__cta-card" href={HOME_CTA.patient.href}>
              <div className="home-landing__cta-top dios-dark-block dios-dark-block--solution">
                <p className="dios-on-dark-eyebrow dios-on-dark-eyebrow--accent">{HOME_CTA.patient.who}</p>
                <p className="home-landing__cta-line dios-on-dark-headline">{HOME_CTA.patient.line}</p>
              </div>
              <div className="home-landing__cta-foot dios-on-dark-foot">
                <span>{HOME_CTA.patient.detail}</span>
                <span aria-hidden>→</span>
              </div>
            </Link>
            <Link className="home-landing__cta-card" href={HOME_CTA.clinician.href}>
              <div className="home-landing__cta-top dios-dark-block dios-dark-block--ink">
                <p className="dios-on-dark-eyebrow">{HOME_CTA.clinician.who}</p>
                <p className="home-landing__cta-line dios-on-dark-headline">{HOME_CTA.clinician.line}</p>
              </div>
              <div className="home-landing__cta-foot dios-on-dark-foot">
                <span>{HOME_CTA.clinician.detail}</span>
                <span aria-hidden>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <DiosSiteFooter />
    </div>
  )
}
