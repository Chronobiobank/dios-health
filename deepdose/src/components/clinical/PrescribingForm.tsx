'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCatalogEntry, getMedicationDisplayName, isOptimisedCode } from '@/lib/medications/catalog'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'
import { TimeInput } from '@/components/ui/Form'

interface MedicationOption {
  medication_code: string
  current_timing: string | null
}

export function PrescribingForm({
  patientId,
  medications,
}: {
  patientId: string
  medications: MedicationOption[]
}) {
  const router = useRouter()
  const [medicationCode, setMedicationCode] = useState(medications[0]?.medication_code ?? '')
  const [recommendedTiming, setRecommendedTiming] = useState('20:00')
  const [rationale, setRationale] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!medications.length) {
    return (
      <p className="text-sm text-ink-muted">No active medications to prescribe timing changes for.</p>
    )
  }

  const selected = medications.find((m) => m.medication_code === medicationCode)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const res = await fetch('/api/clinical/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: patientId,
        medication_code: medicationCode,
        recommended_timing: recommendedTiming,
        current_timing: selected?.current_timing?.slice(0, 5),
        rationale: rationale.trim() || undefined,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Could not send recommendation.')
      return
    }

    setSuccess(`Recommendation sent for ${data.medication}.`)
    setRationale('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-ink-muted">
        Medication
        <select
          className="dios-input mt-1.5 w-full"
          value={medicationCode}
          onChange={(e) => {
            setMedicationCode(e.target.value)
            const med = medications.find((m) => m.medication_code === e.target.value)
            if (med && isOptimisedCode(med.medication_code)) {
              const entry = getCatalogEntry(med.medication_code)
              if (entry?.timing) {
                setRecommendedTiming(entry.timing.populationWindowStart)
              }
            }
          }}
        >
          {medications.map((m) => (
            <option key={m.medication_code} value={m.medication_code}>
              {getMedicationDisplayName(m.medication_code)}
              {m.current_timing ? ` (current ${m.current_timing.slice(0, 5)})` : ''}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-ink-muted">
        Recommended time
        <TimeInput
          className="mt-1.5 w-full"
          value={recommendedTiming}
          onChange={(e) => setRecommendedTiming(e.target.value)}
          required
        />
      </label>

      <label className="block text-sm text-ink-muted">
        Rationale (optional)
        <textarea
          className="dios-input mt-1.5 min-h-[80px] w-full"
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="Evening dosing aligns with nocturnal cholesterol synthesis peak."
        />
      </label>

      {error && <FormError>{error}</FormError>}
      {success && <p className="text-sm text-success">{success}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Propose timing change'}
      </Button>
    </form>
  )
}
