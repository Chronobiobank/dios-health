import Link from 'next/link'

import { shopProductUrl } from '@/lib/shop/catalog'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export const metadata = {
  title: 'First Light complete — DIOS',
}

/** Post-scan output — supplement recommendation entry point for patient self-order. */
export default function FirstLightCompletePage() {
  const recommendedSlug = 'd3-k2-protocol' as const

  return (
    <main className="shop-page mx-auto max-w-lg px-5 py-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
        {FIRST_LIGHT_PROTOCOL.name} complete
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Your morning outputs</h1>
      <ul className="mt-4 space-y-3 text-sm text-black/75">
        <li>Photonic Age trend — improving vs last week</li>
        <li>Eating window opens in 1 hour · closes at 6:45pm</li>
        <li>Ramipril timing today — 9:30pm</li>
      </ul>

      <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-950">Protocol recommendation</p>
        <p className="mt-2 text-sm text-amber-900/90">
          Your micronutrient checklist flags D3/K2 as unconfirmed. DIOS recommends the protocol
          formula below.
        </p>
        <Link
          href={shopProductUrl(recommendedSlug, {
            qty: '30',
            source: 'first-light',
          })}
          className="shop-checkout-btn mt-4 inline-block"
        >
          Order D3/K2 Protocol Formula →
        </Link>
      </section>

      <Link href={PATIENT_ROUTES.dashboard} className="mt-6 inline-block text-sm text-black/50">
        Back to dashboard
      </Link>
    </main>
  )
}
