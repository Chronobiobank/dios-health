'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  SECTION_LABEL,
  SETTINGS_LEDE,
  SETTINGS_PANEL,
} from '@/components/dashboard/dashboard-styles'
import { MedicationChipPicker } from '@/components/retinomic/medication-chip-picker'
import {
  medicationLabelsFromIds,
  selectedMedicationIdsFromProfile,
} from '@/lib/medication/patient-medications'
import { createClient } from '@/lib/supabase/client'

type PatientMedicationsPanelProps = {
  patientId: string
  initialMedications: string[]
}

export function PatientMedicationsPanel({
  patientId,
  initialMedications,
}: PatientMedicationsPanelProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(selectedMedicationIdsFromProfile(initialMedications))
  )
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const persist = useCallback(
    async (nextIds: Set<string>) => {
      setSaving(true)
      setError(null)
      setSavedMessage(null)

      const labels = medicationLabelsFromIds([...nextIds])
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('patient_profiles')
        .update({ current_medications: labels.length > 0 ? labels : null })
        .eq('id', patientId)

      setSaving(false)

      if (updateError) {
        setError('Could not save your medications. Please try again.')
        return
      }

      setSavedMessage(
        labels.length > 0
          ? `${labels.length} medication${labels.length === 1 ? '' : 's'} saved — dashboard timing updated`
          : 'Medications cleared — dashboard shows examples again'
      )
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
      savedTimeoutRef.current = setTimeout(() => setSavedMessage(null), 3000)
      router.refresh()
    },
    [patientId, router]
  )

  const toggleMedication = useCallback(
    (id: string) => {
      setSelectedIds((current) => {
        const next = new Set(current)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        void persist(next)
        return next
      })
    },
    [persist]
  )

  return (
    <section className={`${SETTINGS_PANEL} dios-glass-outer rounded-2xl p-5 sm:p-6`}>
      <h2 className={SECTION_LABEL}>Your medications</h2>
      <p className={SETTINGS_LEDE}>
        Select what you take today. DIOS replaces example dose windows on your dashboard with
        personal timing anchored to your body clock.
      </p>

      <MedicationChipPicker selectedIds={selectedIds} onToggle={toggleMedication} disabled={saving} />

      {saving ? (
        <p className="calm-auth-muted font-mono text-[10px] uppercase tracking-widest">Saving…</p>
      ) : null}
      {savedMessage ? <p className="text-sm text-teal-800">{savedMessage}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  )
}
