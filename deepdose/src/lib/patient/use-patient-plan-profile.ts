'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'deepdose-plan-profile'

type StoredProfile = {
  firstName?: string
  familyName?: string
  /** @deprecated migrated to firstName */
  displayName?: string
  avatarUrl?: string | null
  wake?: string | null
}

function readStored(): StoredProfile {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredProfile) : {}
  } catch {
    return {}
  }
}

function writeStored(next: StoredProfile) {
  try {
    const { displayName: _legacy, ...rest } = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
  } catch {
    /* quota or private mode */
  }
}

export function usePatientPlanProfile(initialWake: string | null) {
  const [firstName, setFirstNameState] = useState('')
  const [familyName, setFamilyNameState] = useState('')
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null)
  const [wakeOverride, setWakeOverrideState] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readStored()
    if (stored.firstName) setFirstNameState(stored.firstName)
    else if (stored.displayName) setFirstNameState(stored.displayName)
    if (stored.familyName) setFamilyNameState(stored.familyName)
    if (stored.avatarUrl) setAvatarUrlState(stored.avatarUrl)
    if (stored.wake) setWakeOverrideState(stored.wake)
    setReady(true)
  }, [])

  const snapshot = useCallback(
    (): StoredProfile => ({
      firstName,
      familyName,
      avatarUrl,
      wake: wakeOverride ?? initialWake,
    }),
    [firstName, familyName, avatarUrl, wakeOverride, initialWake]
  )

  const setFirstName = useCallback((value: string) => {
    setFirstNameState(value)
    writeStored({ ...readStored(), firstName: value })
  }, [])

  const setFamilyName = useCallback((value: string) => {
    setFamilyNameState(value)
    writeStored({ ...readStored(), familyName: value })
  }, [])

  const setAvatarUrl = useCallback((value: string | null) => {
    setAvatarUrlState(value)
    writeStored({ ...readStored(), avatarUrl: value })
  }, [])

  const setWake = useCallback((value: string | null) => {
    setWakeOverrideState(value)
    writeStored({ ...readStored(), wake: value })
  }, [])

  const effectiveWake = wakeOverride ?? initialWake
  const fullName = [firstName.trim(), familyName.trim()].filter(Boolean).join(' ')

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
