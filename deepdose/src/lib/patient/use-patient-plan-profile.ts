'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { PATIENT_LANDING_DEMO } from '@/lib/patient/patient-landing-defaults'
import {
  planProfileDisplayName,
  readPlanProfile,
  writePlanProfile,
  type PlanProfile,
} from '@/lib/patient/plan-profile'
import { useIsClient } from '@/lib/react/use-is-client'

function isFounderSampleName(first: string, family: string, legacy?: string): boolean {
  const full = `${first} ${family}`.trim().toLowerCase()
  const legacyFull = (legacy ?? '').trim().toLowerCase()
  return (
    full === 'grant munro' ||
    full === 'leo costa' ||
    full === 'riley costa' ||
    full === 'theo davidson' ||
    legacyFull === 'grant munro' ||
    legacyFull === 'leo costa' ||
    legacyFull === 'riley costa' ||
    legacyFull === 'theo davidson'
  )
}

function resolveStoredProfile() {
  const stored = readPlanProfile()
  const storedFirst = stored.firstName?.trim() || stored.displayName?.trim() || ''
  const storedFamily = stored.familyName?.trim() || ''
  const useDemo =
    !storedFirst || isFounderSampleName(storedFirst, storedFamily, stored.displayName)

  const firstName = useDemo ? PATIENT_LANDING_DEMO.firstName : storedFirst
  const familyName = useDemo ? PATIENT_LANDING_DEMO.familyName : storedFamily
  const location = stored.location?.trim() || PATIENT_LANDING_DEMO.location
  const journey = stored.journey?.trim() || PATIENT_LANDING_DEMO.journey
  const storedAvatar = stored.avatarUrl?.trim() || ''
  const isUserUpload = storedAvatar.startsWith('data:')
  const avatarUrl =
    useDemo && !isUserUpload
      ? PATIENT_LANDING_DEMO.avatarUrl
      : storedAvatar || PATIENT_LANDING_DEMO.avatarUrl
  const wake = stored.wake ?? null
  const needsPersist =
    useDemo ||
    !stored.location?.trim() ||
    !stored.journey?.trim() ||
    !stored.avatarUrl?.trim() ||
    (useDemo && !isUserUpload && storedAvatar !== PATIENT_LANDING_DEMO.avatarUrl)

  return {
    firstName,
    familyName,
    location,
    journey,
    avatarUrl,
    wake,
    needsPersist,
    persistPayload: {
      ...stored,
      firstName,
      familyName,
      location,
      journey,
      avatarUrl,
      displayName: undefined,
    } satisfies PlanProfile,
  }
}

export function usePatientPlanProfile(initialWake: string | null) {
  const isClient = useIsClient()
  const [epoch, setEpoch] = useState(0)
  const didPersistDefaults = useRef(false)

  const resolved = useMemo(() => {
    if (!isClient) {
      return {
        firstName: '',
        familyName: '',
        location: '',
        journey: '',
        avatarUrl: null as string | null,
        wake: null as string | null,
      }
    }
    void epoch
    const next = resolveStoredProfile()
    return {
      firstName: next.firstName,
      familyName: next.familyName,
      location: next.location,
      journey: next.journey,
      avatarUrl: next.avatarUrl,
      wake: next.wake,
      needsPersist: next.needsPersist,
      persistPayload: next.persistPayload,
    }
  }, [isClient, epoch])

  useEffect(() => {
    if (!isClient || didPersistDefaults.current) return
    const next = resolveStoredProfile()
    if (next.needsPersist) writePlanProfile(next.persistPayload)
    didPersistDefaults.current = true
  }, [isClient])

  const bump = useCallback(() => setEpoch((n) => n + 1), [])

  const setFirstName = useCallback(
    (value: string) => {
      writePlanProfile({ ...readPlanProfile(), firstName: value })
      bump()
    },
    [bump]
  )

  const setFamilyName = useCallback(
    (value: string) => {
      writePlanProfile({ ...readPlanProfile(), familyName: value })
      bump()
    },
    [bump]
  )

  const setAvatarUrl = useCallback(
    (value: string | null) => {
      writePlanProfile({ ...readPlanProfile(), avatarUrl: value })
      bump()
    },
    [bump]
  )

  const setLocation = useCallback(
    (value: string) => {
      writePlanProfile({ ...readPlanProfile(), location: value })
      bump()
    },
    [bump]
  )

  const setJourney = useCallback(
    (value: string) => {
      writePlanProfile({ ...readPlanProfile(), journey: value })
      bump()
    },
    [bump]
  )

  const setWake = useCallback(
    (value: string | null) => {
      writePlanProfile({ ...readPlanProfile(), wake: value })
      bump()
    },
    [bump]
  )

  const effectiveWake = resolved.wake ?? initialWake
  const fullName = planProfileDisplayName({
    firstName: resolved.firstName,
    familyName: resolved.familyName,
  })

  const snapshot = useCallback(
    (): PlanProfile => ({
      firstName: resolved.firstName,
      familyName: resolved.familyName,
      avatarUrl: resolved.avatarUrl,
      location: resolved.location,
      journey: resolved.journey,
      wake: effectiveWake,
    }),
    [
      resolved.firstName,
      resolved.familyName,
      resolved.avatarUrl,
      resolved.location,
      resolved.journey,
      effectiveWake,
    ]
  )

  return {
    ready: isClient,
    firstName: resolved.firstName,
    setFirstName,
    familyName: resolved.familyName,
    setFamilyName,
    fullName,
    avatarUrl: resolved.avatarUrl,
    setAvatarUrl,
    location: resolved.location,
    setLocation,
    journey: resolved.journey,
    setJourney,
    wake: effectiveWake,
    setWake,
    snapshot,
  }
}
