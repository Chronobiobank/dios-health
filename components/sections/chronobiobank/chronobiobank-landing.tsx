import Link from 'next/link'

import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import {
  CHRONOBIOBANK_CTA,
  CHRONOBIOBANK_HERO,
  CHRONOBIOBANK_SECTIONS,
} from '@/lib/pitch/chronobiobank-landing-content'

export function ChronobiobankLanding() {
  return (
    <div className="home-landing dios-nav-tone-paper">
      <HomeLandingReveal />

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--from-top dios-page-top-bleed">
        <div className="home-landing__inner">
          <p className="home-landing__kicker">{CHRONOBIOBANK_HERO.eyebrow}</p>
          <h1 className="home-landing__hero-title">
            {CHRONOBIOBANK_HERO.headline}
            <br />
            <em>{CHRONOBIOBANK_HERO.headlineEmphasis}</em>
          </h1>
          <p className="home-landing__card-detail home-landing__lede">{CHRONOBIOBANK_HERO.lede}</p>
        </div>
      </section>

      {CHRONOBIOBANK_SECTIONS.map((section, index) => (
        <section
          key={section.id}
          className={
            index % 2 === 0
              ? 'home-landing__idea home-landing__idea--muted home-landing__idea--stack'
              : 'home-landing__idea home-landing__idea--paper home-landing__idea--stack'
          }
          id={section.id}
        >
          <div className="home-landing__inner">
            <p className="home-landing__kicker">{section.eyebrow}</p>
            <p className="home-landing__card-detail home-landing__lede home-landing__lede--block">
              {section.body}
            </p>
          </div>
        </section>
      ))}

      <section
        className="home-landing__idea home-landing__idea--from-top dios-surface-dark"
        data-nav-surface="dark"
        id="cta"
      >
        <div className="home-landing__inner">
          <p className="dios-on-dark-eyebrow">Contribute</p>
          <h2 className="home-landing__title dios-on-dark-title">
            Patients create the proof. <em>Patients own the proof.</em>
          </h2>
          <div className="home-landing__hero-actions home-landing__hero-actions--wide home-landing__insight-actions">
            <Link className="home-landing__btn-on-dark" href={CHRONOBIOBANK_CTA.primary.href}>
              {CHRONOBIOBANK_CTA.primary.label}
            </Link>
            <a className="home-landing__btn-ghost home-landing__btn-ghost--on-dark" href={CHRONOBIOBANK_CTA.secondary.href}>
              {CHRONOBIOBANK_CTA.secondary.label}
            </a>
          </div>
          <p className="home-landing__proof-more home-landing__proof-more--on-dark">
            <Link href={CHRONOBIOBANK_CTA.tertiary.href}>{CHRONOBIOBANK_CTA.tertiary.label} ↗</Link>
          </p>
        </div>
      </section>

    </div>
  )
}
