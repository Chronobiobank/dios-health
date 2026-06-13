import Link from 'next/link'

import {
  SECOPEUTIC_UK_STARTER_CLINICS,
  SECOPEUTIC_VERIFIED_CLINICS,
  type SecopeuticCertifiedClinic,
} from '@/lib/secopeutic/certified-clinics'
import {
  SECOPEUTIC_CLINIC_PATHWAY_LABELS,
  SECOPEUTIC_CLINICS_PAGE,
} from '@/lib/secopeutic/clinics-content'
import { cn } from '@/lib/utils'

function PathwayBadge({ pathway }: { pathway: SecopeuticCertifiedClinic['pathway'] }) {
  const toneClass =
    pathway === 'pth-led'
      ? 'seco-clinics__badge--pth'
      : pathway === 'sleep-led'
        ? 'seco-clinics__badge--sleep'
        : 'seco-clinics__badge--injection'

  return (
    <span className={cn('seco-clinics__badge', toneClass)}>
      {SECOPEUTIC_CLINIC_PATHWAY_LABELS[pathway].label}
    </span>
  )
}

function ClinicCard({ clinic }: { clinic: SecopeuticCertifiedClinic }) {
  return (
    <article id={clinic.id} className="seco-clinics__card">
      <div className="seco-clinics__card-head">
        <h3 className="seco-clinics__card-title">{clinic.name}</h3>
        <PathwayBadge pathway={clinic.pathway} />
      </div>
      <p className="seco-clinics__card-location">
        {clinic.city}, {clinic.region}
      </p>
      <p className="seco-clinics__card-summary">{clinic.summary}</p>
      <dl className="seco-clinics__facts">
        <div>
          <dt>Dose range</dt>
          <dd>{clinic.doseRange}</dd>
        </div>
        <div>
          <dt>Supervision</dt>
          <dd>{clinic.supervision}</dd>
        </div>
      </dl>
      <a
        href={clinic.href}
        className="seco-clinics__card-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit clinic site →
      </a>
    </article>
  )
}

export function SecopeuticClinicsDirectory() {
  return (
    <div className="seco-clinics">
      <header className="seco-clinics__intro">
        <p className="seco-clinics__eyebrow">{SECOPEUTIC_CLINICS_PAGE.eyebrow}</p>
        <h1 className="seco-clinics__title">{SECOPEUTIC_CLINICS_PAGE.headline}</h1>
        <p className="seco-clinics__support">{SECOPEUTIC_CLINICS_PAGE.support}</p>
      </header>

      <section className="seco-clinics__section" aria-labelledby="seco-clinics-verified">
        <h2 id="seco-clinics-verified" className="seco-clinics__section-title">
          {SECOPEUTIC_CLINICS_PAGE.verifiedTitle}
        </h2>
        <p className="seco-clinics__section-support">{SECOPEUTIC_CLINICS_PAGE.verifiedSupport}</p>
        {SECOPEUTIC_VERIFIED_CLINICS.length > 0 ? (
          <div className="seco-clinics__grid">
            {SECOPEUTIC_VERIFIED_CLINICS.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        ) : (
          <p className="seco-clinics__empty">{SECOPEUTIC_CLINICS_PAGE.verifiedEmpty}</p>
        )}
      </section>

      <section className="seco-clinics__section" aria-labelledby="seco-clinics-directory">
        <h2 id="seco-clinics-directory" className="seco-clinics__section-title">
          {SECOPEUTIC_CLINICS_PAGE.directoryTitle}
        </h2>
        <p className="seco-clinics__section-support">{SECOPEUTIC_CLINICS_PAGE.directorySupport}</p>
        <div className="seco-clinics__grid">
          {SECOPEUTIC_UK_STARTER_CLINICS.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      </section>

      <section className="seco-clinics__opt-in">
        <h2 className="seco-clinics__section-title">{SECOPEUTIC_CLINICS_PAGE.optInTitle}</h2>
        <p className="seco-clinics__section-support">{SECOPEUTIC_CLINICS_PAGE.optInSupport}</p>
        <Link href={SECOPEUTIC_CLINICS_PAGE.optInCta.href} className="seco-landing__btn seco-landing__btn--primary">
          {SECOPEUTIC_CLINICS_PAGE.optInCta.label} →
        </Link>
      </section>
    </div>
  )
}
