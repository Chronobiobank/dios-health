'use client'

import { useState } from 'react'
import type { MedicationRecommendation } from '@/lib/medications/recommendations'
import MedicationCard from '@/components/patient/MedicationCard'
import MedicationSearchPanel from '@/components/patient/MedicationSearchPanel'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

type SelectionState = Record<string, { doseValue: string; currentTiming: string }>

export type PatientMedicationsEditorProps = {
  phaseOffsetMinutes: number
  initialSelected?: Map<string, MedicationRecommendation>
  initialDetails?: SelectionState
  submitLabel: string
  savingLabel?: string
  onSaved: () => void
  searchPlaceholder?: string
  listTitle?: string
  emptyListMessage?: string
  secondaryAction?: React.ReactNode
  skipLabel?: string
  allowEmptySave?: boolean
}

function defaultTimingFor(med: MedicationRecommendation): string {
  return med.recommendedStart ?? '08:00'
}

export function PatientMedicationsEditor({
  phaseOffsetMinutes,
  initialSelected,
  initialDetails,
  submitLabel,
  savingLabel = 'Saving…',
  onSaved,
  searchPlaceholder = 'Search meds & supps',
  listTitle = 'Your medicines',
  emptyListMessage = 'Nothing added yet.',
  secondaryAction,
  skipLabel,
  allowEmptySave = false,
}: PatientMedicationsEditorProps) {
  const [selectedMeds, setSelectedMeds] = useState(
    () => initialSelected ?? new Map<string, MedicationRecommendation>()
  )
  const [details, setDetails] = useState<SelectionState>(() => initialDetails ?? {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addMedication(med: MedicationRecommendation, initialTiming?: string) {
    setSelectedMeds((prev) => {
      if (prev.has(med.code)) return prev
      const next = new Map(prev)
      next.set(med.code, med)
      return next
    })
    setDetails((prev) => {
      if (prev[med.code]) return prev
      return {
        ...prev,
        [med.code]: {
          doseValue: '',
          currentTiming: initialTiming ?? defaultTimingFor(med),
        },
      }
    })
  }

  function removeMedication(code: string) {
    setSelectedMeds((prev) => {
      const next = new Map(prev)
      next.delete(code)
      return next
    })
    setDetails((prev) => {
      const next = { ...prev }
      delete next[code]
      return next
    })
  }

  async function save(selections: { code: string; dose_mg?: number; current_timing?: string }[]) {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/patient/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medications: selections }),
    })

    const body = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(body.error ?? 'Failed to save medications')
      setLoading(false)
      return
    }

    setLoading(false)
    onSaved()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedMeds.size === 0 && !allowEmptySave) {
      setError('Add at least one medicine or supplement to continue.')
      return
    }

    const selections = Array.from(selectedMeds.keys()).map((code) => {
      const d = details[code]
      return {
        code,
        dose_mg: d?.doseValue ? Number(d.doseValue) : undefined,
        current_timing: d?.currentTiming || undefined,
      }
    })

    await save(selections)
  }

  const selectedCodes = new Set(selectedMeds.keys())

  return (
    <form onSubmit={handleSubmit} className="dash-meds__form">
      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="dash-meds-search-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="dash-meds-search-title" className="dash-meds__section-title">
            Add medicines
          </h2>
        </div>
        <MedicationSearchPanel
          phaseOffsetMinutes={phaseOffsetMinutes}
          selectedCodes={selectedCodes}
          onSelect={addMedication}
          placeholder={searchPlaceholder}
        />
      </section>

      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="dash-meds-list-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="dash-meds-list-title" className="dash-meds__section-title">
            {listTitle}
          </h2>
        </div>

        {selectedMeds.size === 0 ? (
          <p className="dash-meds__empty-copy">{emptyListMessage}</p>
        ) : (
          <ul className="dash-meds__list">
            {Array.from(selectedMeds.values()).map((med) => (
              <MedicationCard
                key={med.code}
                medication={med}
                doseValue={details[med.code]?.doseValue ?? ''}
                currentTiming={details[med.code]?.currentTiming ?? defaultTimingFor(med)}
                onDoseChange={(v) =>
                  setDetails((prev) => ({
                    ...prev,
                    [med.code]: { ...prev[med.code], doseValue: v },
                  }))
                }
                onTimingChange={(v) =>
                  setDetails((prev) => ({
                    ...prev,
                    [med.code]: { ...prev[med.code], currentTiming: v },
                  }))
                }
                onRemove={() => removeMedication(med.code)}
              />
            ))}
          </ul>
        )}
      </section>

      {error && <FormError>{error}</FormError>}

      <div className="dash-meds__actions">
        <Button type="submit" disabled={loading} className="dash-meds__submit">
          {loading ? savingLabel : submitLabel}
        </Button>
        {skipLabel && (
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            className="dash-meds__skip"
            onClick={() => void save([])}
          >
            {skipLabel}
          </Button>
        )}
        {secondaryAction}
      </div>
    </form>
  )
}
