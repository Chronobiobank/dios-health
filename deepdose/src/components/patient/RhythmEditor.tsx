'use client'

import { useState } from 'react'
import type { MCTQInput } from '@/lib/circadian/mctq'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Input'
import { checkboxClass, FormError, NumberInput, TimeInput } from '@/components/ui/Form'

const DEFAULT_VALUES: MCTQInput = {
  workSleepOnset: '23:00',
  workSleepEnd: '07:00',
  workAlarmUsed: true,
  freeSleepOnset: '00:00',
  freeSleepEnd: '09:00',
  workdaysPerWeek: 5,
}

export type RhythmEditorProps = {
  initialValues?: Partial<MCTQInput>
  submitLabel?: string
  savingLabel?: string
  skipLabel?: string
  onSaved: () => void
  onSkip?: () => void
  secondaryAction?: React.ReactNode
}

export function RhythmEditor({
  initialValues,
  submitLabel = 'Update dose dash',
  savingLabel = 'Updating dash…',
  skipLabel,
  onSaved,
  onSkip,
  secondaryAction,
}: RhythmEditorProps) {
  const [workSleepOnset, setWorkSleepOnset] = useState(
    initialValues?.workSleepOnset ?? DEFAULT_VALUES.workSleepOnset
  )
  const [workSleepEnd, setWorkSleepEnd] = useState(
    initialValues?.workSleepEnd ?? DEFAULT_VALUES.workSleepEnd
  )
  const [workAlarmUsed, setWorkAlarmUsed] = useState(
    initialValues?.workAlarmUsed ?? DEFAULT_VALUES.workAlarmUsed
  )
  const [freeSleepOnset, setFreeSleepOnset] = useState(
    initialValues?.freeSleepOnset ?? DEFAULT_VALUES.freeSleepOnset
  )
  const [freeSleepEnd, setFreeSleepEnd] = useState(
    initialValues?.freeSleepEnd ?? DEFAULT_VALUES.freeSleepEnd
  )
  const [workdaysPerWeek, setWorkdaysPerWeek] = useState(
    initialValues?.workdaysPerWeek ?? DEFAULT_VALUES.workdaysPerWeek
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
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
      setError(body.error ?? 'Failed to save rhythm')
      setLoading(false)
      return
    }

    setLoading(false)
    onSaved()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await save()
  }

  return (
    <form onSubmit={handleSubmit} className="dash-meds__form">
      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="rhythm-work-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="rhythm-work-title" className="dash-meds__section-title">
            Work days
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="work-sleep-onset">Sleep onset</Label>
            <TimeInput
              id="work-sleep-onset"
              required
              value={workSleepOnset}
              onChange={(e) => setWorkSleepOnset(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="work-sleep-end">Wake time</Label>
            <TimeInput
              id="work-sleep-end"
              required
              value={workSleepEnd}
              onChange={(e) => setWorkSleepEnd(e.target.value)}
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2.5 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={workAlarmUsed}
            onChange={(e) => setWorkAlarmUsed(e.target.checked)}
            className={checkboxClass}
          />
          Alarm on work days
        </label>

        <div className="mt-4 space-y-1.5">
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
      </section>

      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="rhythm-free-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="rhythm-free-title" className="dash-meds__section-title">
            Free days
          </h2>
        </div>

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
      </section>

      {error && <FormError>{error}</FormError>}

      <div className="dash-meds__actions">
        <Button type="submit" disabled={loading} className="dash-meds__submit">
          {loading ? savingLabel : submitLabel}
        </Button>
        {skipLabel && onSkip && (
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            className="dash-meds__skip"
            onClick={onSkip}
          >
            {skipLabel}
          </Button>
        )}
        {secondaryAction}
      </div>
    </form>
  )
}
