'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/** Shown when user arrives at Chemistry from #Meds Log Dose. */
export function MetabolicDosageBridge() {
  const params = useSearchParams()
  if (params.get('from') !== 'metabolic') return null

  return (
    <div className="dd-metabolic-bridge">
      <p className="dd-metabolic-bridge__copy">
        #Meds · set timing, then stamp a photo for the Grid.
      </p>
      <Link href="/dose?tag=METABOLIC" className="dd-metabolic-bridge__cta">
        Stamp photo
      </Link>
    </div>
  )
}
