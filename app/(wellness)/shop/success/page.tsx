import Link from 'next/link'

import { CLINIC_ROUTES, PATIENT_ROUTES, SHOP_ROUTES } from '@/lib/auth/routes'
import { getSupplementOrderById } from '@/lib/shop/supplement-history'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ order_id?: string }>
}

export default async function ShopSuccessPage({ searchParams }: Props) {
  const { order_id: orderId } = await searchParams
  const supabase = await createClient()
  const order = orderId ? await getSupplementOrderById(supabase, orderId) : null

  return (
    <main className="shop-page">
      <h1 className="text-2xl font-semibold">Order confirmed</h1>
      {order ? (
        <div className="mt-4 space-y-2 text-sm text-black/75">
          <p>
            <strong>{order.productName}</strong> queued for fulfilment.
          </p>
          <p>Patient record {order.patientRecordId} · £{order.totalGbp.toFixed(0)}</p>
          <p>{order.protocolDose}</p>
          <p className="text-black/50">
            {order.orderFlow === 'practitioner_for_patient'
              ? 'Practitioner order logged in patient record.'
              : 'Self-order logged in your DIOS profile.'}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-black/65">
          Your order has been queued. Sign in to view order details in your dashboard.
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={PATIENT_ROUTES.dashboard} className="shop-checkout-btn inline-block">
          Back to dashboard
        </Link>
        {order ? (
          <Link
            href={`${CLINIC_ROUTES.panel}?ordered=${order.patientRecordId}`}
            className="text-sm text-black/60 underline"
          >
            View in clinician cohort
          </Link>
        ) : null}
        <Link href={SHOP_ROUTES.catalog} className="text-sm text-black/60 underline">
          Continue shopping
        </Link>
      </div>
    </main>
  )
}
