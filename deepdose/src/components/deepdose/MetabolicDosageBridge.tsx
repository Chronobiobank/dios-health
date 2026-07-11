'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/** Shown when user arrives at Chemistry from Score / Log. */
export function MetabolicDosageBridge() {
  const params = useSearchParams()
  if (params.get('from') !== 'metabolic' && params.get('from') !== 'stack') return null

  return (
    <div className="dd-metabolic-bridge">
      <p className="dd-metabolic-bridge__copy">
        Set timing, then log a photo for your feed.
      </p>
      <Link href="/dose?tag=RESETTER" className="dd-metabolic-bridge__cta">
        Log a dose
      </Link>
    </div>
  )
}
