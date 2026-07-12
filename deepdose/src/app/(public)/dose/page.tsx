import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { LogDoseView } from '@/components/deepdose/LogDoseView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Dose · ${DEEPDOSE_NAME}`,
  description: 'Post a photo into a tribe feed — Wolf, Lion, Bear, or Dolphin.',
  alternates: { canonical: '/dose' },
}

export default function DosePage() {
  return (
    <ProductAppShell title="Dose" className="dd-log-page">
      <Suspense fallback={null}>
        <LogDoseView />
      </Suspense>
    </ProductAppShell>
  )
}
