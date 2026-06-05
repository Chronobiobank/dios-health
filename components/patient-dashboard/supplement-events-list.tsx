'use client'

import { useEffect, useState } from 'react'

import type { SupplementOrderEvent } from '@/lib/shop/types'

type SupplementEventsListProps = {
  patientRecordId: string
  refreshKey?: number
}

export function SupplementEventsList({
  patientRecordId,
  refreshKey = 0,
}: SupplementEventsListProps) {
  const [orders, setOrders] = useState<SupplementOrderEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/shop/orders?patientRecordId=${encodeURIComponent(patientRecordId)}`)
      .then((r) => r.json())
      .then((data: { orders?: SupplementOrderEvent[] }) => {
        if (!cancelled) setOrders(data.orders ?? [])
      })
      .catch(() => {
        if (!cancelled) setOrders([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [patientRecordId, refreshKey])

  if (loading) {
    return (
      <p className="chronoimmune-panel__meta text-xs">Loading supplement orders…</p>
    )
  }

  if (orders.length === 0) {
    return (
      <p className="chronoimmune-panel__meta text-xs">No supplement orders logged yet.</p>
    )
  }

  return (
    <section className="chronoimmune-supplement-events">
      <p className="dash-sub mb-2 uppercase tracking-widest">Supplement orders</p>
      <ul className="chronoimmune-supplement-events__list">
        {orders.map((order) => (
          <li key={order.id} className="chronoimmune-supplement-event">
            <p className="text-sm font-medium text-[var(--dash-text)]">{order.productName}</p>
            <p className="chronoimmune-panel__meta mt-0.5">
              {order.protocolDose} · £{order.totalGbp.toFixed(0)} ·{' '}
              {order.orderFlow === 'practitioner_for_patient' ? 'Practitioner order' : 'Self-order'}
            </p>
            <p className="chronoimmune-panel__meta">
              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {order.status.replace('_', ' ')} · by {order.orderedBy}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
