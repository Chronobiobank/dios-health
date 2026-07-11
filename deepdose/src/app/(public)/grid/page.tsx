import type { Metadata } from 'next'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { GridFeedView } from '@/components/deepdose/GridFeedView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Grid · ${DEEPDOSE_NAME}`,
  description: 'Dosers on your clock — Larks and Owls, sleep scores, Flow.',
  alternates: { canonical: '/grid' },
}

export default function GridPage() {
  return (
    <ProductAppShell title="Grid" className="dd-grid-page">
      <GridFeedView />
    </ProductAppShell>
  )
}
