'use client'

import Link from 'next/link'
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
import { PRGC_THRESHOLDS } from '@/lib/clinic/prgc-monitoring'
import { PRGC_CADENCE_LINE } from '@/lib/product/intelligence-cadence'
import {
  protocolLabel,
  type SecopeuticDemoPatient,
  zoneLabel,
  zoneSeverity,
} from '@/lib/secopeutic/demo-cohort'
import { cn } from '@/lib/utils'

type SecopeuticCohortTableProps = {
  patients: SecopeuticDemoPatient[]
}

function MetricValue({
  value,
  status,
}: {
  value: string
  status: 'green' | 'amber' | 'red'
}) {
  return (
    <span
      className={cn(
        'font-mono text-data-md font-semibold tabular-nums',
        status === 'green' && 'text-status-green',
        status === 'amber' && 'text-status-amber',
        status === 'red' && 'text-status-red'
      )}
    >
      {value}
    </span>
  )
}

export function SecopeuticCohortTable({ patients }: SecopeuticCohortTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(patients[0]?.id ?? null)

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={SECTION_LABEL}>Active cohort</h2>
          <p className="mt-1 max-w-2xl font-ui text-ui-sm leading-relaxed text-black/60">
            {PRGC_CADENCE_LINE} City Labs ingested · TipTraQ blocks clinician-ordered.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border-[0.5px] border-black/[0.08] bg-white">
        <Table className="min-w-[880px]">
          <TableHeader>
            <TableRow className="border-b border-black/10 bg-neutral-50">
              <TableHead className="px-4 py-3 sm:px-5">Patient</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Protocol</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Safety</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Sleep</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">PTH</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Timing</TableHead>
              <TableHead className="px-4 py-3 sm:px-5" />
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
                      <p className="mt-1 font-ui text-ui-sm text-black/55">{patient.indication}</p>
                    </TableCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <FlagBadge label={protocolLabel(patient.protocol)} severity="blue" />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <FlagBadge
                        label={zoneLabel(patient.safetyZone)}
                        severity={zoneSeverity(patient.safetyZone)}
                      />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <MetricValue
                        value={patient.sleepEfficiency.value}
                        status={patient.sleepEfficiency.status}
                      />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <MetricValue value={patient.pth.value} status={patient.pth.status} />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <MetricValue
                        value={patient.d3Timing.value}
                        status={patient.d3Timing.status}
                      />
                    </TableDataCell>
                    <TableDataCell className="px-4 py-4 align-top sm:px-5">
                      <Link
                        href={`/secopeutic/demo/patients/${patient.id}`}
                        className="font-ui text-ui-sm font-medium text-[#185fa5] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open →
                      </Link>
                    </TableDataCell>
                  </TableRow>
                  {expanded ? (
                    <TableRow className="border-b border-black/5 bg-neutral-50/80">
                      <TableCell colSpan={7} className="px-4 py-4 sm:px-5">
                        <p className="font-ui text-ui-sm leading-relaxed text-black/75">
                          {patient.clinicalRead}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <FlagBadge label={patient.action} severity={zoneSeverity(patient.responseZone)} />
                          <span className={cn(DATA_LABEL, 'text-black/45')}>
                            Hibernation lag {patient.hibernationBurdenWeeks} wk · Window{' '}
                            {patient.windowAlignmentPct}%
                          </span>
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
        Illustrative demo data only. Targets: sleep &gt;{PRGC_THRESHOLDS.sleepEfficiency.target}% · REM
        &lt;{PRGC_THRESHOLDS.remLatencyMins.target} min · PTH &lt;
        {PRGC_THRESHOLDS.pthPgMl.suppressedBelow} pg/mL.
      </p>
    </section>
  )
}
