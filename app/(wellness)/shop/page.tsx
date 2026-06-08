import type { Metadata } from 'next'
import Link from 'next/link'

import { ShopCatalogGrid } from '@/components/shop/shop-catalog-grid'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export const metadata: Metadata = {
  title: 'Protocol supplements — DIOS',
  description: 'Protocol-matched supplements recommended by your Chronoimmune and Gominak panel.',
}

export default function ShopPage() {
  return (
    <main className="shop-page">
      <Link href={PATIENT_ROUTES.dashboard} className="text-sm text-black/50 hover:text-black">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">DIOS protocol supplements</h1>
      <p className="mt-2 text-sm leading-relaxed text-black/65">
        Five launch formulations matched to Chronoimmune and Gominak protocols. DIOS recommends —
        affiliate fulfilment at launch, white label in phase two.
      </p>
      <ShopCatalogGrid />
    </main>
  )
}
