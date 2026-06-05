'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { ShopProduct } from '@/lib/shop/catalog'
import type { OrderFlow, PatientDeliveryProfile } from '@/lib/shop/types'

type ProductCheckoutFormProps = {
  product: ShopProduct
  initialQtyId: string
  orderFlow: OrderFlow
  patientRecordId: string
  patientName: string
  delivery: PatientDeliveryProfile
  micronutrientId?: string | null
  protocolDose?: string
  successPath?: string
  cancelPath?: string
  submitLabel?: string
}

export function ProductCheckoutForm({
  product,
  initialQtyId,
  orderFlow,
  patientRecordId,
  patientName,
  delivery,
  micronutrientId = null,
  protocolDose,
  successPath,
  cancelPath,
  submitLabel = 'Proceed to checkout',
}: ProductCheckoutFormProps) {
  const router = useRouter()
  const [qtyId, setQtyId] = useState(initialQtyId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = product.quantityOptions.find((q) => q.id === qtyId) ?? product.quantityOptions[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          quantityOptionId: qtyId,
          orderFlow,
          patientRecordId,
          patientName,
          micronutrientId,
          delivery,
          protocolDose: protocolDose ?? product.defaultProtocolDose,
          successPath,
          cancelPath,
        }),
      })

      const data = (await res.json()) as {
        error?: string
        mode?: string
        url?: string
        redirectUrl?: string
      }

      if (!res.ok) {
        setError(data.error ?? 'Checkout failed')
        return
      }

      if (data.mode === 'stripe' && data.url) {
        window.location.href = data.url
        return
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl)
      }
    } catch {
      setError('Checkout failed — try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="shop-checkout-form space-y-4">
      <div>
        <label className="shop-label" htmlFor="protocol-dose">
          Protocol dose
        </label>
        <p id="protocol-dose" className="shop-protocol-dose mt-1">
          {protocolDose ?? product.defaultProtocolDose}
        </p>
      </div>

      <div>
        <label className="shop-label" htmlFor="quantity">
          Quantity
        </label>
        <select
          id="quantity"
          value={qtyId}
          onChange={(e) => setQtyId(e.target.value)}
          className="shop-select mt-1 w-full"
        >
          {product.quantityOptions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.label} — £{q.priceGbp}
            </option>
          ))}
        </select>
      </div>

      <div className="shop-delivery-block rounded-lg border border-black/10 bg-black/[0.02] p-3 text-sm">
        <p className="font-mono text-[10px] uppercase tracking-wider text-black/45">Delivery</p>
        <p className="mt-1 text-black/80">{delivery.line1}</p>
        {delivery.line2 ? <p className="text-black/70">{delivery.line2}</p> : null}
        <p className="text-black/70">
          {delivery.city} {delivery.postcode}
        </p>
        <p className="text-black/70">{delivery.country}</p>
      </div>

      <p className="text-sm font-medium text-black">
        Total £{selected.priceGbp.toFixed(0)}
      </p>
      <p className="text-xs text-black/50">{product.fulfilmentNote}</p>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button type="submit" disabled={submitting} className="shop-checkout-btn w-full">
        {submitting ? 'Processing…' : submitLabel}
      </button>
    </form>
  )
}
