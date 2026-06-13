'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ProtocolRequirementsPanel } from '@/components/fulfillment/protocol-requirements-panel'
import type { PatientFulfillmentSummary } from '@/lib/fulfillment/types'

type FulfillmentOrdersViewProps = {
  summary: PatientFulfillmentSummary
  patientProfileId: string
  orderFlow?: 'patient_self' | 'clinician_for_patient'
}

export function FulfillmentOrdersView({
  summary,
  patientProfileId,
  orderFlow = 'patient_self',
}: FulfillmentOrdersViewProps) {
  const router = useRouter()
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function placeOrder(requirementKey: string) {
    setPendingKey(requirementKey)
    setError(null)
    try {
      const res = await fetch('/api/fulfillment/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientProfileId,
          orderFlow,
          requirementKeys: [requirementKey],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Order failed')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Order failed')
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <div className="fulfillment-orders-page">
      <ProtocolRequirementsPanel requirements={summary.requirements} />

      <section className="fulfillment-panel">
        <h2 className="fulfillment-panel__title">Place requirement order</h2>
        <p className="fulfillment-panel__sub">
          Select a due item to create a protocol fulfillment order.
        </p>
        {error ? <p className="fulfillment-panel__error">{error}</p> : null}
        <ul className="fulfillment-panel__list">
          {summary.outstanding.map((req) => (
            <li key={req.key} className="fulfillment-panel__row">
              <div className="fulfillment-panel__row-main">
                <p className="fulfillment-panel__row-title">{req.title}</p>
                <p className="fulfillment-panel__row-meta">{req.rationale}</p>
              </div>
              <button
                type="button"
                className="fulfillment-panel__order-btn"
                disabled={pendingKey === req.key}
                onClick={() => placeOrder(req.key)}
              >
                {pendingKey === req.key ? 'Ordering…' : 'Order from protocol'}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="fulfillment-panel">
        <h2 className="fulfillment-panel__title">Recent orders</h2>
        {summary.recentOrders.length ? (
          <ul className="fulfillment-panel__list">
            {summary.recentOrders.map((order) => (
              <li key={order.id} className="fulfillment-panel__row">
                <div className="fulfillment-panel__row-main">
                  <p className="fulfillment-panel__row-title">
                    {order.items.map((i) => i.title).join(' · ')}
                  </p>
                  <p className="fulfillment-panel__row-meta">
                    {new Date(order.createdAt).toLocaleDateString('en-GB')} · {order.orderFlow}
                  </p>
                </div>
                <span className="fulfillment-status fulfillment-status--blue">{order.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fulfillment-panel__sub">No orders on file yet.</p>
        )}
      </section>
    </div>
  )
}
