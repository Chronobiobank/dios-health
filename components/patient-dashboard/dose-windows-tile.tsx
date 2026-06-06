'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'

import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { buildEatingWindowSummary } from '@/lib/patient-dashboard/build-eating-window'
import { PATIENT_TRIAGE_STRIP } from '@/lib/patient-dashboard/script-first-narrative'
import type { CohortTriageStatus, Medication, PatientSnapshot } from '@/lib/patient-dashboard/types'
import type { FirstLightDailyStatus } from '@/lib/product/first-light-daily-status'
import { cn } from '@/lib/utils'

type DoseWindowsTileProps = {
  snapshot: PatientSnapshot
  dailyStatus?: FirstLightDailyStatus | null
  confirmedDosesToday?: string[]
  onDoseConfirmed?: (medicationName: string) => void
}

function normalizeMedName(name: string): string {
  return name.trim().toLowerCase()
}

function effectiveStatus(
  med: Medication,
  confirmed: Set<string>
): Medication['status'] {
  if (confirmed.has(normalizeMedName(med.name))) return 'taken'
  return med.status
}

function statusLabel(status: Medication['status']): string {
  if (status === 'taken') return 'Taken'
  if (status === 'tonight') return 'Window open'
  return 'Upcoming'
}

function statusClass(status: Medication['status']): string {
  if (status === 'taken') return 'dose-windows-tile__status--taken'
  if (status === 'tonight') return 'dose-windows-tile__status--open'
  return 'dose-windows-tile__status--upcoming'
}

function triageStripClass(status: CohortTriageStatus): string {
  if (status === 'green') return 'dose-windows-tile__triage--green'
  if (status === 'amber') return 'dose-windows-tile__triage--amber'
  return 'dose-windows-tile__triage--red'
}

export function DoseWindowsTile({
  snapshot,
  dailyStatus = null,
  confirmedDosesToday = [],
  onDoseConfirmed,
}: DoseWindowsTileProps) {
  const [confirming, setConfirming] = useState<string | null>(null)
  const [localConfirmed, setLocalConfirmed] = useState<string[]>([])

  const confirmedSet = useMemo(() => {
    const names = [...confirmedDosesToday, ...localConfirmed].map(normalizeMedName)
    return new Set(names)
  }, [confirmedDosesToday, localConfirmed])

  const eatingWindow =
    dailyStatus?.eatingWindow ?? snapshot.eatingWindow ?? buildEatingWindowSummary()

  const triageStatus = snapshot.patientTriageStatus ?? 'amber'
  const triageCopy = PATIENT_TRIAGE_STRIP[triageStatus]

  const medications = snapshot.medications.map((med) => ({
    ...med,
    status: effectiveStatus(med, confirmedSet),
  }))

  const openCount = medications.filter((m) => m.status === 'tonight').length
  const nextMed = medications.find((m) => m.status !== 'taken')

  const confirmDose = useCallback(
    async (med: Medication) => {
      if (confirming) return
      setConfirming(med.name)
      try {
        const res = await fetch('/api/coach/confirm-dose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            medicationName: med.name,
            confirmedAt: new Date().toISOString(),
          }),
        })
        if (res.ok) {
          setLocalConfirmed((prev) => [...prev, med.name])
          onDoseConfirmed?.(med.name)
        }
      } catch {
        /* demo / offline — still mark locally for UX */
        setLocalConfirmed((prev) => [...prev, med.name])
        onDoseConfirmed?.(med.name)
      } finally {
        setConfirming(null)
      }
    },
    [confirming, onDoseConfirmed]
  )

  return (
    <div className="glass-tile dose-windows-tile w-full">
      <div className={cn('dose-windows-tile__triage', triageStripClass(triageStatus))}>
        <span className="dose-windows-tile__triage-label">{triageCopy.label}</span>
        <span className="dose-windows-tile__triage-detail">{triageCopy.detail}</span>
      </div>

      {dailyStatus?.completeToday ? (
        <div
          className={cn(
            'dose-windows-tile__scan-status',
            dailyStatus.riskStatus === 'amber'
              ? 'dose-windows-tile__scan-status--amber'
              : 'dose-windows-tile__scan-status--green'
          )}
        >
          {dailyStatus.riskStatus === 'amber'
            ? 'Safety checkpoints incomplete — clinician sees amber until cleared.'
            : 'First Light complete — dose windows anchored for today.'}
        </div>
      ) : null}

      <div className="dose-windows-tile__head">
        <div>
          <p className="dose-windows-tile__eyebrow">Today&apos;s script</p>
          <h2 className="dose-windows-tile__title">Your dose windows</h2>
          <p className="dose-windows-tile__phase">
            Body clock phase · <strong>{snapshot.dlmoEstimate}</strong>
            {snapshot.clockDrift > 0 ? (
              <span className="dose-windows-tile__drift"> · {snapshot.clockDrift}m drift</span>
            ) : null}
          </p>
        </div>
        {nextMed ? (
          <div className="dose-windows-tile__next">
            <p className="dose-windows-tile__next-label">Next</p>
            <p className="dose-windows-tile__next-value">
              {nextMed.name} · {nextMed.time}
            </p>
          </div>
        ) : null}
      </div>

      <div className="dose-windows-tile__eating">
        <p className="dose-windows-tile__eating-label">Eating window</p>
        <p className="dose-windows-tile__eating-value">
          Opens {eatingWindow.opens} · closes {eatingWindow.closes}
        </p>
      </div>

      {medications.length === 0 ? (
        <p className="dose-windows-tile__empty">
          Add your medications in{' '}
          <Link href={PATIENT_ROUTES.profile} className="dose-windows-tile__link">
            profile
          </Link>{' '}
          to see personalised timing windows.
        </p>
      ) : (
        <ul className="dose-windows-tile__meds">
          {medications.map((med) => (
            <li key={`${med.name}-${med.time}`} className="dose-windows-tile__med">
              <div className="dose-windows-tile__med-main">
                <span className="dose-windows-tile__dot" style={{ background: med.colour }} aria-hidden />
                <div className="min-w-0">
                  <p className="dose-windows-tile__med-name">
                    {med.name}
                    {med.dose ? <span className="dose-windows-tile__med-dose"> · {med.dose}</span> : null}
                  </p>
                  <p className="dose-windows-tile__med-time">{med.time}</p>
                </div>
              </div>
              <div className="dose-windows-tile__med-actions">
                {med.status === 'tonight' ? (
                  <button
                    type="button"
                    className="dose-windows-tile__confirm"
                    disabled={confirming === med.name}
                    onClick={() => void confirmDose(med)}
                  >
                    {confirming === med.name ? 'Saving…' : 'Confirm taken'}
                  </button>
                ) : null}
                <span className={cn('dose-windows-tile__status', statusClass(med.status))}>
                  {statusLabel(med.status)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {openCount > 0 ? (
        <p className="dose-windows-tile__foot">
          {openCount} {openCount === 1 ? 'window is' : 'windows are'} open tonight — confirm each dose
          when taken so your clinician sees green adherence.
        </p>
      ) : (
        <p className="dose-windows-tile__foot">
          Share this timing profile with your GP or pharmacist if anything looks off.
        </p>
      )}
    </div>
  )
}
