'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  planProfileDisplayName,
  readPlanProfile,
  writePlanProfile,
  type PlanProfile,
} from '@/lib/patient/plan-profile'

export function usePatientPlanProfile(initialWake: string | null) {
  const [firstName, setFirstNameState] = useState('')
  const [familyName, setFamilyNameState] = useState('')
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null)
  const [wakeOverride, setWakeOverrideState] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readPlanProfile()
    if (stored.firstName) setFirstNameState(stored.firstName)
    else if (stored.displayName) setFirstNameState(stored.displayName)
    if (stored.familyName) setFamilyNameState(stored.familyName)
    if (stored.avatarUrl) setAvatarUrlState(stored.avatarUrl)
    if (stored.wake) setWakeOverrideState(stored.wake)
    setReady(true)
  }, [])

  const snapshot = useCallback(
    (): PlanProfile => ({
      firstName,
      familyName,
      avatarUrl,
      wake: wakeOverride ?? initialWake,
    }),
    [firstName, familyName, avatarUrl, wakeOverride, initialWake]
  )

  const setFirstName = useCallback((value: string) => {
    setFirstNameState(value)
    writePlanProfile({ ...readPlanProfile(), firstName: value })
  }, [])

  const setFamilyName = useCallback((value: string) => {
    setFamilyNameState(value)
    writePlanProfile({ ...readPlanProfile(), familyName: value })
  }, [])

  const setAvatarUrl = useCallback((value: string | null) => {
    setAvatarUrlState(value)
    writePlanProfile({ ...readPlanProfile(), avatarUrl: value })
  }, [])

  const setWake = useCallback((value: string | null) => {
    setWakeOverrideState(value)
    writePlanProfile({ ...readPlanProfile(), wake: value })
  }, [])

  const effectiveWake = wakeOverride ?? initialWake
  const fullName = planProfileDisplayName({ firstName, familyName })

  return {
    ready,
    firstName,
    setFirstName,
    familyName,
    setFamilyName,
    fullName,
    avatarUrl,
    setAvatarUrl,
    wake: effectiveWake,
    setWake,
    snapshot,
  }
}
