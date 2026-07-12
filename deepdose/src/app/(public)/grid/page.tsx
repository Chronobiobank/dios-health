import type { Metadata } from 'next'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { GridFeedView } from '@/components/deepdose/GridFeedView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Feed · ${DEEPDOSE_NAME}`,
  description: 'Posts from each chemical phenotype — Night Creators, Early Explorers, and more.',
  alternates: { canonical: '/grid' },
}

export default function GridPage() {
  return (
    <ProductAppShell title="Feed" className="dd-grid-page">
      <GridFeedView />
    </ProductAppShell>
  )
}
