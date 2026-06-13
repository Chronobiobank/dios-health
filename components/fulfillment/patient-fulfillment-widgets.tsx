import Link from 'next/link'

import { requirementStatusLabel } from '@/lib/fulfillment/status-labels'
import type { PatientFulfillmentSummary } from '@/lib/fulfillment/types'
import { FULFILLMENT_ROUTES } from '@/lib/auth/routes'

type PatientFulfillmentWidgetsProps = {
  summary: PatientFulfillmentSummary
}

function WidgetList({
  title,
  items,
  empty,
}: {
  title: string
  items: Array<{ key: string; title: string; status: string }>
  empty: string
}) {
  return (
    <div className="fulfillment-widget">
      <h3 className="fulfillment-widget__title">{title}</h3>
      {items.length ? (
        <ul className="fulfillment-widget__list">
          {items.slice(0, 3).map((item) => (
            <li key={item.key} className="fulfillment-widget__item">
              <span>{item.title}</span>
              <span className="fulfillment-widget__status">{item.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fulfillment-widget__empty">{empty}</p>
      )}
    </div>
  )
}

export function PatientFulfillmentWidgets({ summary }: PatientFulfillmentWidgetsProps) {
  return (
    <section className="fulfillment-widgets">
      <div className="fulfillment-widgets__head">
        <h2 className="fulfillment-widgets__heading">Protocol fulfillment</h2>
        <Link href={FULFILLMENT_ROUTES.patientOrders} className="fulfillment-widgets__link">
          View orders →
        </Link>
      </div>
      <div className="fulfillment-widgets__grid">
        <WidgetList
          title="Upcoming tests"
          items={summary.upcomingTests.map((r) => ({
            key: r.key,
            title: r.title,
            status: requirementStatusLabel(r.status),
          }))}
          empty="No tests due right now."
        />
        <WidgetList
          title="Upcoming reorders"
          items={summary.upcomingReorders.map((r) => ({
            key: r.key,
            title: r.title,
            status: requirementStatusLabel(r.status),
          }))}
          empty="No supplement reorders due."
        />
        <WidgetList
          title="Outstanding requirements"
          items={summary.outstanding.map((r) => ({
            key: r.key,
            title: r.title,
            status: requirementStatusLabel(r.status),
          }))}
          empty="All protocol requirements are on track."
        />
        <WidgetList
          title="Recent orders"
          items={summary.recentOrders.map((o) => ({
            key: o.id,
            title: o.items.map((i) => i.title).join(', ') || 'Order',
            status: o.status,
          }))}
          empty="No orders yet."
        />
      </div>
    </section>
  )
}
