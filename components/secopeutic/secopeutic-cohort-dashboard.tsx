import Link from 'next/link'

import { SecopeuticCohortTable } from '@/components/secopeutic/secopeutic-cohort-table'
import { TipTraqPractitionerBanner } from '@/components/clinic/tiptraq-practitioner-banner'
import { DATA_LABEL } from '@/components/dashboard/dashboard-styles'
import { FlagBadge } from '@/components/ui/flag-badge'
import { SECOPUTIC_DEMO_PATIENTS } from '@/lib/secopeutic/demo-cohort'
import { SECOPUTIC_LANDING_PATH, SECOPUTIC_PILOT_PATH } from '@/lib/secopeutic/site'

export function SecopeuticCohortDashboard() {
  const stable = SECOPUTIC_DEMO_PATIENTS.filter((p) => p.safetyZone === 'stable').length
  const review = SECOPUTIC_DEMO_PATIENTS.filter(
    (p) => p.safetyZone === 'review' || p.responseZone === 'review'
  ).length

  return (
    <div className="secopeutic-demo__page">
      <p className={DATA_LABEL}>Secopeutic OS · pilot demo</p>
      <h1 className="seco-display mt-2 max-w-3xl">
        Safety ledger plus sleep and timing between blood draws.
      </h1>
      <p className="secopeutic-demo__lede font-ui text-ui-body leading-relaxed">
        Illustrative monitoring for clinicians exploring or running high-dose vitamin D. City Labs
        ingested as you already run it. TipTraQ blocks ordered from the dashboard. Tap a row or
        open a record.
      </p>

      <div className="secopeutic-demo__badges">
        <FlagBadge label={`${SECOPUTIC_DEMO_PATIENTS.length} active patients`} severity="blue" />
        <FlagBadge label={`${stable} safety stable`} severity="green" />
        <FlagBadge label={`${review} need review`} severity="amber" />
      </div>

      <div className="secopeutic-audience-cards secopeutic-demo__section">
        <Link href="/secopeutic/demo/patients/helena-kowalski" className="secopeutic-audience-card">
          <p className={DATA_LABEL}>Sleep-led practice</p>
          <p className="mt-2 font-ui text-ui-body font-semibold text-black">Helena Kowalski</p>
          <p className="mt-2 font-ui text-ui-sm leading-relaxed text-black/65">
            Sleep recovery leads the B-vitamin phase. TipTraQ shows REM falling before the next City
            Labs draw.
          </p>
          <span className="secopeutic-audience-card__link">Open record →</span>
        </Link>
        <Link href="/secopeutic/demo/patients/marcus-okonkwo" className="secopeutic-audience-card">
          <p className={DATA_LABEL}>PTH-led practice</p>
          <p className="mt-2 font-ui text-ui-body font-semibold text-black">Marcus Okonkwo</p>
          <p className="mt-2 font-ui text-ui-sm leading-relaxed text-black/65">
            PTH trajectory and calcium cascade on one audit trail. Hold IU with concordant sleep.
          </p>
          <span className="secopeutic-audience-card__link">Open record →</span>
        </Link>
      </div>

      <div className="secopeutic-demo__section">
        <SecopeuticCohortTable patients={SECOPUTIC_DEMO_PATIENTS} />
      </div>

      <div className="secopeutic-demo__section">
        <TipTraqPractitionerBanner />
      </div>

      <section className="secopeutic-panel secopeutic-demo__section">
        <h2 className="font-mono text-ui-label uppercase tracking-widest text-black/45">
          Free pilot
        </h2>
        <p className="mt-2 max-w-xl font-ui text-ui-sm leading-relaxed text-black/70">
          Run three real patients on Secopeutic for six months at no cost. Keep City Labs. Add
          TipTraQ and dose window logging on one timeline.
        </p>
        <div className="seco-landing__actions mt-4">
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
