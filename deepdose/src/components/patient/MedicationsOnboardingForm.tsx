'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MedicationRecommendation } from '@/lib/medications/recommendations'
import type { PatientCircadianContext } from '@/lib/medications/patient-phase'
import MedicationCard from '@/components/patient/MedicationCard'
import { Button } from '@/components/ui/Button'
import { Callout, FormError } from '@/components/ui/Form'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'

interface MedicationsOnboardingFormProps {
  medications: MedicationRecommendation[]
  context: PatientCircadianContext
}

type SelectionState = Record<string, { doseMg: string; currentTiming: string }>

function initialSelections(meds: MedicationRecommendation[]): SelectionState {
  return Object.fromEntries(
    meds.map((m) => [m.code, { doseMg: '', currentTiming: m.recommendedStart }])
  )
}

const CHRONOTYPE_LABELS: Record<string, string> = {
  extreme_early: 'Extreme early',
  early: 'Early',
  intermediate: 'Intermediate',
  late: 'Late',
  extreme_late: 'Extreme late',
}

export default function MedicationsOnboardingForm({
  medications,
  context,
}: MedicationsOnboardingFormProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [details, setDetails] = useState<SelectionState>(() => initialSelections(medications))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(code: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
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

    router.push('/patient/dashboard')
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selected.size === 0) {
      setError('Select at least one medication, or use "Skip for now" below.')
      return
    }

    const selections = Array.from(selected).map((code) => {
      const d = details[code]
      return {
        code,
        dose_mg: d.doseMg ? Number(d.doseMg) : undefined,
        current_timing: d.currentTiming || undefined,
      }
    })

    await save(selections)
  }

  async function handleSkip() {
    await save([])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <OnboardingHeader
        step={3}
        title="Your medications"
        description="Select the medications you take. We'll show chronotherapy windows personalised to your circadian profile."
      />

      {context.chronotypeCat && (
        <Callout tone="info">
          <span className="font-medium">
            {CHRONOTYPE_LABELS[context.chronotypeCat] ?? context.chronotypeCat} chronotype
          </span>
          {' · '}
          Circadian score: {context.circadianScore}/100
        </Callout>
      )}

      <ul className="space-y-3">
        {medications.map((med) => (
          <MedicationCard
            key={med.code}
            medication={med}
            selected={selected.has(med.code)}
            doseMg={details[med.code]?.doseMg ?? ''}
            currentTiming={details[med.code]?.currentTiming ?? med.recommendedStart}
            onToggle={() => toggle(med.code)}
            onDoseChange={(v) =>
              setDetails((prev) => ({ ...prev, [med.code]: { ...prev[med.code], doseMg: v } }))
            }
            onTimingChange={(v) =>
              setDetails((prev) => ({
                ...prev,
                [med.code]: { ...prev[med.code], currentTiming: v },
              }))
            }
          />
        ))}
      </ul>

      {error && <FormError>{error}</FormError>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving…' : 'Save and finish'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={handleSkip}
          className="flex-1 sm:flex-none"
        >
          Skip for now
        </Button>
      </div>
    </form>
  )
}
