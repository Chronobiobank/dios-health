'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  getTodayReal,
  readRealPosts,
  todayRealDate,
  upsertTodayReal,
  type RealPost,
} from '@/lib/patient/real-posts'
import { useIsClient } from '@/lib/react/use-is-client'

export function usePatientRealPosts() {
  const isClient = useIsClient()
  const [epoch, setEpoch] = useState(0)

  const refresh = useCallback(() => {
    setEpoch((n) => n + 1)
  }, [])

  const posts: RealPost[] = useMemo(() => {
    if (!isClient) return []
    void epoch
    return readRealPosts()
  }, [isClient, epoch])

  const ready = isClient
  const today = ready ? getTodayReal() : null

  const saveToday = useCallback(
    (input: {
      photoUrl: string
      sri: number
      sleepOff: string
      sleepOn: string
      displayName: string
    }) => {
      const next = upsertTodayReal(input)
      refresh()
      return next
    },
    [refresh]
  )

  return {
    ready,
    posts,
    today,
    todayDate: todayRealDate(),
    hasPostedToday: Boolean(today),
    saveToday,
    refresh,
  }
}
