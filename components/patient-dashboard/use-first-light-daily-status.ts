'use client'

import { useEffect, useState } from 'react'

import {
  dailyStatusFromSessionCache,
  mergeFirstLightDailyStatus,
  type FirstLightDailyStatus,
} from '@/lib/product/first-light-daily-status'
import {
  FIRST_LIGHT_SESSION_STORAGE_KEY,
  parseFirstLightSessionCache,
} from '@/lib/product/first-light-outputs'

/**
 * Merges server-side daily status with a pending sessionStorage cache
 * (set after First Light POST, before the dashboard re-fetch catches up).
 */
export function useFirstLightDailyStatus(
  serverStatus: FirstLightDailyStatus | null | undefined
): FirstLightDailyStatus | null {
  const [merged, setMerged] = useState<FirstLightDailyStatus | null>(serverStatus ?? null)

  useEffect(() => {
    let clientStatus: FirstLightDailyStatus | null = null
    try {
      const raw = sessionStorage.getItem(FIRST_LIGHT_SESSION_STORAGE_KEY)
      if (raw) {
        const cache = parseFirstLightSessionCache(JSON.parse(raw))
        if (cache) {
          clientStatus = dailyStatusFromSessionCache(cache)
        }
      }
    } catch {
      clientStatus = null
    }

    const next = mergeFirstLightDailyStatus(serverStatus ?? null, clientStatus)
    setMerged(next)

    if (clientStatus?.completeToday && (serverStatus?.completeToday || !serverStatus)) {
      try {
        sessionStorage.removeItem(FIRST_LIGHT_SESSION_STORAGE_KEY)
      } catch {
        /* ignore */
      }
    }
  }, [serverStatus])

  return merged
}
