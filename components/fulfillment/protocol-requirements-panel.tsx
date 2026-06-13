import Link from 'next/link'

import { getFulfillmentProvider } from '@/lib/fulfillment/providers'
import { requirementStatusLabel } from '@/lib/fulfillment/status-labels'
import type { ProtocolRequirement } from '@/lib/fulfillment/types'
import { cn } from '@/lib/utils'

type ProtocolRequirementsPanelProps = {
  requirements: ProtocolRequirement[]
  orderBaseHref?: string
  patientId?: string
  title?: string
}

function statusTone(status: ProtocolRequirement['status']): string {
  switch (status) {
    case 'completed':
      return 'fulfillment-status--green'
    case 'ordered':
      return 'fulfillment-status--blue'
    case 'overdue':
      return 'fulfillment-status--red'
    default:
      return 'fulfillment-status--amber'
  }
}

function groupLabel(kind: ProtocolRequirement['kind']): string {
  switch (kind) {
    case 'supplement':
      return 'Required supplements'
    case 'lab_test':
      return 'Required tests'
    case 'assessment':
      return 'Required assessments'
  }
}

export function ProtocolRequirementsPanel({
  requirements,
  orderBaseHref,
  patientId,
  title = 'Protocol requirements',
}: ProtocolRequirementsPanelProps) {
  const groups: ProtocolRequirement['kind'][] = ['supplement', 'lab_test', 'assessment']

  return (
    <section className="fulfillment-panel">
      <h2 className="fulfillment-panel__title">{title}</h2>
      <p className="fulfillment-panel__sub">
        Protocol-linked items only — not a product catalogue.
      </p>

      {groups.map((kind) => {
        const items = requirements.filter((r) => r.kind === kind)
        if (!items.length) return null

        return (
          <div key={kind} className="fulfillment-panel__group">
            <h3 className="fulfillment-panel__group-title">{groupLabel(kind)}</h3>
            <ul className="fulfillment-panel__list">
              {items.map((req) => {
                const provider = getFulfillmentProvider(req.providerId)
                const canOrder = req.status === 'due' || req.status === 'overdue'
                const orderHref =
                  canOrder && orderBaseHref
                    ? `${orderBaseHref}?requirement=${req.key}${patientId ? `&patientId=${patientId}` : ''}`
                    : null

                return (
                  <li key={req.key} className="fulfillment-panel__row">
                    <div className="fulfillment-panel__row-main">
                      <p className="fulfillment-panel__row-title">{req.title}</p>
                      <p className="fulfillment-panel__row-meta">
                        {provider?.label ?? req.providerId}
                        {req.dueAt
                          ? ` · due ${new Date(req.dueAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                          : ''}
                      </p>
                    </div>
                    <div className="fulfillment-panel__row-actions">
                      <span className={cn('fulfillment-status', statusTone(req.status))}>
                        {requirementStatusLabel(req.status)}
                      </span>
                      {orderHref ? (
                        <Link href={orderHref} className="fulfillment-panel__order-btn">
                          Order
                        </Link>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
