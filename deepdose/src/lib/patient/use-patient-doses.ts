'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  addDoseUpload,
  bumpSync,
  dosesForDate,
  readBankOptIn,
  readDoseUploads,
  readSyncMap,
  todayDoseDate,
  todayPillars,
  writeBankOptIn,
  type DoseTag,
  type DoseUpload,
} from '@/lib/patient/dose-uploads'

export function usePatientDoses() {
  const [doses, setDoses] = useState<DoseUpload[]>([])
  const [syncs, setSyncs] = useState<Record<string, number>>({})
  const [bankOptIn, setBankOptInState] = useState(false)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(() => {
    setDoses(readDoseUploads())
    setSyncs(readSyncMap())
    setBankOptInState(readBankOptIn())
  }, [])

  useEffect(() => {
    refresh()
    setReady(true)
  }, [refresh])

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
      setSyncs(readSyncMap())
      return n
    },
    []
  )

  const setBankOptIn = useCallback((on: boolean) => {
    writeBankOptIn(on)
    setBankOptInState(on)
  }, [])

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
    sync,
    saveDose,
    bankOptIn,
    setBankOptIn,
    refresh,
    hasTagToday: (tag: DoseTag) => Boolean(pillars?.[tag]),
  }
}
