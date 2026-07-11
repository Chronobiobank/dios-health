'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/** Shown when user arrives at Chemistry from Bank / Log depth path. */
export function MetabolicDosageBridge() {
  const params = useSearchParams()
  if (params.get('from') !== 'metabolic' && params.get('from') !== 'stack') return null

  return (
    <div className="dd-metabolic-bridge">
      <p className="dd-metabolic-bridge__copy">
        Set timing, then stamp a photo for the Grid.
      </p>
      <Link href="/dose?tag=RESETTER" className="dd-metabolic-bridge__cta">
        Stamp for Grid
      </Link>
    </div>
  )
}
