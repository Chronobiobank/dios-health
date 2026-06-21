import Link from 'next/link'

import { LandingHeroIntro } from '@/components/deepdose/LandingHeroIntro'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

export type PortalLandingStep = {
  title: string
  meta: string
}

export type PortalLandingContent = {
  hero: LandingHeroContent
  steps: readonly PortalLandingStep[]
  note: string
  cta: { label: string; href: string }
  accessNote: string
}

export function DeepDosePortalLanding({ hero, steps, note, cta, accessNote }: PortalLandingContent) {
  return (
    <div className="seco-landing seco-landing--maven">
      <section className="seco-landing__hero">
        <LandingHeroIntro hero={hero} />

        <div className="seco-landing__section-inner seco-reveal seco-reveal--3">
          <div className="seco-clinics__panel">
            <div className="seco-clinics__grid">
              {steps.map((step, index) => (
                <article key={step.title} className="seco-clinics__card">
                  <h2 className="seco-clinics__card-title">{step.title}</h2>
                  <p className="seco-clinics__card-meta">{step.meta}</p>
                  <span className="seco-clinics__rank" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <p className="seco-clinics__note">{note}</p>

          <div className="seco-clinics__cta">
            <p className="seco-clinics__access-note">{accessNote}</p>
            <Link href={cta.href} className="seco-landing__btn seco-landing__btn--primary">
              {cta.label} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
