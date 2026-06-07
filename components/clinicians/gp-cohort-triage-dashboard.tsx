'use client'

import { useMemo, useState } from 'react'

import {
  getGpCohortPatient,
  getGpCohortSummary,
  getSortedGpCohort,
  GP_COHORT_DEFAULT_PATIENT_ID,
  GP_TRIAGE_BAND_LABEL,
  type GpCohortPatient,
  type GpTriageBand,
} from '@/lib/clinicians/gp-cohort-mock'
import { cn } from '@/lib/utils'

const BAND_DOT: Record<GpTriageBand, string> = {
  needs_review: 'ct-card__dot--urgent',
  watch: 'ct-card__dot--review',
  on_track: 'ct-card__dot--on-track',
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

type QueueRowProps = {
  patient: GpCohortPatient
  active: boolean
  onSelect: () => void
}

function QueueRow({ patient, active, onSelect }: QueueRowProps) {
  return (
    <article className={cn('ct-card', active && 'is-active', patient.band === 'needs_review' && 'ct-card--alert')}>
      <button type="button" className="ct-card__main" onClick={onSelect}>
        <div className="ct-card__row">
          <span className={cn('ct-card__dot', BAND_DOT[patient.band])} aria-hidden />
          <div>
            <p className="ct-card__name">{patient.name}</p>
            <p className="ct-card__ref">
              {patient.ref} · {patient.age}y
            </p>
            <p className="ct-card__headline">{patient.headline}</p>
          </div>
        </div>
      </button>
    </article>
  )
}

type DetailPanelProps = {
  patient: GpCohortPatient
  onMessageDina: () => void
  onExport: () => void
  onOrderLabs: () => void
}

function DetailPanel({ patient, onMessageDina, onExport, onOrderLabs }: DetailPanelProps) {
  return (
    <section className="ct-detail">
      <header className="ct-detail__header">
        <h2 className="ct-detail__name">{patient.name}</h2>
        <p className="ct-detail__ref">
          {patient.ref} · {patient.age} years · {GP_TRIAGE_BAND_LABEL[patient.band]}
        </p>
      </header>

      <div className="ct-detail__grid">
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">DLMO</p>
          <p className="ct-detail__metric-value">{patient.dlmo ?? '—'}</p>
        </div>
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">Chronopenic burden</p>
          <p className="ct-detail__metric-value">{patient.chronopenicBurden ?? '—'}</p>
        </div>
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">Medications</p>
          <p className="ct-detail__metric-value">{patient.medications.length}</p>
        </div>
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">Recommended</p>
          <p className="ct-detail__metric-value ct-detail__metric-value--wrap">{patient.recommendedAction}</p>
        </div>
      </div>

      {patient.labs.length > 0 ? (
        <div className="ct-detail__labs">
          <p className="ct-detail__section-label">Recent labs</p>
          <ul className="ct-detail__lab-list">
            {patient.labs.map((lab) => (
              <li key={lab.label} className="ct-detail__lab-item">
                <strong>{lab.label}</strong> {lab.value}
                {lab.trend ? <span className="ct-detail__lab-trend"> · {lab.trend}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {patient.timingConflict ? (
        <div className="ct-detail__flag ct-detail__flag--red">
          <p className="ct-detail__flag-label">Timing conflict</p>
          <p className="ct-detail__flag-title">{patient.timingConflict.drugs}</p>
          <p className="ct-detail__flag-stat">
            {patient.timingConflict.averageSeparationMinutes} min average separation ·{' '}
            {patient.timingConflict.requiredSeparationMinutes} min required
          </p>
          <p className="ct-detail__flag-copy">{patient.timingConflict.detail}</p>
        </div>
      ) : null}

      <div className="ct-detail__insight">
        <p className="ct-detail__section-label">Clinical insight</p>
        <p className="ct-detail__insight-copy">{patient.clinicalInsight}</p>
      </div>

      <ul className="ct-detail__meds">
        {patient.medications.map((med) => (
          <li key={med}>{med}</li>
        ))}
      </ul>

      <div className="ct-detail__dina-handoff">
        <p className="ct-detail__dina-label">DINA note</p>
        <p className="ct-detail__dina-copy">{patient.dinaNote}</p>
      </div>

      <div className="ct-detail__actions">
        <button type="button" className="ct-detail__action ct-detail__action--primary" onClick={onMessageDina}>
          Message via DINA
        </button>
        <button type="button" className="ct-detail__action" onClick={onExport}>
          Export summary
        </button>
        <button
          type="button"
          className="ct-detail__action"
          onClick={onOrderLabs}
          disabled={patient.labsToOrder.length === 0}
        >
          Order labs
        </button>
      </div>
    </section>
  )
}

function DinaDraftModal({
  patient,
  onClose,
  onSend,
}: {
  patient: GpCohortPatient
  onClose: () => void
  onSend: () => void
}) {
  return (
    <aside className="ct-modal" role="dialog" aria-label="Message via DINA">
      <div className="ct-modal__panel">
        <div className="ct-modal__head">
          <h3 className="ct-modal__title">Message via DINA — {patient.name}</h3>
          <button type="button" className="ct-bti__close" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="ct-modal__hint">Review and send. Plain English, one specific action.</p>
        <textarea
          className="ct-modal__draft"
          readOnly
          rows={5}
          value={patient.dinaDraftMessage}
          aria-label="DINA message draft"
        />
        <div className="ct-modal__footer">
          <button type="button" className="ct-detail__action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ct-detail__action ct-detail__action--primary" onClick={onSend}>
            Send via DINA
          </button>
        </div>
      </div>
    </aside>
  )
}

function LabsModal({
  patient,
  onClose,
  onConfirm,
}: {
  patient: GpCohortPatient
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <aside className="ct-modal" role="dialog" aria-label="Order labs">
      <div className="ct-modal__panel">
        <div className="ct-modal__head">
          <h3 className="ct-modal__title">Order labs — {patient.name}</h3>
          <button type="button" className="ct-bti__close" onClick={onClose}>
            Close
          </button>
        </div>
        <ul className="ct-modal__lab-order">
          {patient.labsToOrder.map((lab) => (
            <li key={lab}>{lab}</li>
          ))}
        </ul>
        <div className="ct-modal__footer">
          <button type="button" className="ct-detail__action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ct-detail__action ct-detail__action--primary" onClick={onConfirm}>
            Place order
          </button>
        </div>
      </div>
    </aside>
  )
}

export function GpCohortTriageDashboard() {
  const cohort = useMemo(() => getSortedGpCohort(), [])
  const summary = useMemo(() => getGpCohortSummary(cohort), [cohort])

  const [selectedId, setSelectedId] = useState(GP_COHORT_DEFAULT_PATIENT_ID)
  const [dinaModal, setDinaModal] = useState(false)
  const [labsModal, setLabsModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const selected =
    getGpCohortPatient(selectedId) ?? getGpCohortPatient(GP_COHORT_DEFAULT_PATIENT_ID) ?? cohort[0]

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }

  return (
    <div className="ct-shell dios-nav-tone-surface dios-page-top-bleed">
      <div className="ct-shell__frame">
        <header className="ct-shell__top">
          <p className="ct-shell__eyebrow">Monday morning review</p>
          <h1 className="ct-shell__title">Who needs attention this week?</h1>

          <div className="ct-summary-bar" aria-label="Cohort summary">
            <div className="ct-summary-bar__item ct-summary-bar__item--red">
              <span className="ct-summary-bar__count">{summary.needsReview}</span>
              <span className="ct-summary-bar__label">needs review</span>
            </div>
            <div className="ct-summary-bar__item ct-summary-bar__item--amber">
              <span className="ct-summary-bar__count">{summary.watch}</span>
              <span className="ct-summary-bar__label">watch</span>
            </div>
            <div className="ct-summary-bar__item ct-summary-bar__item--green">
              <span className="ct-summary-bar__count">{summary.onTrack}</span>
              <span className="ct-summary-bar__label">on track</span>
            </div>
            <p className="ct-summary-bar__meta">
              {summary.total} patients enrolled · sorted red → amber → green
            </p>
          </div>
        </header>

        <div className="ct-shell__body">
          <aside className="ct-shell__queue">
            <p className="ct-shell__queue-label">Cohort queue</p>
            {cohort.map((patient) => (
              <QueueRow
                key={patient.id}
                patient={patient}
                active={patient.id === selected?.id}
                onSelect={() => setSelectedId(patient.id)}
              />
            ))}
          </aside>

          <main className="ct-shell__detail">
            {selected ? (
              <DetailPanel
                patient={selected}
                onMessageDina={() => setDinaModal(true)}
                onExport={() => {
                  downloadTextFile(`${selected.ref}-dios-summary.txt`, selected.exportSummary)
                  showToast(`Summary exported for ${selected.name}`)
                }}
                onOrderLabs={() => setLabsModal(true)}
              />
            ) : null}

            {dinaModal && selected ? (
              <DinaDraftModal
                patient={selected}
                onClose={() => setDinaModal(false)}
                onSend={() => {
                  setDinaModal(false)
                  showToast(`Message queued to ${selected.name} via DINA`)
                }}
              />
            ) : null}

            {labsModal && selected ? (
              <LabsModal
                patient={selected}
                onClose={() => setLabsModal(false)}
                onConfirm={() => {
                  setLabsModal(false)
                  showToast(`Lab order placed: ${selected.labsToOrder.join(', ')}`)
                }}
              />
            ) : null}
          </main>
        </div>

        {toast ? (
          <p className="ct-toast" role="status">
            {toast}
          </p>
        ) : null}
      </div>
    </div>
  )
}
