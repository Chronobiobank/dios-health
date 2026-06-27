'use client'

import { useSearchParams } from 'next/navigation'
import { Callout } from '@/components/ui/Form'

export function ActivationLinkedBanner() {
  const searchParams = useSearchParams()
  const linked = searchParams.get('linked') === '1'
  const clinician = searchParams.get('clinician')

  if (!linked) return null

  return (
    <Callout tone="info" className="text-sm">
      {clinician
        ? `Linked to ${clinician}. Your clinical biochemistry dashboard is ready.`
        : 'Clinician linked. Your clinical biochemistry dashboard is ready.'}
    </Callout>
  )
}
