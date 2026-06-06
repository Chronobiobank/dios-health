'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { SECTION_LABEL, SETTINGS_LEDE, SETTINGS_SECTION } from '@/components/dashboard/dashboard-styles'
import { LABEL } from '@/components/sections/layout'
import { BIOLOGICAL_SEX_OPTIONS } from '@/lib/auth/patient-signup-data'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { validatePatientDateOfBirth } from '@/lib/patient-dashboard/date-of-birth'
import { createClient } from '@/lib/supabase/client'

export type PatientIdentityValues = {
  firstName: string
  familyName: string
  dateOfBirth: string
  biologicalSex: string
}

type PatientIdentityPanelProps = {
  patientId: string
  initial: PatientIdentityValues
}

type SavingKey = keyof PatientIdentityValues | null

export function PatientIdentityPanel({ patientId, initial }: PatientIdentityPanelProps) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [savingKey, setSavingKey] = useState<SavingKey>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const nameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const confirmSave = useCallback((label: string) => {
    setSavedMessage(`${label} saved`)
    setTimeout(() => setSavedMessage(null), 2500)
  }, [])

  const syncFullName = useCallback(
    async (firstName: string, familyName: string) => {
      const supabase = createClient()
      const fullName = [firstName.trim(), familyName.trim()].filter(Boolean).join(' ')
      if (!fullName) return

      await supabase.from('profiles').update({ full_name: fullName }).eq('id', patientId)
    },
    [patientId]
  )

  const persist = useCallback(
    async (
      patch: Record<string, unknown>,
      saving: SavingKey,
      label: string,
      rollback?: () => void,
      afterSave?: () => Promise<void>
    ) => {
      setSavingKey(saving)
      setError(null)
      setSavedMessage(null)

      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('patient_profiles')
        .update(patch)
        .eq('id', patientId)

      if (updateError) {
        setSavingKey(null)
        rollback?.()
        setError('Could not save your details. Please try again.')
        return
      }

      if (afterSave) {
        await afterSave()
      }

      setSavingKey(null)
      confirmSave(label)
      router.refresh()
    },
    [confirmSave, patientId, router]
  )

  const saveNames = useCallback(
    (firstName: string, familyName: string) => {
      setValues((current) => ({ ...current, firstName, familyName }))
      if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current)

      nameDebounceRef.current = setTimeout(() => {
        const trimmedFirst = firstName.trim()
        if (!trimmedFirst) return

        const trimmedFamily = familyName.trim()
        const previous = { firstName: values.firstName, familyName: values.familyName }

        void persist(
          {
            first_name: trimmedFirst,
            family_name: trimmedFamily || null,
          },
          'firstName',
          'Name',
          () => setValues((current) => ({ ...current, ...previous })),
          () => syncFullName(trimmedFirst, trimmedFamily)
        )
      }, 450)
    },
    [persist, syncFullName, values.familyName, values.firstName]
  )

  const saveDateOfBirth = useCallback(
    (dateOfBirth: string) => {
      const previous = values.dateOfBirth
      setValues((current) => ({ ...current, dateOfBirth }))

      const check = validatePatientDateOfBirth(dateOfBirth)
      if (!check.ok) {
        setError(check.message)
        setValues((current) => ({ ...current, dateOfBirth: previous }))
        return
      }

      void persist(
        { date_of_birth: dateOfBirth, age: check.age },
        'dateOfBirth',
        'Date of birth',
        () => setValues((current) => ({ ...current, dateOfBirth: previous }))
      )
    },
    [persist, values.dateOfBirth]
  )

  const saveBiologicalSex = useCallback(
    (biologicalSex: string) => {
      const previous = values.biologicalSex
      setValues((current) => ({ ...current, biologicalSex }))
      void persist(
        { biological_sex: biologicalSex },
        'biologicalSex',
        'Biological sex',
        () => setValues((current) => ({ ...current, biologicalSex: previous }))
      )
    },
    [persist, values.biologicalSex]
  )

  return (
    <section className={SETTINGS_SECTION}>
      <h2 className={SECTION_LABEL}>About you</h2>
      <p className={SETTINGS_LEDE}>Your name and date of birth used across your dashboard.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile_first_name" className={`${LABEL} mb-2 block`}>
            First name
          </label>
          <input
            id="profile_first_name"
            type="text"
            autoComplete="given-name"
            value={values.firstName}
            disabled={savingKey === 'firstName'}
            onChange={(event) => saveNames(event.target.value, values.familyName)}
            className={AUTH_INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="profile_family_name" className={`${LABEL} mb-2 block`}>
            Family name
          </label>
          <input
            id="profile_family_name"
            type="text"
            autoComplete="family-name"
            value={values.familyName}
            disabled={savingKey === 'firstName'}
            onChange={(event) => saveNames(values.firstName, event.target.value)}
            className={AUTH_INPUT_CLASS}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="profile_date_of_birth" className={`${LABEL} mb-2 block`}>
          Date of birth
        </label>
        <input
          id="profile_date_of_birth"
          type="date"
          value={values.dateOfBirth}
          disabled={savingKey === 'dateOfBirth'}
          onChange={(event) => saveDateOfBirth(event.target.value)}
          className={AUTH_INPUT_CLASS}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="profile_biological_sex" className={`${LABEL} mb-2 block`}>
          Biological sex
        </label>
        <select
          id="profile_biological_sex"
          value={values.biologicalSex}
          disabled={savingKey === 'biologicalSex'}
          onChange={(event) => saveBiologicalSex(event.target.value)}
          className={AUTH_INPUT_CLASS}
        >
          <option value="">Select</option>
          {BIOLOGICAL_SEX_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-black/70">
        {savedMessage}
      </p>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </section>
  )
}
