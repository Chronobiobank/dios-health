'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { getPitchLandingPrefetchRoutes } from '@/lib/pitch/pitch-landing-routes'

/** Warm routes while user reads the snap deck (links are often off-screen on mobile). */
export function PitchLandingPrefetch() {
  const router = useRouter()

  useEffect(() => {
    const routes = getPitchLandingPrefetchRoutes()
    const run = () => {
      for (const href of routes) {
        router.prefetch(href)
      }
    }

    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(run, { timeout: 2500 })
      return () => cancelIdleCallback(id)
    }

    const timer = setTimeout(run, 400)
    return () => clearTimeout(timer)
  }, [router])

  return null
}
