import Link from 'next/link'

import { GpCohortTriageDashboard } from '@/components/clinicians/gp-cohort-triage-dashboard'
import { D3ClinicalDecisionTree } from '@/components/sections/how-it-works/d3-clinical-decision-tree'
import { DoseIntelligenceEngineFlow } from '@/components/sections/how-it-works/dose-intelligence-engine-flow'
import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import {
  HOW_IT_WORKS_COHORT,
  HOW_IT_WORKS_CTA,
  HOW_IT_WORKS_DEMO,
  HOW_IT_WORKS_HERO,
  HOW_IT_WORKS_INSIGHT,
  HOW_IT_WORKS_STEPS,
} from '@/lib/pitch/how-it-works-content'
import {
  HOW_IT_WORKS_D3_TREE,
  HOW_IT_WORKS_ENGINE,
} from '@/lib/pitch/how-it-works-engine-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

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
          <p className="home-landing__card-detail home-landing__lede kz-lead">{HOW_IT_WORKS_HERO.lede}</p>
        </div>
      </section>

      <section
        className="home-landing__idea home-landing__idea--from-top dios-surface-dark"
        data-nav-surface="dark"
        id="insight"
      >
        <div className="home-landing__inner">
          <p className="dios-on-dark-eyebrow">{HOW_IT_WORKS_INSIGHT.eyebrow}</p>
          <h2 className="home-landing__title dios-on-dark-title">
            {HOW_IT_WORKS_INSIGHT.headline}{' '}
            <em>{HOW_IT_WORKS_INSIGHT.headlineEmphasis}</em>
          </h2>
          <p className="home-landing__insight-statement dios-on-dark-copy dios-on-dark-copy--strong">
            {HOW_IT_WORKS_INSIGHT.statement}
          </p>
        </div>
      </section>

      <section
        className="home-landing__idea home-landing__idea--paper home-landing__idea--stack"
        id="engine-flow"
      >
        <div className="home-landing__inner home-landing__inner--wide home-landing__reveal">
          <p className="home-landing__kicker">{HOW_IT_WORKS_ENGINE.eyebrow}</p>
          <h2 className="home-landing__title">{HOW_IT_WORKS_ENGINE.headline}</h2>
          <p className="home-landing__card-detail home-landing__lede kz-lead">{HOW_IT_WORKS_ENGINE.lede}</p>
          <DoseIntelligenceEngineFlow />
        </div>
      </section>

      <section
        className="home-landing__idea home-landing__idea--muted home-landing__idea--stack"
        id="d3-decision"
      >
        <div className="home-landing__inner home-landing__inner--wide home-landing__reveal">
          <p className="home-landing__kicker">{HOW_IT_WORKS_D3_TREE.eyebrow}</p>
          <h2 className="home-landing__title">{HOW_IT_WORKS_D3_TREE.headline}</h2>
          <p className="home-landing__card-detail home-landing__lede kz-lead">{HOW_IT_WORKS_D3_TREE.lede}</p>
          <p className="home-landing__card-detail">{HOW_IT_WORKS_D3_TREE.scenarioLabel}</p>
          <D3ClinicalDecisionTree />
          <p className="home-landing__proof-more">
            <Link href={HOW_IT_WORKS_D3_TREE.prgcLink.href}>{HOW_IT_WORKS_D3_TREE.prgcLink.label} ↗</Link>
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted" id="how">
        <div className="home-landing__inner">
          <h2 className="home-landing__title home-landing__reveal">
            {HOW_IT_WORKS_STEPS.headline}
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

      <section
        className="home-landing__idea home-landing__idea--paper home-landing__idea--stack"
        id="cohort-triage"
      >
        <div className="home-landing__inner home-landing__inner--wide home-landing__reveal">
          <p className="home-landing__kicker">{HOW_IT_WORKS_COHORT.eyebrow}</p>
          <h2 className="home-landing__title">{HOW_IT_WORKS_COHORT.headline}</h2>
          <p className="home-landing__card-detail home-landing__lede kz-lead">{HOW_IT_WORKS_COHORT.lede}</p>
          <GpCohortTriageDashboard embedded />
          <p className="home-landing__proof-more">
            <Link href={HOW_IT_WORKS_COHORT.triageLink.href}>{HOW_IT_WORKS_COHORT.triageLink.label} ↗</Link>
          </p>
          <p className="home-landing__proof-more">
            <Link href={MARKETING_ROUTES.clinicians}>For clinicians ↗</Link>
          </p>
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

    </div>
  )
}
