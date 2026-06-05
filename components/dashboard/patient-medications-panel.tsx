'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { MEDICATION_TIMING_CATALOG } from '@/lib/medication/timing-catalog'
import {
  medicationLabelsFromIds,
  selectedMedicationIdsFromProfile,
} from '@/lib/medication/patient-medications'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

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
    <section className="dios-glass-outer rounded-2xl p-5 sm:p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
        Your medications
      </h2>
      <p className="mt-2 text-sm text-black/55">
        Select what you take today. DIOS replaces example dose windows on your dashboard with
        personal timing anchored to your body clock.
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {MEDICATION_TIMING_CATALOG.map((medication) => {
          const active = selectedIds.has(medication.id)
          return (
            <li key={medication.id}>
              <button
                type="button"
                disabled={saving}
                onClick={() => toggleMedication(medication.id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-left text-sm transition-colors',
                  active
                    ? 'border-[rgb(201,151,58)]/45 bg-[rgb(201,151,58)]/12 text-black'
                    : 'border-black/12 bg-white/50 text-black/70 hover:border-black/25 hover:text-black'
                )}
                aria-pressed={active}
              >
                <span className="font-medium">{medication.name}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-black/45">
                  {medication.standardGuidance.replace('Standard: ', '')}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {saving ? (
        <p className="calm-auth-muted mt-3 font-mono text-[10px] uppercase tracking-widest">Saving…</p>
      ) : null}
      {savedMessage ? <p className="mt-3 text-sm text-teal-800">{savedMessage}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </section>
  )
}
