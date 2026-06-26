'use client'

import { useEffect, useRef } from 'react'

import { planProfileDisplayName, readPlanProfile } from '@/lib/patient/plan-profile'

/** One-time import of landing profile name into the signed-in account. */
export function PlanProfileSync() {
  const synced = useRef(false)

  useEffect(() => {
    if (synced.current) return
    const displayName = planProfileDisplayName(readPlanProfile())
    if (!displayName) return

    synced.current = true
    void fetch('/api/patient/profile/plan-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName }),
    })
  }, [])

  return null
}
