import type { Metadata } from 'next'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { BankDashboardView } from '@/components/deepdose/BankDashboardView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Score · ${DEEPDOSE_NAME}`,
  description: 'Your sleep score, today’s doses, and optional research share.',
  alternates: { canonical: '/bank' },
}

export default function BankPage() {
  return (
    <ProductAppShell title="Score" className="dd-bank-page">
      <BankDashboardView />
    </ProductAppShell>
  )
}
