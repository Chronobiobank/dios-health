'use client'

import Link from 'next/link'
import { Fragment, useState } from 'react'

import { PRGC_THRESHOLDS } from '@/lib/clinic/prgc-monitoring'
import {
  protocolLabel,
  type SecopeuticDemoPatient,
  zoneLabel,
} from '@/lib/secopeutic/demo-cohort'
import { SECOPUTIC_DEMO_PATH } from '@/lib/secopeutic/site'
import { cn } from '@/lib/utils'

type SecopeuticCohortTableProps = {
  patients: SecopeuticDemoPatient[]
  title?: string
  support?: string
  variant?: 'light' | 'dark'
}

function MetricValue({
  value,
  status,
  dark,
}: {
  value: string
  status: 'green' | 'amber' | 'red'
  dark?: boolean
}) {
  return (
    <span
      className={cn(
        'seco-demo-metric',
        dark && 'seco-demo-metric--dark',
        status === 'green' && 'seco-demo-metric--green',
        status === 'amber' && 'seco-demo-metric--amber',
        status === 'red' && 'seco-demo-metric--red'
      )}
    >
      {value}
    </span>
  )
}

function ZonePill({
  zone,
  dark,
}: {
  zone: SecopeuticDemoPatient['safetyZone']
  dark?: boolean
}) {
  return (
    <span
      className={cn(
        'seco-demo-zone',
        dark && 'seco-demo-zone--dark',
        zone === 'stable' && 'seco-demo-zone--stable',
        zone === 'review' && 'seco-demo-zone--review',
        zone === 'hold' && 'seco-demo-zone--hold'
      )}
    >
      {zoneLabel(zone)}
    </span>
  )
}

export function SecopeuticCohortTable({
  patients,
  title = 'Active cohort',
  support,
  variant = 'light',
}: SecopeuticCohortTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(patients[0]?.id ?? null)
  const dark = variant === 'dark'

  return (
    <section className={cn('seco-demo-table', dark && 'seco-demo-table--dark')}>
      <div className="seco-demo-table__head">
        <h2 className="seco-demo-table__title">{title}</h2>
        {support ? <p className="seco-demo-table__support">{support}</p> : null}
      </div>

      <div className="seco-demo-table__frame">
        <table className="seco-demo-table__grid">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Protocol</th>
              <th>Safety</th>
              <th>Sleep</th>
              <th>PTH</th>
              <th>Timing</th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const expanded = expandedId === patient.id

              return (
                <Fragment key={patient.id}>
                  <tr
                    className={cn('seco-demo-table__row', expanded && 'seco-demo-table__row--expanded')}
                    onClick={() => setExpandedId(expanded ? null : patient.id)}
                  >
                    <td>
                      <p className="seco-demo-table__name">{patient.displayName}</p>
                      <p className="seco-demo-table__meta">
                        {patient.age} · {patient.recordId}
                      </p>
                      <p className="seco-demo-table__indication">{patient.indication}</p>
                    </td>
                    <td>
                      <span className="seco-demo-table__protocol">{protocolLabel(patient.protocol)}</span>
                    </td>
                    <td>
                      <ZonePill zone={patient.safetyZone} dark={dark} />
                    </td>
                    <td>
                      <MetricValue
                        value={patient.sleepEfficiency.value}
                        status={patient.sleepEfficiency.status}
                        dark={dark}
                      />
                    </td>
                    <td>
                      <MetricValue value={patient.pth.value} status={patient.pth.status} dark={dark} />
                    </td>
                    <td>
                      <MetricValue
                        value={patient.d3Timing.value}
                        status={patient.d3Timing.status}
                        dark={dark}
                      />
                    </td>
                    <td>
                      <Link
                        href={`${SECOPUTIC_DEMO_PATH}/patients/${patient.id}`}
                        className="seco-demo-table__open"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                  {expanded ? (
                    <tr className="seco-demo-table__detail-row">
                      <td colSpan={7}>
                        <p className="seco-demo-table__read">{patient.clinicalRead}</p>
                        <div className="seco-demo-table__detail-meta">
                          <span
                            className={cn(
                              'seco-demo-zone',
                              dark && 'seco-demo-zone--dark',
                              patient.responseZone === 'stable' && 'seco-demo-zone--stable',
                              patient.responseZone === 'review' && 'seco-demo-zone--review',
                              patient.responseZone === 'hold' && 'seco-demo-zone--hold'
                            )}
                          >
                            {patient.action}
                          </span>
                          <span className="seco-demo-table__detail-note">
                            Dose window{' '}
                            {patient.doseWindowPct === null ? 'Pending' : `${patient.doseWindowPct}%`} ·
                            Mobile {patient.mobileLight.value} · TipTraQ {patient.tiptraqBlock.value}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="seco-demo-table__footnote">
        Illustrative demo only. Targets: sleep &gt;{PRGC_THRESHOLDS.sleepEfficiency.target}% · REM &lt;
        {PRGC_THRESHOLDS.remLatencyMins.target} min · PTH &lt;{PRGC_THRESHOLDS.pthPgMl.suppressedBelow}{' '}
        pg/mL.
      </p>
    </section>
  )
}
