import Link from 'next/link'

import { SECOPEUTIC_UK_STARTER_CLINICS } from '@/lib/secopeutic/certified-clinics'
import { SECOPEUTIC_CLINICS_PAGE } from '@/lib/secopeutic/clinics-content'

export function SecopeuticClinicsDirectory() {
  return (
    <div className="seco-clinics">
      <header className="seco-clinics__intro">
        <p className="seco-clinics__eyebrow">{SECOPEUTIC_CLINICS_PAGE.eyebrow}</p>
        <h1 className="seco-clinics__title">{SECOPEUTIC_CLINICS_PAGE.headline}</h1>
        <p className="seco-clinics__support">{SECOPEUTIC_CLINICS_PAGE.support}</p>
      </header>

      <div className="seco-clinics__panel">
        <div className="seco-clinics__grid">
          {SECOPEUTIC_UK_STARTER_CLINICS.map((clinic, index) => (
            <a
              key={clinic.id}
              id={clinic.id}
              href={clinic.href}
              className="seco-clinics__card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="seco-clinics__card-title">{clinic.cardTitle}</p>
              <p className="seco-clinics__card-meta">{clinic.cardMeta}</p>
              <span className="seco-clinics__rank" aria-hidden="true">
                {index + 1}
              </span>
            </a>
          ))}
        </div>
      </div>

      <p className="seco-clinics__note">{SECOPEUTIC_CLINICS_PAGE.certifiedNote}</p>

      <div className="seco-clinics__cta">
        <Link href={SECOPEUTIC_CLINICS_PAGE.pilotCta.href} className="seco-landing__btn seco-landing__btn--primary">
          {SECOPEUTIC_CLINICS_PAGE.pilotCta.label} →
        </Link>
      </div>
    </div>
  )
}
