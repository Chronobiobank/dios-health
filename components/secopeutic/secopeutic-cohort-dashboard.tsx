import Link from 'next/link'

import { SecopeuticCohortTable } from '@/components/secopeutic/secopeutic-cohort-table'
import {
  protocolLabel,
  SECOPUTIC_DEMO_PATIENTS,
  zoneLabel,
} from '@/lib/secopeutic/demo-cohort'
import { SECOPEUTIC_DEMO_PAGE } from '@/lib/secopeutic/demo-content'
import { SECOPUTIC_DEMO_PATH, SECOPUTIC_LANDING_PATH, SECOPUTIC_PILOT_PATH } from '@/lib/secopeutic/site'
import { cn } from '@/lib/utils'

const ZONE_CLASS = {
  stable: 'seco-demo-zone--stable',
  review: 'seco-demo-zone--review',
  hold: 'seco-demo-zone--hold',
} as const

export function SecopeuticCohortDashboard() {
  const stable = SECOPUTIC_DEMO_PATIENTS.filter((p) => p.safetyZone === 'stable').length
  const review = SECOPUTIC_DEMO_PATIENTS.filter(
    (p) => p.safetyZone === 'review' || p.responseZone === 'review'
  ).length
  const hold = SECOPUTIC_DEMO_PATIENTS.filter(
    (p) => p.safetyZone === 'hold' || p.responseZone === 'hold'
  ).length

  return (
    <div className="seco-demo-workspace">
      <header className="seco-demo-hero">
        <p className="seco-demo-hero__eyebrow">{SECOPEUTIC_DEMO_PAGE.eyebrow}</p>
        <h1 className="seco-demo-hero__title">{SECOPEUTIC_DEMO_PAGE.headline}</h1>
        <p className="seco-demo-hero__support">{SECOPEUTIC_DEMO_PAGE.support}</p>
      </header>

      <div className="seco-demo-stats">
        <div className="seco-demo-stat">
          <p className="seco-demo-stat__label">Active patients</p>
          <p className="seco-demo-stat__value">{SECOPUTIC_DEMO_PATIENTS.length}</p>
        </div>
        <div className="seco-demo-stat">
          <p className="seco-demo-stat__label">Safety stable</p>
          <p className="seco-demo-stat__value seco-demo-stat__value--stable">{stable}</p>
        </div>
        <div className="seco-demo-stat">
          <p className="seco-demo-stat__label">Need review</p>
          <p className="seco-demo-stat__value seco-demo-stat__value--review">{review}</p>
        </div>
        <div className="seco-demo-stat">
          <p className="seco-demo-stat__label">On hold</p>
          <p className="seco-demo-stat__value seco-demo-stat__value--hold">{hold}</p>
        </div>
      </div>

      <section className="seco-demo-section" aria-labelledby="seco-demo-patients">
        <h2 id="seco-demo-patients" className="seco-demo-section__title">
          Featured records
        </h2>
        <div className="seco-demo-patient-grid">
          {SECOPUTIC_DEMO_PATIENTS.map((patient) => (
            <Link
              key={patient.id}
              href={`${SECOPUTIC_DEMO_PATH}/patients/${patient.id}`}
              className="seco-demo-patient-card"
            >
              <div className="seco-demo-patient-card__head">
                <p className="seco-demo-patient-card__pathway">{protocolLabel(patient.protocol)}</p>
                <span className={cn('seco-demo-zone', ZONE_CLASS[patient.safetyZone])}>
                  {zoneLabel(patient.safetyZone)}
                </span>
              </div>
              <h3 className="seco-demo-patient-card__name">{patient.displayName}</h3>
              <p className="seco-demo-patient-card__meta">
                {patient.recordId} · {patient.age}
              </p>
              <p className="seco-demo-patient-card__copy">{patient.clinicalRead}</p>
              <span className="seco-demo-patient-card__link">Open record →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="seco-demo-section">
        <SecopeuticCohortTable
          patients={SECOPUTIC_DEMO_PATIENTS}
          title={SECOPEUTIC_DEMO_PAGE.cohortTitle}
          support={SECOPEUTIC_DEMO_PAGE.cohortSupport}
          variant="dark"
        />
      </section>

      <aside className="seco-demo-band">
        <p className="seco-demo-band__eyebrow">{SECOPEUTIC_DEMO_PAGE.tiptraqTitle}</p>
        <p className="seco-demo-band__copy">{SECOPEUTIC_DEMO_PAGE.tiptraqSupport}</p>
      </aside>

      <section className="seco-demo-cta">
        <h2 className="seco-demo-cta__title">{SECOPEUTIC_DEMO_PAGE.pilotHeadline}</h2>
        <p className="seco-demo-cta__support">{SECOPEUTIC_DEMO_PAGE.pilotSupport}</p>
        <div className="seco-demo-cta__actions">
          <Link href={SECOPUTIC_PILOT_PATH} className="seco-landing__btn seco-landing__btn--primary">
            Claim free pilot →
          </Link>
          <Link href={SECOPUTIC_LANDING_PATH} className="seco-landing__btn seco-landing__btn--secondary">
            Back to home →
          </Link>
        </div>
      </section>
    </div>
  )
}
