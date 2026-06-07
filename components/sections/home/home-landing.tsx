import Link from 'next/link'

import { HomeCtaVideo } from '@/components/sections/home/home-cta-video'
import { HomeHeroVideo } from '@/components/sections/home/home-hero-video'
import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import {
  HOME_AUDIENCE,
  HOME_CASE_STUDY,
  HOME_CLINICAL_DISCLAIMER,
  HOME_CTA,
  HOME_HERO,
  HOME_INSIGHT,
  HOME_MARKETS,
  HOME_PROBLEM,
  HOME_PROOF,
  HOME_STEPS,
} from '@/lib/pitch/home-landing-content'

export function HomeLanding() {
  return (
    <div className="marketing-layout home-landing dios-nav-tone-paper">
      <HomeLandingReveal />

      <section
        className="home-landing__hero dios-page-top-bleed dios-surface-dark"
        data-nav-surface="dark"
        id="hero"
      >
        <HomeHeroVideo />
        <div className="home-landing__hero-scrim" aria-hidden />
        <div className="home-landing__inner home-landing__hero-content">
          <p className="home-landing__kicker home-landing__kicker--on-dark">{HOME_HERO.eyebrow}</p>
          <p className="home-landing__hero-tagline">
            {HOME_HERO.tagline[0]}
            <br />
            <em>{HOME_HERO.tagline[1]}</em>
          </p>
          <p className="home-landing__hero-subline">{HOME_HERO.subline}</p>
          <div className="home-landing__hero-actions">
            <Link className="home-landing__btn-on-dark home-landing__btn-on-dark--solid" href={HOME_HERO.primaryCta.href}>
              {HOME_HERO.primaryCta.label}
            </Link>
            <Link className="home-landing__btn-ghost home-landing__btn-ghost--on-dark" href={HOME_HERO.secondaryCta.href}>
              {HOME_HERO.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper" id="problem">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">{HOME_PROBLEM.eyebrow}</p>
          <h1 className="home-landing__hero-title">
            {HOME_PROBLEM.headline.map((line, i) => (
              <span key={line}>
                {i === HOME_PROBLEM.emphasisLine ? <em>{line}</em> : line}
                {i < HOME_PROBLEM.headline.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p className="home-landing__card-detail home-landing__lede">{HOME_PROBLEM.lede}</p>
          <div className="home-landing__hero-actions">
            <Link className="home-landing__btn-solid" href={HOME_PROBLEM.primaryCta.href}>
              {HOME_PROBLEM.primaryCta.label}
            </Link>
            <Link className="home-landing__btn-ghost" href={HOME_PROBLEM.evidenceCta.href}>
              {HOME_PROBLEM.evidenceCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-landing__idea home-landing__idea--from-top dios-surface-dark"
        data-nav-surface="dark"
        id="insight"
      >
        <div className="home-landing__inner">
          <p className="dios-on-dark-eyebrow">{HOME_INSIGHT.eyebrow}</p>
          <h2 className="home-landing__title dios-on-dark-title">
            {HOME_INSIGHT.headline}{' '}
            <em>{HOME_INSIGHT.headlineEmphasis}</em>
          </h2>
          <p className="home-landing__insight-statement dios-on-dark-copy dios-on-dark-copy--strong">
            {HOME_INSIGHT.statement}
          </p>
          <div className="home-landing__insight-actions">
            <Link className="home-landing__btn-on-dark" href={HOME_INSIGHT.ctaHref}>
              {HOME_INSIGHT.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted home-landing__idea--from-top" id="markets">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">{HOME_MARKETS.eyebrow}</p>
          <h2 className="home-landing__title">{HOME_MARKETS.headline}</h2>
          <div className="home-landing__market-lanes">
            {HOME_MARKETS.lanes.map((lane) => (
              <article key={lane.id} className="home-landing__market-lane">
                <p className="home-landing__market-label">{lane.label}</p>
                <p className="home-landing__market-line">{lane.line}</p>
                <ul className="home-landing__market-bullets">
                  {lane.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="home-landing__proof-more">
            <Link href={HOME_MARKETS.cta.href}>{HOME_MARKETS.cta.label} ↗</Link>
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--stack" id="case-study">
        <div className="home-landing__inner home-landing__inner--wide">
          <p className="home-landing__kicker">{HOME_CASE_STUDY.eyebrow}</p>
          <h2 className="home-landing__title">{HOME_CASE_STUDY.headline}</h2>
          <p className="home-landing__case-subhead">{HOME_CASE_STUDY.subhead}</p>
          <p className="home-landing__card-detail home-landing__lede">{HOME_CASE_STUDY.lede}</p>

          <div className="home-landing__case-metrics" aria-label="Cohort summary">
            {HOME_CASE_STUDY.metrics.map((metric) => (
              <div
                key={metric.label}
                className={`home-landing__case-metric home-landing__case-metric--${metric.tone}`}
              >
                <span className="home-landing__case-metric-value">{metric.value}</span>
                <span className="home-landing__case-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="home-landing__case-grid">
            <article className="home-landing__case-card home-landing__case-card--alert">
              <p className="home-landing__case-card-label">Needs review</p>
              <p className="home-landing__case-card-title">
                {HOME_CASE_STUDY.spotlight.patient} · {HOME_CASE_STUDY.spotlight.ref}
              </p>
              <p className="home-landing__case-card-issue">{HOME_CASE_STUDY.spotlight.issue}</p>
              <p className="home-landing__case-card-copy">
                <strong>Without DIOS:</strong> {HOME_CASE_STUDY.spotlight.withoutDios}
              </p>
              <p className="home-landing__case-card-copy">
                <strong>With DIOS:</strong> {HOME_CASE_STUDY.spotlight.withDios}
              </p>
              <p className="home-landing__case-card-outcome">{HOME_CASE_STUDY.spotlight.outcome}</p>
            </article>

            <article className="home-landing__case-card home-landing__case-card--ok">
              <p className="home-landing__case-card-label">On track</p>
              <p className="home-landing__case-card-title">
                {HOME_CASE_STUDY.onTrack.patient} · {HOME_CASE_STUDY.onTrack.ref}
              </p>
              <p className="home-landing__case-card-copy">{HOME_CASE_STUDY.onTrack.line}</p>
            </article>
          </div>

          <blockquote className="home-landing__case-quote">
            <p>&ldquo;{HOME_CASE_STUDY.quote.text}&rdquo;</p>
            <footer>{HOME_CASE_STUDY.quote.attribution}</footer>
          </blockquote>

          <div className="home-landing__hero-actions home-landing__hero-actions--wide">
            <Link className="home-landing__btn-solid" href={HOME_CASE_STUDY.cta.href}>
              {HOME_CASE_STUDY.cta.label}
            </Link>
            <Link className="home-landing__btn-ghost" href={HOME_CASE_STUDY.chronobiobankCta.href}>
              {HOME_CASE_STUDY.chronobiobankCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted home-landing__idea--from-top" id="who">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">{HOME_AUDIENCE.eyebrow}</p>
          <h2 className="home-landing__title">
            {HOME_AUDIENCE.headline[0]}
            <br />
            {HOME_AUDIENCE.headline[1]}
          </h2>
          <div className="home-landing__cards">
            <Link className="home-landing__card" href={HOME_AUDIENCE.clinician.href}>
              <div className="home-landing__card-top dios-dark-block dios-dark-block--ink">
                <p className="dios-on-dark-eyebrow">{HOME_AUDIENCE.clinician.who}</p>
                <p className="home-landing__card-line dios-on-dark-headline">{HOME_AUDIENCE.clinician.line}</p>
              </div>
            </Link>
            <Link className="home-landing__card" href={HOME_AUDIENCE.patient.href}>
              <div className="home-landing__card-top dios-dark-block dios-dark-block--solution">
                <p className="dios-on-dark-eyebrow dios-on-dark-eyebrow--accent">{HOME_AUDIENCE.patient.who}</p>
                <p className="home-landing__card-line dios-on-dark-headline">{HOME_AUDIENCE.patient.line}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--bronze" id="how">
        <div className="home-landing__inner">
          <p className="home-landing__kicker home-landing__kicker--on-bronze">{HOME_STEPS.eyebrow}</p>
          <h2 className="home-landing__title home-landing__title--on-bronze">{HOME_STEPS.headline}</h2>
          <div className="home-landing__steps">
            {HOME_STEPS.steps.map((step) => (
              <div key={step.n} className="home-landing__step">
                <span className="home-landing__step-n">{step.n}</span>
                <p className="home-landing__step-line">{step.line}</p>
              </div>
            ))}
          </div>
          <div className="home-landing__proof-actions home-landing__hero-actions--wide">
            <Link
              className="home-landing__btn-solid home-landing__btn-solid--block"
              href={HOME_STEPS.walkthroughCta.href}
            >
              {HOME_STEPS.walkthroughCta.label}
            </Link>
            <Link className="home-landing__btn-ghost" href={HOME_STEPS.demoCta.href}>
              {HOME_STEPS.demoCta.label}
            </Link>
          </div>
          <p className="home-landing__steps-disclaimer">{HOME_CLINICAL_DISCLAIMER}</p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--stack" id="proof">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">Evidence</p>
          <h2 className="home-landing__title">
            {HOME_PROOF.headline[0]}
            <br />
            <em>{HOME_PROOF.headline[1]}</em>
          </h2>
          <ul className="home-landing__proof-bites">
            {HOME_PROOF.soundbites.map((bite) => (
              <li key={bite}>{bite}</li>
            ))}
          </ul>
          <p className="home-landing__proof-more">
            <Link href={HOME_PROOF.ctaHref}>{HOME_PROOF.ctaLabel} ↗</Link>
          </p>
        </div>
      </section>

      <section
        className="home-landing__idea home-landing__idea--cta home-landing__idea--cta-photo"
        data-nav-surface="dark"
        id="cta"
      >
        <HomeCtaVideo />
        <div className="home-landing__cta-scrim" aria-hidden />
        <div className="home-landing__inner">
          <h2 className="type-hero home-landing__title home-landing__title--one-line">{HOME_CTA.headline}</h2>
          <div className="home-landing__cta-cards">
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
          </div>
          <p className="home-landing__proof-more home-landing__proof-more--on-dark">
            <Link href={HOME_CTA.briefing.href}>{HOME_CTA.briefing.label} ↗</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
