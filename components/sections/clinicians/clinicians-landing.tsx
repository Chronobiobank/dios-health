import Link from 'next/link'

import { CliniciansRevealInit } from '@/components/sections/clinicians/clinicians-reveal'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'
import {
  CHRONOMEDICINE_CLUSTERS,
  CLINICIANS_CTA,
  CLINICIANS_EVIDENCE,
  CLINICIANS_GAP,
  CLINICIANS_HERO,
  CLINICIANS_MOAT,
  CLINICIANS_STEPS,
  CLINICIANS_USERS,
} from '@/lib/pitch/clinicians-landing-content'

export function CliniciansLanding() {
  return (
    <div className="clinicians-landing dios-nav-tone-paper">
      <CliniciansRevealInit />

      <section className="clinicians-landing__section clinicians-landing__section--paper dios-page-top-bleed">
        <div className="clinicians-landing__inner">
          <p className="clinicians-landing__eyebrow">{CLINICIANS_HERO.eyebrow}</p>
          <h1 className="clinicians-landing__title">
            {CLINICIANS_HERO.headline}
            <br />
            <em>{CLINICIANS_HERO.headlineEmphasis}</em>
          </h1>
          <p className="clinicians-landing__lede">{CLINICIANS_HERO.subheadline}</p>
          <div className="clinicians-landing__actions">
            <Link className="clinicians-landing__btn clinicians-landing__btn--dark" href={CLINICIANS_HERO.primaryCta.href}>
              {CLINICIANS_HERO.primaryCta.label}
            </Link>
            <Link
              className="clinicians-landing__btn clinicians-landing__btn--line"
              href={CLINICIANS_HERO.secondaryCta.href}
            >
              {CLINICIANS_HERO.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="clinicians-landing__section dios-surface-dark" data-nav-surface="dark" id="gap">
        <div className="clinicians-landing__inner">
          <p className="dios-on-dark-eyebrow clinicians-landing__reveal">{CLINICIANS_GAP.eyebrow}</p>
          <h2 className="clinicians-landing__title clinicians-landing__reveal dios-on-dark-title">
            {CLINICIANS_GAP.headline}
          </h2>
          <div className="dios-on-dark-stack clinicians-landing__reveal">
            <div className="dios-on-dark-panel">
              <p className="dios-on-dark-eyebrow">{CLINICIANS_GAP.before.label}</p>
              <p className="dios-on-dark-copy dios-on-dark-copy--struck">{CLINICIANS_GAP.before.body}</p>
            </div>
            <div className="dios-on-dark-panel dios-on-dark-panel--solution">
              <p className="dios-on-dark-eyebrow dios-on-dark-eyebrow--accent">
                {CLINICIANS_GAP.after.label}
              </p>
              <p className="dios-on-dark-copy dios-on-dark-copy--strong">{CLINICIANS_GAP.after.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="clinicians-landing__section" id="how">
        <div className="clinicians-landing__inner">
          <p className="clinicians-landing__eyebrow clinicians-landing__reveal">{CLINICIANS_STEPS.eyebrow}</p>
          <h2 className="clinicians-landing__title clinicians-landing__reveal">{CLINICIANS_STEPS.headline}</h2>
          <div className="clinicians-landing__steps clinicians-landing__reveal">
            {CLINICIANS_STEPS.steps.map((step) => (
              <article key={step.num} className="clinicians-landing__step">
                <p className="clinicians-landing__step-num">{step.num}</p>
                <p className="clinicians-landing__step-name">{step.name}</p>
                <p className="clinicians-landing__step-desc">{step.desc}</p>
                <p className="clinicians-landing__step-mono">{step.mono}</p>
              </article>
            ))}
          </div>
          <div className="clinicians-landing__clusters clinicians-landing__reveal" aria-label="Dose timing categories">
            {CHRONOMEDICINE_CLUSTERS.map((cluster) => (
              <div key={cluster.id} className="clinicians-landing__cluster">
                <p className="clinicians-landing__cluster-label">{cluster.label}</p>
                <p className="clinicians-landing__cluster-examples">{cluster.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="clinicians-landing__section clinicians-landing__section--muted" id="users">
        <div className="clinicians-landing__inner">
          <p className="clinicians-landing__eyebrow clinicians-landing__reveal">{CLINICIANS_USERS.eyebrow}</p>
          <h2 className="clinicians-landing__title clinicians-landing__reveal">{CLINICIANS_USERS.headline}</h2>
          <div className="clinicians-landing__users clinicians-landing__reveal">
            <article>
              <div className="clinicians-landing__user-head dios-dark-block dios-dark-block--ink">
                <p className="dios-on-dark-eyebrow">{CLINICIANS_USERS.clinician.who}</p>
                <p className="clinicians-landing__user-cvp dios-on-dark-headline">{CLINICIANS_USERS.clinician.cvp}</p>
              </div>
              <div className="clinicians-landing__user-body">
                {CLINICIANS_USERS.clinician.points.map((point) => (
                  <p key={point} className="clinicians-landing__user-point">
                    <span className="clinicians-landing__user-mark">—</span>
                    {point}
                  </p>
                ))}
              </div>
            </article>
            <article>
              <div className="clinicians-landing__user-head dios-dark-block dios-dark-block--solution">
                <p className="dios-on-dark-eyebrow dios-on-dark-eyebrow--accent">{CLINICIANS_USERS.patient.who}</p>
                <p className="clinicians-landing__user-cvp dios-on-dark-headline">{CLINICIANS_USERS.patient.cvp}</p>
              </div>
              <div className="clinicians-landing__user-body">
                {CLINICIANS_USERS.patient.points.map((point) => (
                  <p key={point} className="clinicians-landing__user-point">
                    <span className="clinicians-landing__user-mark">—</span>
                    {point}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="clinicians-landing__section dios-surface-dark" data-nav-surface="dark" id="moat">
        <div className="clinicians-landing__inner">
          <p className="dios-on-dark-eyebrow dios-on-dark-eyebrow--accent clinicians-landing__reveal">
            {CLINICIANS_MOAT.eyebrow}
          </p>
          <h2 className="clinicians-landing__title dios-on-dark-title clinicians-landing__reveal">
            {CLINICIANS_MOAT.headline}
          </h2>
          <p className="dios-on-dark-copy clinicians-landing__lede clinicians-landing__reveal">{CLINICIANS_MOAT.sub}</p>
          <div className="clinicians-landing__moat-grid clinicians-landing__reveal">
            {CLINICIANS_MOAT.competitors.map((c) => (
              <div key={c.name} className="clinicians-landing__moat-cell">
                <p className="clinicians-landing__moat-name">
                  {c.name} — {c.stat}
                </p>
                <p className="clinicians-landing__moat-what">{c.what}</p>
                <p className="clinicians-landing__moat-gap">{c.gap}</p>
              </div>
            ))}
          </div>
          <div className="clinicians-landing__verdict clinicians-landing__reveal">
            <p>{CLINICIANS_MOAT.verdict}</p>
          </div>
        </div>
      </section>

      <section className="clinicians-landing__section" id="science">
        <div className="clinicians-landing__inner">
          <p className="clinicians-landing__eyebrow clinicians-landing__reveal">{CLINICIANS_EVIDENCE.eyebrow}</p>
          <h2 className="clinicians-landing__title clinicians-landing__reveal">{CLINICIANS_EVIDENCE.headline}</h2>
          <div className="clinicians-landing__evidence clinicians-landing__reveal">
            {CLINICIANS_EVIDENCE.cards.map((card) => (
              <article key={card.source} className="clinicians-landing__ev-card">
                <p className="clinicians-landing__ev-source">{card.source}</p>
                <p className="clinicians-landing__ev-finding">{card.finding}</p>
              </article>
            ))}
          </div>
          <p className="clinicians-landing__more-link clinicians-landing__reveal">
            <Link href={MARKETING_ROUTES.science}>Peer-reviewed library ↗</Link>
          </p>
        </div>
      </section>

      <section className="clinicians-landing__cta" id="cta">
        <div className="clinicians-landing__inner">
          <h2 className="clinicians-landing__title">{CLINICIANS_CTA.headline}</h2>
          <p className="clinicians-landing__lede">{CLINICIANS_CTA.sub}</p>
          <div className="clinicians-landing__actions">
            <Link className="clinicians-landing__btn clinicians-landing__btn--white" href={CLINICIANS_CTA.primary.href}>
              {CLINICIANS_CTA.primary.label}
            </Link>
            <Link className="clinicians-landing__btn clinicians-landing__btn--ghost" href={CLINICIANS_CTA.secondary.href}>
              {CLINICIANS_CTA.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="clinicians-landing__section clinicians-landing__section--muted">
        <div className="clinicians-landing__inner">
          <p className="clinicians-landing__more-link">
            <Link href={MARKETING_ROUTES.science}>Full evidence library ↗</Link>
          </p>
        </div>
      </section>

    </div>
  )
}
