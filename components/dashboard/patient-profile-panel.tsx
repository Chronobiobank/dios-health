'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AuthToggle } from '@/components/auth/auth-toggle'
import {
  SECTION_LABEL,
  SETTINGS_LEDE,
  SETTINGS_SECTION,
  SETTINGS_STACK,
} from '@/components/dashboard/dashboard-styles'
import { LABEL } from '@/components/sections/layout'
import { COUNTRIES } from '@/lib/auth/countries'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import {
  ALERTNESS_OPTIONS,
  FITZPATRICK_TYPES,
  SHIFT_PATTERNS,
  SLEEP_TIME_OPTIONS,
  WAKE_TIME_OPTIONS,
} from '@/lib/auth/patient-signup-data'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export type PatientProfileDemographics = {
  fitzpatrickType: number | null
  locationCity: string
  locationCountry: string
  shiftWorker: boolean
  shiftPattern: string
  chronotypeQ1: string
  chronotypeQ2: string
  chronotypeQ3: string
}

type PatientProfilePanelProps = {
  patientId: string
  initial: PatientProfileDemographics
}

type SavingKey = keyof PatientProfileDemographics | 'shift' | null

const SAVE_LABELS: Record<string, string> = {
  fitzpatrickType: 'Skin type',
  locationCity: 'City',
  locationCountry: 'Country',
  shiftWorker: 'Shift work',
  shiftPattern: 'Shift pattern',
  chronotypeQ1: 'Wake time',
  chronotypeQ2: 'Alertness',
  chronotypeQ3: 'Sleep time',
  shift: 'Shift work',
}

