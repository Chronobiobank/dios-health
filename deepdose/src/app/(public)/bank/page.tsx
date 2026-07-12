import type { Metadata } from 'next'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { BankDashboardView } from '@/components/deepdose/BankDashboardView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Profile · ${DEEPDOSE_NAME}`,
  description: 'Your chemical phenotype score, today’s doses, and optional research share.',
  alternates: { canonical: '/bank' },
}

export default function BankPage() {
  return (
    <ProductAppShell title="Profile" className="dd-bank-page">
      <BankDashboardView />
    </ProductAppShell>
  )
}
