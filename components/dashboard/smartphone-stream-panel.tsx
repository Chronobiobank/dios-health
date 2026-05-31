'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { DASHBOARD_BODY, DASHBOARD_CARD, MONO_DATA, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'

type SmartphoneStreamPanelProps = {
  fitzpatrickType: number | null
  isActive: boolean
  lastRecordedAt: string | null
  layer1Confidence: number | null
}

function formatRecordedDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function SmartphoneStreamPanel({
  fitzpatrickType,
  isActive,
  lastRecordedAt,
  layer1Confidence,
}: SmartphoneStreamPanelProps) {
  const router = useRouter()
  const [sleepOnset, setSleepOnset] = useState('23:00')
  const [outdoorLight, setOutdoorLight] = useState<'yes' | 'no' | ''>('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!outdoorLight) {
      setError('Please say whether you got outdoor light before 10am.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/smartphone/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sleep_onset_local: sleepOnset,
          outdoor_light_before_10am: outdoorLight === 'yes',
          sleep_onset_estimated: true,
          fitzpatrick_type: fitzpatrickType,
        }),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(result.error ?? 'Could not save your reading. Please try again.')
        return
      }

      setSuccess(true)
      setShowForm(false)
      router.refresh()
    } catch {
      setError('Could not save your reading. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-10">
      <h2 className={SECTION_LABEL}>Smartphone · Layer 1</h2>

      <div className={`${DASHBOARD_CARD} mt-4`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={`${DASHBOARD_BODY} font-medium text-black`}>Free body clock estimate</p>
            <p className={`${MONO_DATA} mt-2`}>
              Status: {isActive ? 'Active' : 'Not active'}
            </p>
            <p className={`${MONO_DATA} mt-1`}>Last recorded: {formatRecordedDate(lastRecordedAt)}</p>
            <p className={`${MONO_DATA} mt-1`}>
              Layer 1 confidence:{' '}
              {layer1Confidence != null ? `${layer1Confidence}%` : '—'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="font-mono text-[11px] text-black/45 transition-colors hover:text-black"
          >
            {showForm ? 'Hide form' : 'Log last night →'}
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className={`${CARD} mt-5 space-y-4 rounded-2xl p-5`}>
            <div>
              <label htmlFor="sleep_onset_local" className={`${LABEL} mb-2 block`}>
                Approximate sleep time last night
              </label>
              <input
                id="sleep_onset_local"
                name="sleep_onset_local"
                type="time"
                required
                value={sleepOnset}
                onChange={(event) => setSleepOnset(event.target.value)}
                className={AUTH_INPUT_CLASS}
                disabled={loading}
              />
            </div>

            <fieldset>
              <legend className={`${LABEL} mb-3 block`}>Did you get outdoor light before 10am?</legend>
              <div className="flex gap-3">
                {(['yes', 'no'] as const).map((option) => (
                  <label
                    key={option}
                    className={`${AUTH_INPUT_CLASS} flex flex-1 cursor-pointer items-center justify-center gap-2 py-2.5 ${
                      outdoorLight === option ? 'border-black ring-1 ring-black/10' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="outdoor_light_before_10am"
                      value={option}
                      checked={outdoorLight === option}
                      onChange={() => setOutdoorLight(option)}
                      disabled={loading}
                      className="sr-only"
                    />
                    <span className="text-sm capitalize text-black">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={`${BTN_PRIMARY} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6`}
            >
              {loading ? 'Saving…' : 'Save Layer 1 reading →'}
            </button>
          </form>
        ) : null}

        {success ? (
          <p className={`${DASHBOARD_BODY} mt-4 text-black/70`} role="status">
            Layer 1 reading saved. Your body clock estimate has been updated.
          </p>
        ) : null}
      </div>
    </section>
  )
}
