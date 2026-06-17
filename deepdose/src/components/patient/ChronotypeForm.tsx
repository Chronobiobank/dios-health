'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Input'
import {
  checkboxClass,
  FieldHint,
  FormError,
  FormSection,
  NumberInput,
  TimeInput,
} from '@/components/ui/Form'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'

const CHRONOTYPE_LABELS: Record<string, string> = {
  extreme_early: 'Extreme early type',
  early: 'Early type',
  intermediate: 'Intermediate type',
  late: 'Late type',
  extreme_late: 'Extreme late type',
}

export default function ChronotypeForm() {
  const router = useRouter()
  const [workSleepOnset, setWorkSleepOnset] = useState('23:00')
  const [workSleepEnd, setWorkSleepEnd] = useState('07:00')
  const [workAlarmUsed, setWorkAlarmUsed] = useState(true)
  const [freeSleepOnset, setFreeSleepOnset] = useState('00:00')
  const [freeSleepEnd, setFreeSleepEnd] = useState('09:00')
  const [workdaysPerWeek, setWorkdaysPerWeek] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/circadian/mctq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workSleepOnset,
        workSleepEnd,
        workAlarmUsed,
        freeSleepOnset,
        freeSleepEnd,
        workdaysPerWeek,
      }),
    })

    const body = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(body.error ?? 'Failed to save chronotype')
      setLoading(false)
      return
    }

    router.push('/patient/onboarding/medications')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <OnboardingHeader
        step={2}
        title="Your sleep rhythm"
        description="Answer a few questions about your typical sleep schedule. We use the Munich Chronotype Questionnaire (MCTQ) to estimate your circadian phase."
      />

      <FormSection title="Work days">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="work-sleep-onset">When do you usually go to sleep?</Label>
            <TimeInput
              id="work-sleep-onset"
              required
              value={workSleepOnset}
              onChange={(e) => setWorkSleepOnset(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="work-sleep-end">When do you usually wake up?</Label>
            <TimeInput
              id="work-sleep-end"
              required
              value={workSleepEnd}
              onChange={(e) => setWorkSleepEnd(e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={workAlarmUsed}
            onChange={(e) => setWorkAlarmUsed(e.target.checked)}
            className={checkboxClass}
          />
          I use an alarm on work days
        </label>

        <div className="space-y-1.5">
          <Label htmlFor="workdays">Work days per week</Label>
          <NumberInput
            id="workdays"
            min={0}
            max={7}
            required
            value={workdaysPerWeek}
            onChange={(e) => setWorkdaysPerWeek(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </FormSection>

      <FormSection title="Free days (no alarm)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="free-sleep-onset">Sleep onset</Label>
            <TimeInput
              id="free-sleep-onset"
              required
              value={freeSleepOnset}
              onChange={(e) => setFreeSleepOnset(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="free-sleep-end">Wake time</Label>
            <TimeInput
              id="free-sleep-end"
              required
              value={freeSleepEnd}
              onChange={(e) => setFreeSleepEnd(e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FieldHint>
        Your chronotype ({Object.values(CHRONOTYPE_LABELS).join(', ').toLowerCase()}) helps
        us personalise medication timing windows.
      </FieldHint>

      {error && <FormError>{error}</FormError>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Calculating…' : 'Save and continue'}
      </Button>
    </form>
  )
}
