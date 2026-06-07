import Link from 'next/link'

import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import { HOME_PROOF } from '@/lib/pitch/home-landing-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'
import {
  CADENCE_TAGLINE,
  INTELLIGENCE_CADENCES,
  INTELLIGENCE_LAYER_ORDER,
  INTELLIGENCE_LAYER_SUMMARY,
} from '@/lib/product/intelligence-cadence'

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

export function ScienceLanding() {
  return (
    <div className="home-landing dios-nav-tone-paper">
      <HomeLandingReveal />

      <section
        className="home-landing__idea home-landing__idea--paper home-landing__idea--from-top home-landing__idea--stack dios-page-top-bleed"
        id="soundbites"
      >
        <div className="home-landing__inner">
          <p className="home-landing__kicker">Evidence</p>
          <h1 className="home-landing__hero-title">
            {HOME_PROOF.headline[0]}
            <br />
            <em>{HOME_PROOF.headline[1]}</em>
          </h1>
          <p className="home-landing__card-detail home-landing__lede">
            Chronomedicine evidence library — indexed for clinician and patient sharing.
          </p>
          <ul className="home-landing__proof-bites">
            {HOME_PROOF.soundbites.map((bite) => (
              <li key={bite}>{bite}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="home-landing__idea home-landing__idea--paper home-landing__idea--stack"
        id="four-cadences"
      >
        <div className="home-landing__inner home-landing__inner--wide">
          <p className="home-landing__kicker">Intelligence model</p>
          <h2 className="home-landing__title">{CADENCE_TAGLINE}</h2>
          <p className="home-landing__card-detail home-landing__lede home-landing__lede--block">
            {INTELLIGENCE_LAYER_SUMMARY}
          </p>
          <div className="home-landing__pillars">
            {INTELLIGENCE_LAYER_ORDER.map((cadenceId) => {
              const cadence = INTELLIGENCE_CADENCES[cadenceId]
              return (
                <article key={cadenceId} className="home-landing__pillar">
                  <p className="home-landing__pillar-label">{cadence.interval}</p>
                  <h3 className="home-landing__pillar-title">{cadence.label}</h3>
                  <p className="home-landing__pillar-summary">{cadence.description}</p>
                  <p className="home-landing__pillar-ref">{cadence.roleLabel}</p>
                </article>
              )
            })}
          </div>
          <p className="home-landing__proof-more">
            <Link href={MARKETING_ROUTES.technology}>Technology deep dive ↗</Link>
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--stack" id="studies">
        <div className="home-landing__inner">
          <h2 className="home-landing__title">Indexed studies</h2>
          <div className="home-landing__proof-cards">
            {HOME_PROOF.cards.map((card) => (
              <article key={card.ref} className="home-landing__proof-card">
                <p className="home-landing__proof-card-ref">{card.ref}</p>
                <p className="home-landing__proof-card-finding">
                  <ProofFinding text={card.finding} emphasis={card.emphasis} />
                </p>
                <a
                  className="home-landing__proof-card-doi"
                  href={card.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DOI ↗
                </a>
              </article>
            ))}
          </div>
          <p className="home-landing__proof-more">
            <Link href={MARKETING_ROUTES.evidence}>Extended clinical validation framework ↗</Link>
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--from-top dios-surface-dark" data-nav-surface="dark">
        <div className="home-landing__inner">
          <p className="dios-on-dark-eyebrow">Next step</p>
          <h2 className="home-landing__title dios-on-dark-title">
            See how DIOS <em>applies the evidence.</em>
          </h2>
          <div className="home-landing__insight-actions">
            <Link className="home-landing__btn-on-dark" href={MARKETING_ROUTES.howItWorks}>
              How it works
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
