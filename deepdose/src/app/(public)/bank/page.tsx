import type { Metadata } from 'next'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { BankDashboardView } from '@/components/deepdose/BankDashboardView'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `Bank · ${DEEPDOSE_NAME}`,
  description: 'Sleep score, today’s stack, Chronobiobank opt-in.',
  alternates: { canonical: '/bank' },
}

export default function BankPage() {
  return (
    <ProductAppShell title="Bank" className="dd-bank-page">
      <BankDashboardView />
    </ProductAppShell>
  )
}
