'use client'

import { Fragment, useState } from 'react'

import { DATA_LABEL, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { FlagBadge } from '@/components/ui/flag-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableDataCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  PRGC_THRESHOLDS,
  type PrgcMetricCell,
  type PrgcMonitoringPatient,
} from '@/lib/clinic/prgc-monitoring'
import { PRGC_CADENCE_LINE } from '@/lib/product/intelligence-cadence'
import { cn } from '@/lib/utils'

type PrgcMonitoringTableProps = {
  patients: PrgcMonitoringPatient[]
}

const STATUS_SEVERITY = {
  green: 'green',
  amber: 'amber',
  red: 'red',
} as const

function trendArrow(trend: PrgcMetricCell['trend']): string | null {
  if (trend === 'improving') return '↓'
  if (trend === 'worsening') return '↑'
  return null
}

function MetricCell({ cell }: { cell: PrgcMetricCell }) {
  const arrow = trendArrow(cell.trend)

  return (
    <div className="min-w-[5.5rem]">
      <div className="flex items-baseline gap-1.5">
        <p
          className={cn(
            'font-mono text-data-md font-semibold tabular-nums',
            cell.status === 'green' && 'text-status-green',
            cell.status === 'amber' && 'text-status-amber',
            cell.status === 'red' && 'text-status-red'
          )}
        >
          {cell.value}
        </p>
        {arrow ? (
          <span className="font-mono text-data-sm text-black/40" title={cell.prior ? `was ${cell.prior}` : undefined}>
            {arrow}
          </span>
        ) : null}
      </div>
      {cell.prior ? (
        <p className={cn(DATA_LABEL, 'mt-0.5 text-black/35')}>was {cell.prior}</p>
      ) : null}
      {cell.hint ? (
        <p className="mt-1 font-ui text-ui-sm leading-snug text-black/50">{cell.hint}</p>
      ) : null}
    </div>
  )
}

export function PrgcMonitoringTable({ patients }: PrgcMonitoringTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={SECTION_LABEL}>Cohort — pRGC readouts</h2>
          <p className="mt-1 max-w-2xl font-ui text-ui-sm leading-relaxed text-black/60">
            {PRGC_CADENCE_LINE} D3 timing is the variable the patient confirms daily through DINA.
          </p>
        </div>
        <p className={cn(DATA_LABEL, 'text-black/40')}>
          Targets: sleep &gt;{PRGC_THRESHOLDS.sleepEfficiency.target}% · REM &lt;
          {PRGC_THRESHOLDS.remLatencyMins.target} min · PTH &lt;
          {PRGC_THRESHOLDS.pthPgMl.suppressedBelow} pg/mL
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border-[0.5px] border-black/[0.08] bg-white">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="border-b border-black/10 bg-neutral-50">
              <TableHead className="px-4 py-3 sm:px-5">Patient</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Sleep efficiency</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">REM latency</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">PTH</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">D3 timing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => {
              const expanded = expandedId === patient.id

              return (
                <Fragment key={patient.id}>
                  <TableRow
                    className={cn(
                      'cursor-pointer border-b border-black/5 transition-colors hover:bg-black/[0.02]',
                      expanded && 'bg-black/[0.02]'
                    )}
                    onClick={() => setExpandedId(expanded ? null : patient.id)}
                  >
                    <TableCell className="px-4 py-4 align-top sm:px-5">
                      <p className="font-ui text-ui-body font-semibold text-black">
                        {patient.displayName}
                      </p>
                      <p className={cn(DATA_LABEL, 'mt-0.5 text-black/40')}>
                        {patient.age} · {patient.recordId}
                      </p>
                    </TableCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <MetricCell cell={patient.sleepEfficiency} />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <MetricCell cell={patient.remLatency} />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <MetricCell cell={patient.pth} />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <MetricCell cell={patient.d3Timing} />
                    </TableDataCell>
                  </TableRow>
                  {expanded ? (
                    <TableRow key={`${patient.id}-detail`} className="border-b border-black/5 bg-neutral-50/80">
                      <TableCell colSpan={5} className="px-4 py-4 sm:px-5">
                        <p className="font-ui text-ui-sm leading-relaxed text-black/75">
                          {patient.clinicalRead}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <FlagBadge
                            label={patient.action}
                            severity={
                              patient.sleepEfficiency.status === 'red' ||
                              patient.remLatency.status === 'red' ||
                              patient.pth.status === 'red'
                                ? 'red'
                                : patient.sleepEfficiency.status === 'green' &&
                                    patient.remLatency.status === 'green' &&
                                    patient.pth.status === 'green'
                                  ? 'green'
                                  : 'amber'
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <p className={cn(DATA_LABEL, 'mt-2 text-black/40')}>
        Tap a row for clinical read. Sleep columns refresh after each TipTraQ block; PTH updates on
        90-day draw; D3 timing from daily DINA confirmations.
      </p>
    </section>
  )
}
