import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { LogDoseView } from '@/components/deepdose/LogDoseView'
import { DOSE_SHARE_META } from '@/lib/deepdose-marketing/dose-share-content'

export const metadata: Metadata = {
  title: DOSE_SHARE_META.title,
  description: DOSE_SHARE_META.description,
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
