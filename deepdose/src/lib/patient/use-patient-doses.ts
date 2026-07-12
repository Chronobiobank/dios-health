'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  addDoseUpload,
  bumpSync,
  dosesForDate,
  hasSyncedDose,
  readBankOptIn,
  readDoseUploads,
  readSyncMap,
  readSyncedByMe,
  todayDoseDate,
  todayPillars,
  writeBankOptIn,
  type DoseTag,
  type DoseUpload,
} from '@/lib/patient/dose-uploads'
import { useIsClient } from '@/lib/react/use-is-client'

export function usePatientDoses() {
  const isClient = useIsClient()
  const [epoch, setEpoch] = useState(0)

  const refresh = useCallback(() => {
    setEpoch((n) => n + 1)
  }, [])

  const doses: DoseUpload[] = useMemo(() => {
    if (!isClient) return []
    void epoch
    return readDoseUploads()
  }, [isClient, epoch])

  const syncs = useMemo(() => {
    if (!isClient) return {} as Record<string, number>
    void epoch
    return readSyncMap()
  }, [isClient, epoch])

  const syncedByMe = useMemo(() => {
    if (!isClient) return new Set<string>()
    void epoch
    return readSyncedByMe()
  }, [isClient, epoch])

  const bankOptIn = useMemo(() => {
    if (!isClient) return false
    void epoch
    return readBankOptIn()
  }, [isClient, epoch])

  const ready = isClient

  const saveDose = useCallback(
    (input: Parameters<typeof addDoseUpload>[0]) => {
      const next = addDoseUpload(input)
      refresh()
      return next
    },
    [refresh]
  )

  const sync = useCallback(
    (doseId: string) => {
      const n = bumpSync(doseId)
      refresh()
      return n
    },
    [refresh]
  )

  const setBankOptIn = useCallback(
    (on: boolean) => {
      writeBankOptIn(on)
      refresh()
    },
    [refresh]
  )

  const date = todayDoseDate()
  const pillars = ready ? todayPillars(date) : null
  const todaySelf = ready ? dosesForDate(date) : []

  return {
    ready,
    doses,
    todaySelf,
    pillars,
    todayDate: date,
    syncs,
    syncedByMe,
    sync,
    saveDose,
    bankOptIn,
    setBankOptIn,
    refresh,
    hasTagToday: (tag: DoseTag) => Boolean(pillars?.[tag]),
    hasSynced: (doseId: string) =>
      syncedByMe.has(doseId) || (isClient ? hasSyncedDose(doseId) : false),
  }
}
