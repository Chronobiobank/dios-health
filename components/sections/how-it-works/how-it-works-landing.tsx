import Link from 'next/link'

import { DiosSiteFooter } from '@/components/sections/dios-site-footer'
import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import {
  HOW_IT_WORKS_CTA,
  HOW_IT_WORKS_DEMO,
  HOW_IT_WORKS_HERO,
  HOW_IT_WORKS_INSIGHT,
  HOW_IT_WORKS_STEPS,
} from '@/lib/pitch/how-it-works-content'

export function HowItWorksLanding() {
  return (
    <div className="home-landing dios-nav-tone-canvas">
      <HomeLandingReveal />

      <section className="home-landing__idea home-landing__idea--paper dios-page-top-bleed">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">{HOW_IT_WORKS_HERO.eyebrow}</p>
          <h1 className="home-landing__hero-title">
            {HOW_IT_WORKS_HERO.headline}
            <br />
            <em>{HOW_IT_WORKS_HERO.headlineEmphasis}</em>
          </h1>
          <p className="home-landing__card-detail">{HOW_IT_WORKS_HERO.lede}</p>
        </div>
      </section>

      <section className="home-landing__idea dios-surface-dark" data-nav-surface="dark" id="insight">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal dios-on-dark-title">
            {HOW_IT_WORKS_INSIGHT.headline}{' '}
            <em>{HOW_IT_WORKS_INSIGHT.headlineEmphasis}</em>
          </h2>
          <p className="home-landing__insight-statement home-landing__reveal dios-on-dark-copy dios-on-dark-copy--strong">
            {HOW_IT_WORKS_INSIGHT.statement}
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted" id="how">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal">
            {HOW_IT_WORKS_STEPS.headline[0]}
            <br />
            {HOW_IT_WORKS_STEPS.headline[1]}
          </h2>
          <div className="home-landing__steps home-landing__reveal">
            {HOW_IT_WORKS_STEPS.steps.map((step) => (
              <div key={step.n} className="home-landing__step">
                <span className="home-landing__step-n">{step.n}</span>
                <p className="home-landing__step-line">{step.line}</p>
              </div>
            ))}
          </div>
          <p className="home-landing__proof-more home-landing__reveal">
            <Link href={HOW_IT_WORKS_DEMO.href}>{HOW_IT_WORKS_DEMO.label} ↗</Link>
          </p>
          <p className="home-landing__card-detail home-landing__reveal">{HOW_IT_WORKS_DEMO.detail}</p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper">
        <div className="home-landing__inner home-landing__reveal">
          <div className="home-landing__hero-actions home-landing__hero-actions--wide">
            <Link className="home-landing__btn-solid" href={HOW_IT_WORKS_CTA.href}>
              {HOW_IT_WORKS_CTA.label}
            </Link>
            <Link className="home-landing__btn-ghost" href={HOW_IT_WORKS_DEMO.href}>
              {HOW_IT_WORKS_DEMO.label}
            </Link>
          </div>
          <p className="home-landing__card-detail">{HOW_IT_WORKS_CTA.detail}</p>
        </div>
      </section>

      <DiosSiteFooter />
    </div>
  )
}
