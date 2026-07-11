import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { LogDoseView } from '@/components/deepdose/LogDoseView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Log Dose · ${DEEPDOSE_NAME}`,
  description: 'Stamp Resetters, Hijackers, Crossers, or Batteries. Get in Flow.',
  alternates: { canonical: '/dose' },
}

export default function DosePage() {
  return (
    <ProductAppShell title="Log" className="dd-log-page">
      <Suspense fallback={null}>
        <LogDoseView />
      </Suspense>
    </ProductAppShell>
  )
}
