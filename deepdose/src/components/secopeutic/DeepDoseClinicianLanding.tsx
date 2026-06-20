import Link from 'next/link'

import { DEEPDOSE_CLINICIAN_LANDING } from '@/lib/secopeutic/landing-content'

export function DeepDoseClinicianLanding() {
  const { eyebrow, title, support, steps, cta, accessNote } = DEEPDOSE_CLINICIAN_LANDING

  return (
    <div className="seco-clinics-page">
      <div className="seco-landing__section-inner">
        <div className="seco-clinics__intro seco-reveal seco-reveal--1">
          <p className="seco-clinics__eyebrow">{eyebrow}</p>
          <h1 className="seco-clinics__title">{title}</h1>
          <p className="seco-clinics__support">{support}</p>
        </div>

        <div className="seco-clinics__panel seco-reveal seco-reveal--2">
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

        <p className="seco-clinics__note seco-reveal seco-reveal--3">
          Decision support only. You make every treatment decision.
        </p>

        <div className="seco-clinics__cta seco-reveal seco-reveal--3">
          <p className="seco-clinics__access-note">{accessNote}</p>
          <Link href={cta.href} className="seco-landing__btn seco-landing__btn--primary">
            {cta.label} →
          </Link>
        </div>
      </div>
    </div>
  )
}