export function PatientProfilePanel({ patientId, initial }: PatientProfilePanelProps) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [savingKey, setSavingKey] = useState<SavingKey>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
      if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current)
    }
  }, [])

  const confirmSave = useCallback((labelKey: string) => {
    const label = SAVE_LABELS[labelKey] ?? 'Change'
    setSavedMessage(`${label} saved`)
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    savedTimeoutRef.current = setTimeout(() => setSavedMessage(null), 2500)
  }, [])

  const persist = useCallback(
    async (
      patch: Partial<Record<string, unknown>>,
      saving: SavingKey,
      confirmKey: string,
      rollback?: () => void
    ) => {
      setSavingKey(saving)
      setError(null)
      setSavedMessage(null)

      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('patient_profiles')
        .update(patch)
        .eq('id', patientId)

      setSavingKey(null)

      if (updateError) {
        rollback?.()
        setError('Could not save your details. Please try again.')
        return
      }

      confirmSave(confirmKey)
      router.refresh()
    },
    [confirmSave, patientId, router]
  )

  const saveFitzpatrick = useCallback(
    (fitzpatrickType: number) => {
      const previous = values.fitzpatrickType
      setValues((current) => ({ ...current, fitzpatrickType }))
      void persist({ fitzpatrick_type: fitzpatrickType }, 'fitzpatrickType', 'fitzpatrickType', () =>
        setValues((current) => ({ ...current, fitzpatrickType: previous }))
      )
    },
    [persist, values.fitzpatrickType]
  )

  const saveCountry = useCallback(
    (locationCountry: string) => {
      const previous = values.locationCountry
      setValues((current) => ({ ...current, locationCountry }))
      void persist({ location_country: locationCountry }, 'locationCountry', 'locationCountry', () =>
        setValues((current) => ({ ...current, locationCountry: previous }))
      )
    },
    [persist, values.locationCountry]
  )

  const saveCity = useCallback(
    (locationCity: string) => {
      setValues((current) => ({ ...current, locationCity }))
      if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current)

      cityDebounceRef.current = setTimeout(() => {
        const trimmed = locationCity.trim()
        if (!trimmed) return

        void persist({ location_city: trimmed }, 'locationCity', 'locationCity')
      }, 450)
    },
    [persist]
  )

  const saveShiftWorker = useCallback(
    (shiftWorker: boolean) => {
      const previous = { shiftWorker: values.shiftWorker, shiftPattern: values.shiftPattern }
      setValues((current) => ({
        ...current,
        shiftWorker,
        shiftPattern: shiftWorker ? current.shiftPattern : '',
      }))

      void persist(
        {
          shift_worker: shiftWorker,
          shift_pattern: shiftWorker ? values.shiftPattern || null : null,
        },
        'shift',
        'shiftWorker',
        () =>
          setValues((current) => ({
            ...current,
            shiftWorker: previous.shiftWorker,
            shiftPattern: previous.shiftPattern,
          }))
      )
    },
    [persist, values.shiftPattern, values.shiftWorker]
  )

  const saveShiftPattern = useCallback(
    (shiftPattern: string) => {
      const previous = values.shiftPattern
      setValues((current) => ({ ...current, shiftPattern }))
      void persist({ shift_pattern: shiftPattern }, 'shiftPattern', 'shiftPattern', () =>
        setValues((current) => ({ ...current, shiftPattern: previous }))
      )
    },
    [persist, values.shiftPattern]
  )

  const saveChronotypeQ1 = useCallback(
    (chronotypeQ1: string) => {
      const previous = values.chronotypeQ1
      setValues((current) => ({ ...current, chronotypeQ1 }))
      void persist({ chronotype_q1: chronotypeQ1 }, 'chronotypeQ1', 'chronotypeQ1', () =>
        setValues((current) => ({ ...current, chronotypeQ1: previous }))
      )
    },
    [persist, values.chronotypeQ1]
  )

  const saveChronotypeQ2 = useCallback(
    (chronotypeQ2: string) => {
      const previous = values.chronotypeQ2
      setValues((current) => ({ ...current, chronotypeQ2 }))
      void persist({ chronotype_q2: chronotypeQ2 }, 'chronotypeQ2', 'chronotypeQ2', () =>
        setValues((current) => ({ ...current, chronotypeQ2: previous }))
      )
    },
    [persist, values.chronotypeQ2]
  )

  const saveChronotypeQ3 = useCallback(
    (chronotypeQ3: string) => {
      const previous = values.chronotypeQ3
      setValues((current) => ({ ...current, chronotypeQ3 }))
      void persist({ chronotype_q3: chronotypeQ3 }, 'chronotypeQ3', 'chronotypeQ3', () =>
        setValues((current) => ({ ...current, chronotypeQ3: previous }))
      )
    },
    [persist, values.chronotypeQ3]
  )

  return (
    <div className={SETTINGS_STACK}>
      <section className={SETTINGS_SECTION}>
        <h2 className={SECTION_LABEL}>Skin & location</h2>
        <p className={SETTINGS_LEDE}>
          Used to personalise light and timing recommendations for your skin type and latitude.
        </p>

        <div>
          <p className={`${LABEL} mb-3`}>
            What best describes your skin tone in winter, away from sun exposure?
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FITZPATRICK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                disabled={savingKey === 'fitzpatrickType'}
                onClick={() => saveFitzpatrick(type.value)}
                className={cn(
                  'dios-glass-inner rounded-xl p-3 text-left transition-colors disabled:opacity-60',
                  values.fitzpatrickType === type.value && 'border-black ring-1 ring-black'
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
        </div>

        <div>
          <label htmlFor="profile_location_city" className={`${LABEL} mb-2 block`}>
            City
          </label>
          <input
            id="profile_location_city"
            type="text"
            placeholder="e.g. London, Auckland, Toronto"
            value={values.locationCity}
            disabled={savingKey === 'locationCity'}
            onChange={(event) => saveCity(event.target.value)}
            className={AUTH_INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="profile_location_country" className={`${LABEL} mb-2 block`}>
            Country
          </label>
          <select
            id="profile_location_country"
            value={values.locationCountry}
            disabled={savingKey === 'locationCountry'}
            onChange={(event) => saveCountry(event.target.value)}
            className={AUTH_INPUT_CLASS}
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SECTION_LABEL}>Shift work</h2>
        <p className={SETTINGS_LEDE}>Helps DIOS adjust timing when your schedule is irregular.</p>

        <div>
          <AuthToggle
            label="I work shifts"
            description="Night, rotating, or early-morning patterns"
            checked={values.shiftWorker}
            onChange={(checked) => void saveShiftWorker(checked)}
            disabled={savingKey === 'shift'}
          />
        </div>

        {values.shiftWorker ? (
          <div>
            <p className={`${LABEL} mb-3`}>Shift pattern</p>
            <div className="flex flex-wrap gap-2">
              {SHIFT_PATTERNS.map((pattern) => (
                <button
                  key={pattern}
                  type="button"
                  disabled={savingKey === 'shiftPattern'}
                  onClick={() => saveShiftPattern(pattern)}
                  className={cn(
                    'rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60',
                    values.shiftPattern === pattern && 'border-black bg-black text-white'
                  )}
                >
                  {pattern}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SECTION_LABEL}>Body clock</h2>
        <p className={SETTINGS_LEDE}>
          Your answers shape the body clock estimate on your dashboard until TipTraQ data is available.
        </p>

        <div>
          <label htmlFor="profile_chronotype_q1" className={`${LABEL} mb-2 block`}>
            Without an alarm, what time would you naturally wake up?
          </label>
          <select
            id="profile_chronotype_q1"
            value={values.chronotypeQ1}
            disabled={savingKey === 'chronotypeQ1'}
            onChange={(event) => saveChronotypeQ1(event.target.value)}
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

        <div className="mt-6">
          <p className={`${LABEL} mb-3`}>When do you feel most alert and focused?</p>
          <div className="space-y-2">
            {ALERTNESS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={savingKey === 'chronotypeQ2'}
                onClick={() => saveChronotypeQ2(option.label)}
                className={cn(
                  'dios-glass-inner w-full rounded-full px-4 py-3 text-left text-sm font-medium transition-colors disabled:opacity-60',
                  values.chronotypeQ2 === option.label && 'border-black bg-black text-white'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="profile_chronotype_q3" className={`${LABEL} mb-2 block`}>
            What time do you prefer to fall asleep?
          </label>
          <select
            id="profile_chronotype_q3"
            value={values.chronotypeQ3}
            disabled={savingKey === 'chronotypeQ3'}
            onChange={(event) => saveChronotypeQ3(event.target.value)}
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
      </section>

      <p role="status" aria-live="polite" className="min-h-5 text-center text-sm text-black/70">
        {savedMessage}
      </p>

      {error ? (
        <p role="alert" className="text-center text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
