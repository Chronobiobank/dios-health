'use client'

import { useCallback, useEffect, useState } from 'react'

import { PATIENT_LANDING_DEMO } from '@/lib/patient/patient-landing-defaults'
import {
  planProfileDisplayName,
  readPlanProfile,
  writePlanProfile,
  type PlanProfile,
} from '@/lib/patient/plan-profile'

function isFounderSampleName(first: string, family: string, legacy?: string): boolean {
  const full = `${first} ${family}`.trim().toLowerCase()
  const legacyFull = (legacy ?? '').trim().toLowerCase()
  return full === 'grant munro' || legacyFull === 'grant munro'
}

export function usePatientPlanProfile(initialWake: string | null) {
  const [firstName, setFirstNameState] = useState('')
  const [familyName, setFamilyNameState] = useState('')
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null)
  const [location, setLocationState] = useState('')
  const [journey, setJourneyState] = useState('')
  const [wakeOverride, setWakeOverrideState] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readPlanProfile()
    const storedFirst = stored.firstName?.trim() || stored.displayName?.trim() || ''
    const storedFamily = stored.familyName?.trim() || ''
    const useDemo =
      !storedFirst ||
      isFounderSampleName(storedFirst, storedFamily, stored.displayName)

    const nextFirst = useDemo ? PATIENT_LANDING_DEMO.firstName : storedFirst
    const nextFamily = useDemo ? PATIENT_LANDING_DEMO.familyName : storedFamily
    const nextLocation = stored.location?.trim() || PATIENT_LANDING_DEMO.location
    const nextJourney = stored.journey?.trim() || PATIENT_LANDING_DEMO.journey

    setFirstNameState(nextFirst)
    setFamilyNameState(nextFamily)
    if (stored.avatarUrl) setAvatarUrlState(stored.avatarUrl)
    setLocationState(nextLocation)
    setJourneyState(nextJourney)
    if (stored.wake) setWakeOverrideState(stored.wake)

    if (useDemo || !stored.location?.trim() || !stored.journey?.trim()) {
      writePlanProfile({
        ...stored,
        firstName: nextFirst,
        familyName: nextFamily,
        location: nextLocation,
        journey: nextJourney,
        displayName: undefined,
      })
    }

    setReady(true)
  }, [])

  const snapshot = useCallback(
    (): PlanProfile => ({
      firstName,
      familyName,
      avatarUrl,
      location,
      journey,
      wake: wakeOverride ?? initialWake,
    }),
    [firstName, familyName, avatarUrl, location, journey, wakeOverride, initialWake]
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

  const setLocation = useCallback((value: string) => {
    setLocationState(value)
    writePlanProfile({ ...readPlanProfile(), location: value })
  }, [])

  const setJourney = useCallback((value: string) => {
    setJourneyState(value)
    writePlanProfile({ ...readPlanProfile(), journey: value })
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
    location,
    setLocation,
    journey,
    setJourney,
    wake: effectiveWake,
    setWake,
    snapshot,
  }
}
