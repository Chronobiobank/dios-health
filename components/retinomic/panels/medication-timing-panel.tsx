'use client'

import Link from 'next/link'

import { PATIENT_ROUTES } from '@/lib/auth/routes'
import type { MedicationTimingPlan } from '@/src/lib/engine/medication-timing'
import { cn } from '@/lib/utils'

type MedicationTimingPanelProps = {
  plan: MedicationTimingPlan
  /** Public /how-it-works — no settings link */
  publicDemo?: boolean
}

export function MedicationTimingPanel({ plan, publicDemo = false }: MedicationTimingPanelProps) {
  return (
    <section
      className="dios-glass-outer retinomic-panel retinomic-panel--medication"
      aria-labelledby="medication-timing-panel-title"
    >
      <p id="medication-timing-panel-title" className="retinomic-panel__label">
        Medication timing
      </p>
      <p className="type-body text-sm leading-relaxed text-[var(--text-secondary)]">{plan.intro}</p>
      <p className="calm-auth-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
        {plan.phaseCaption}
      </p>

      <ul className="mt-4 flex flex-col gap-2.5">
        {plan.windows.map((window) => (
          <li key={window.id} className="dios-glass-inner retinomic-med-window">
            <div className="retinomic-med-window__head">
              <p className="retinomic-med-window__time">{window.timeLabel}</p>
              {window.estimated ? (
                <span className="retinomic-med-window__badge">Estimated</span>
              ) : null}
              {window.isExample ? (
                <span className="retinomic-med-window__badge retinomic-med-window__badge--example">
                  Example
                </span>
              ) : null}
            </div>
            <p className="retinomic-med-window__name">{window.name}</p>
            <p className="dash-sub text-xs">{window.standardGuidance}</p>
            <p className="type-body mt-1.5 text-sm text-[var(--text-secondary)]">{window.directive}</p>
          </li>
        ))}
      </ul>

      {plan.unmatchedMedications.length > 0 ? (
        <p className="calm-auth-muted mt-3 text-[11px]">
          Not matched yet: {plan.unmatchedMedications.join(', ')}
        </p>
      ) : null}

      {!publicDemo && (plan.showingExamples || plan.hasPatientMeds) ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={PATIENT_ROUTES.profile} className="dios-btn-on-light--secondary text-sm">
            {plan.showingExamples ? 'Add your medications in Settings →' : 'Edit medications in Settings →'}
          </Link>
        </div>
      ) : null}

      {plan.showingExamples && publicDemo ? (
        <p className={cn('calm-auth-muted mt-4 text-[11px]')}>
          After signup, add your meds in profile to replace these examples with your personal windows.
        </p>
      ) : null}
    </section>
  )
}
