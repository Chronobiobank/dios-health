'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  getTodayReal,
  readRealPosts,
  todayRealDate,
  upsertTodayReal,
  type RealPost,
} from '@/lib/patient/real-posts'

export function usePatientRealPosts() {
  const [posts, setPosts] = useState<RealPost[]>([])
  const [ready, setReady] = useState(false)

  const refresh = useCallback(() => {
    setPosts(readRealPosts())
  }, [])

  useEffect(() => {
    refresh()
    setReady(true)
  }, [refresh])

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
