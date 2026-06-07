'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { AuthToggle } from '@/components/auth/auth-toggle'
import { SignupProgress } from '@/components/auth/signup-progress'
import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { COUNTRIES } from '@/lib/auth/countries'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import type { BiologicalSex } from '@/lib/auth/patient-signup-types'
import {
  ALERTNESS_OPTIONS,
  BIOLOGICAL_SEX_OPTIONS,
  FITZPATRICK_TYPES,
  SHIFT_PATTERNS,
  SLEEP_TIME_OPTIONS,
  WAKE_TIME_OPTIONS,
} from '@/lib/auth/patient-signup-data'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import {
  maxDateOfBirthInputValue,
  minDateOfBirthInputValue,
  validatePatientDateOfBirth,
} from '@/lib/patient-dashboard/date-of-birth'
import { cn } from '@/lib/utils'

const TOTAL_STEPS = 5

export function PatientChronoprofileWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dateOfBirth, setDateOfBirth] = useState('')
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex | ''>('')
  const [fitzpatrickType, setFitzpatrickType] = useState<number | null>(null)
  const [locationCity, setLocationCity] = useState('')
  const [locationCountry, setLocationCountry] = useState('New Zealand')
  const [shiftWorker, setShiftWorker] = useState(false)
  const [shiftPattern, setShiftPattern] = useState('')
  const [chronotypeQ1, setChronotypeQ1] = useState('')
  const [chronotypeQ2, setChronotypeQ2] = useState('')
  const [chronotypeQ3, setChronotypeQ3] = useState('')

  function goNext() {
    setError(null)
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  function goBack() {
    setError(null)
    setStep((s) => Math.max(1, s - 1))
  }

  function validateStep(): string | null {
    if (step === 1) {
      const dobCheck = validatePatientDateOfBirth(dateOfBirth)
      if (!dobCheck.ok) return dobCheck.message
      if (!biologicalSex) return 'Select biological sex.'
    }
    if (step === 2 && fitzpatrickType == null) return 'Select your skin type.'
    if (step === 3) {
      if (!locationCity.trim()) return 'Enter your city.'
      if (!locationCountry.trim()) return 'Select your country.'
    }
    if (step === 5) {
      if (!chronotypeQ1) return 'Select your natural wake time.'
      if (!chronotypeQ2) return 'Select when you feel most alert.'
      if (!chronotypeQ3) return 'Select your preferred sleep time.'
    }
    return null
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }

    if (step < TOTAL_STEPS) {
      goNext()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/signup/patient/chronoprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateOfBirth: dateOfBirth.trim(),
          biologicalSex,
          fitzpatrickType,
          locationCity: locationCity.trim(),
          locationCountry: locationCountry.trim(),
          shiftWorker,
          shiftPattern: shiftWorker ? shiftPattern : '',
          chronotypeQ1,
          chronotypeQ2,
          chronotypeQ3,
        }),
      })

      const json = (await res.json()) as { error?: string; next?: string }

      if (!res.ok) {
        setError(json.error ?? 'Could not save your chronoprofile.')
        return
      }

      router.push(json.next ?? PATIENT_ROUTES.dashboard)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <SignupProgress step={step} total={TOTAL_STEPS} />

      <form onSubmit={handleContinue} className="mt-6 flex flex-col gap-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-black/40">
            Step {step} of {TOTAL_STEPS}
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-black">
            {step === 1 && 'About you'}
            {step === 2 && 'Skin type'}
            {step === 3 && 'Where you live'}
            {step === 4 && 'Shift work'}
            {step === 5 && 'Your body clock'}
          </h1>
          <p className="mt-2 text-sm text-black/60">
            {step === 1 &&
              'Your date of birth sets your chronological age on the dashboard.'}
            {step === 2 && 'Personalises light and melanopic lux for your skin.'}
            {step === 3 && 'Season and solar timing depend on your latitude.'}
            {step === 4 && 'Optional — only if your schedule is irregular.'}
            {step === 5 && 'Shapes your provisional chronoprofile until your first TipTraQ three-night block or monthly MLux proxy.'}
          </p>
        </div>

        {step === 1 ? (
          <>
            <div>
              <label htmlFor="dateOfBirth" className={`${LABEL} mb-2 block`}>
                Date of birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                min={minDateOfBirthInputValue()}
                max={maxDateOfBirthInputValue()}
                className={AUTH_INPUT_CLASS}
                required
                autoComplete="bday"
              />
              <p className="mt-1.5 text-xs text-black/50">
                Shown as chronological age (years on your birth certificate).
              </p>
            </div>
            <div>
              <p className={`${LABEL} mb-3`}>Biological sex</p>
              <div className="space-y-2">
                {BIOLOGICAL_SEX_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setBiologicalSex(option.value)}
                    className={cn(
                      `${CARD} w-full rounded-full px-4 py-3 text-left text-sm font-medium transition-colors`,
                      biologicalSex === option.value && 'border-black bg-black text-white'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FITZPATRICK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFitzpatrickType(type.value)}
                className={cn(
                  `${CARD} rounded-xl p-3 text-left transition-colors`,
                  fitzpatrickType === type.value && 'border-black ring-1 ring-black'
                )}
              >
                <span
                  className="mb-2 block h-10 w-full rounded-lg border border-black/10"
                  style={{ backgroundColor: type.color }}
                />
                <span className="font-mono text-[11px] text-black/50">{type.value}</span>
                <span className="mt-1 block text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        ) : null}

        {step === 3 ? (
          <>
            <div>
              <label htmlFor="city" className={`${LABEL} mb-2 block`}>
                City
              </label>
              <input
                id="city"
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="e.g. Auckland"
                className={AUTH_INPUT_CLASS}
                required
              />
            </div>
            <div>
              <label htmlFor="country" className={`${LABEL} mb-2 block`}>
                Country
              </label>
              <select
                id="country"
                value={locationCountry}
                onChange={(e) => setLocationCountry(e.target.value)}
                className={AUTH_INPUT_CLASS}
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <AuthToggle
              label="I work shifts"
              description="Night, rotating, or early-morning patterns"
              checked={shiftWorker}
              onChange={setShiftWorker}
            />
            {shiftWorker ? (
              <div className="flex flex-wrap gap-2">
                {SHIFT_PATTERNS.map((pattern) => (
                  <button
                    key={pattern}
                    type="button"
                    onClick={() => setShiftPattern(pattern)}
                    className={cn(
                      'rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors',
                      shiftPattern === pattern && 'border-black bg-black text-white'
                    )}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        {step === 5 ? (
          <>
            <div>
              <label htmlFor="wake" className={`${LABEL} mb-2 block`}>
                Without an alarm, what time would you naturally wake?
              </label>
              <select
                id="wake"
                value={chronotypeQ1}
                onChange={(e) => setChronotypeQ1(e.target.value)}
                className={AUTH_INPUT_CLASS}
              >
                <option value="">Select a time</option>
                {WAKE_TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className={`${LABEL} mb-3`}>When do you feel most alert?</p>
              <div className="space-y-2">
                {ALERTNESS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setChronotypeQ2(option.label)}
                    className={cn(
                      `${CARD} w-full rounded-full px-4 py-3 text-left text-sm font-medium transition-colors`,
                      chronotypeQ2 === option.label && 'border-black bg-black text-white'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="sleep" className={`${LABEL} mb-2 block`}>
                What time do you prefer to fall asleep?
              </label>
              <select
                id="sleep"
                value={chronotypeQ3}
                onChange={(e) => setChronotypeQ3(e.target.value)}
                className={AUTH_INPUT_CLASS}
              >
                <option value="">Select a time</option>
                {SLEEP_TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className={BTN_PRIMARY} disabled={loading}>
          {loading ? 'Saving…' : step === TOTAL_STEPS ? 'Open my dashboard →' : 'Continue →'}
        </button>

        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="text-center text-sm text-black/50 hover:text-black"
          >
            ← Back
          </button>
        ) : null}
      </form>
    </AuthShell>
  )
}
