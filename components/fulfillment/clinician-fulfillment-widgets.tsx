import Link from 'next/link'

import { requirementStatusLabel } from '@/lib/fulfillment/status-labels'
import type { ClinicianFulfillmentSummary } from '@/lib/fulfillment/types'
import { CLINIC_ROUTES, FULFILLMENT_ROUTES } from '@/lib/auth/routes'

type ClinicianFulfillmentWidgetsProps = {
  summary: ClinicianFulfillmentSummary
}

function TaskList({
  title,
  rows,
  empty,
}: {
  title: string
  rows: ClinicianFulfillmentSummary['outstandingTasks']
  empty: string
}) {
  return (
    <div className="fulfillment-widget">
      <h3 className="fulfillment-widget__title">{title}</h3>
      {rows.length ? (
        <ul className="fulfillment-widget__list">
          {rows.slice(0, 4).map((row) => (
            <li key={`${row.patientRef}-${row.requirement.key}`} className="fulfillment-widget__item">
              <span>
                {row.patientName} · {row.requirement.title}
              </span>
              <span className="fulfillment-widget__status">
                {requirementStatusLabel(row.requirement.status)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fulfillment-widget__empty">{empty}</p>
      )}
    </div>
  )
}

export function ClinicianFulfillmentWidgets({ summary }: ClinicianFulfillmentWidgetsProps) {
  return (
    <section className="fulfillment-widgets">
      <div className="fulfillment-widgets__head">
        <h2 className="fulfillment-widgets__heading">Protocol fulfillment</h2>
        <Link href={FULFILLMENT_ROUTES.clinicOrders} className="fulfillment-widgets__link">
          Open orders →
        </Link>
      </div>
      <div className="fulfillment-widgets__grid">
        <TaskList
          title="Patients missing tests"
          rows={summary.patientsMissingTests}
          empty="No missing lab orders in cohort."
        />
        <TaskList
          title="Overdue for monitoring"
          rows={summary.patientsOverdueMonitoring}
          empty="No overdue monitoring flags."
        />
        <TaskList
          title="Outstanding fulfillment tasks"
          rows={summary.outstandingTasks}
          empty="Cohort fulfillment is current."
        />
        <TaskList
          title="Unreviewed results"
          rows={summary.unreviewedResults}
          empty="No results awaiting review."
        />
      </div>
      <p className="fulfillment-widgets__foot">
        <Link href={CLINIC_ROUTES.panel}>Return to cohort</Link>
      </p>
    </section>
  )
}
