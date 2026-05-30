'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { AuthToggle } from '@/components/auth/auth-toggle'
import {
  DATA_SHARING_TOGGLES,
  dataSharingValuesFromPatient,
  type DataSharingKey,
} from '@/lib/dashboard/data-sharing-toggles'
import { createClient } from '@/lib/supabase/client'

type DataControlsPanelProps = {
  patientId: string
  dataShareGp: boolean
  dataShareResearch: boolean
  dataSharePolicy: boolean
}

export function DataControlsPanel({
  patientId,
  dataShareGp,
  dataShareResearch,
  dataSharePolicy,
}: DataControlsPanelProps) {
  const [values, setValues] = useState(() =>
    dataSharingValuesFromPatient({
      data_share_gp: dataShareGp,
      data_share_research: dataShareResearch,
      data_share_policy: dataSharePolicy,
    })
  )
  const [savingKey, setSavingKey] = useState<DataSharingKey | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    }
  }, [])

  const handleChange = useCallback(
    async (key: DataSharingKey, checked: boolean) => {
      const toggle = DATA_SHARING_TOGGLES.find((item) => item.key === key)
      if (!toggle) return

      let previousValue = false
      setValues((current) => {
        previousValue = current[key]
        return { ...current, [key]: checked }
      })
      setSavingKey(key)
      setError(null)
      setSavedMessage(null)

      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('patient_profiles')
        .update({ [toggle.column]: checked })
        .eq('id', patientId)

      setSavingKey(null)

      if (updateError) {
        setValues((current) => ({ ...current, [key]: previousValue }))
        setError('Could not save your preference. Please try again.')
        return
      }

      setSavedMessage(`${toggle.label} saved`)

      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
      savedTimeoutRef.current = setTimeout(() => setSavedMessage(null), 2500)
    },
    [patientId]
  )

  return (
    <div className="mt-8 space-y-4">
      {DATA_SHARING_TOGGLES.map((toggle) => (
        <AuthToggle
          key={toggle.key}
          label={toggle.label}
          description={toggle.description}
          checked={values[toggle.key]}
          onChange={(checked) => void handleChange(toggle.key, checked)}
          disabled={savingKey === toggle.key}
        />
      ))}

      <p className="type-body text-center text-sm text-black/60">Off means off. Immediately.</p>

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
