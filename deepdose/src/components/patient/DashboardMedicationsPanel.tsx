'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PatientMedicationsEditor } from '@/components/patient/PatientMedicationsEditor'
import { patientMedRowsToEditorState, type PatientMedicationRow } from '@/lib/medications/patient-meds'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

type DashboardMedicationsPanelProps = {
  phaseOffsetMinutes: number
}

export function DashboardMedicationsPanel({ phaseOffsetMinutes }: DashboardMedicationsPanelProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialSelected, setInitialSelected] = useState<
    Map<string, PatientMedicationRow['recommendation']> | undefined
  >()
  const [initialDetails, setInitialDetails] = useState<
    Record<string, { doseValue: string; currentTiming: string }> | undefined
  >()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/patient/medications?scope=active')
      const body = await res.json().catch(() => ({}))

      if (cancelled) return

      if (!res.ok) {
        setError(body.error ?? 'Could not load your medicines')
        setLoading(false)
        return
      }

      const rows = (body.medications ?? []) as PatientMedicationRow[]
      const { selected, details } = patientMedRowsToEditorState(rows)
      setInitialSelected(selected)
      setInitialDetails(details)
      setLoading(false)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <p className="dash-meds__loading seco-page__lede">Loading your medicines…</p>
  }

  if (error) {
    return <FormError>{error}</FormError>
  }

  return (
    <PatientMedicationsEditor
      key={`${initialSelected?.size ?? 0}-${[...(initialSelected?.keys() ?? [])].join(',')}`}
      phaseOffsetMinutes={phaseOffsetMinutes}
      initialSelected={initialSelected}
      initialDetails={initialDetails}
      submitLabel="Save & update dose dash"
      savingLabel="Updating dash…"
      allowEmptySave
      onSaved={() => {
        router.push('/patient/dashboard')
        router.refresh()
      }}
      secondaryAction={
        <Button href="/patient/dashboard" variant="secondary" className="dash-meds__cancel">
          Back to dash
        </Button>
      }
    />
  )
}
