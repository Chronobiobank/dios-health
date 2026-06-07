import Link from 'next/link'

import { DATA_LABEL, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { FlagBadge } from '@/components/ui/flag-badge'
import { StatusDot } from '@/components/ui/status-dot'
import {
  Table,
  TableBody,
  TableDataCell,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DemoClinicPatient } from '@/lib/clinic/demo-patients'
import { CLINIC_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

type AllPatientsTableProps = {
  patients: DemoClinicPatient[]
}

function patientTriageStatus(patient: DemoClinicPatient): 'red' | 'amber' | 'green' {
  if (patient.status === 'On track') return 'green'
  if (patient.status === 'Act now') return 'red'
  return 'amber'
}

function mluxTone(score: number): string {
  if (score < 100) return 'text-status-red'
  if (score < 250) return 'text-status-amber'
  return 'text-status-green'
}

function adherenceTone(rate: number): string {
  if (rate >= 90) return 'text-status-green'
  if (rate >= 70) return 'text-status-amber'
  return 'text-status-red'
}

function confidenceSeverity(
  layer: DemoClinicPatient['layerConfidence']
): 'green' | 'blue' | 'amber' {
  if (layer === 'CONFIRMED') return 'green'
  if (layer === 'PRECISION') return 'blue'
  return 'amber'
}

export function AllPatientsTable({ patients }: AllPatientsTableProps) {
  return (
    <section className="mt-10">
      <h2 className={SECTION_LABEL}>All patients ({patients.length})</h2>

      <div className="mt-4 overflow-x-auto rounded-2xl border-[0.5px] border-black/[0.08] bg-white">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-b border-black/10 bg-neutral-50">
              <TableHead className="px-4 py-3 sm:px-5">Patient</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Status</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">MLux</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Finding</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Adherence</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">DINA</TableHead>
              <TableHead className="px-4 py-3 sm:px-5">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} className="border-b border-black/5 last:border-0">
                <TableCell className="px-4 py-4 sm:px-5">
                  <Link
                    href={CLINIC_ROUTES.patient(patient.id)}
                    className="font-medium text-black hover:underline"
                  >
                    {patient.displayName}
                  </Link>
                  <p className="mt-0.5 font-mono text-data-sm text-black/40">{patient.chronotype}</p>
                </TableCell>

                <TableCell className="px-4 py-4 sm:px-5">
                  <StatusDot status={patientTriageStatus(patient)} showLabel />
                </TableCell>

                <TableDataCell className="px-4 py-4 sm:px-5">
                  <p className={cn('font-semibold', mluxTone(patient.mluxScore))}>
                    {patient.mluxScore}
                  </p>
                  <p className={cn(DATA_LABEL, 'text-black/35')}>m-EDI lux</p>
                </TableDataCell>

                <TableCell className="px-4 py-4 text-ui-body text-black/70 sm:px-5">
                  {patient.finding}
                </TableCell>

                <TableDataCell className="px-4 py-4 sm:px-5">
                  <p className={cn('font-semibold', adherenceTone(patient.adherenceRate))}>
                    {patient.adherenceRate}%
                  </p>
                  <p className={cn(DATA_LABEL, 'text-black/35')}>
                    {patient.vayaSessionsLast30}/30 days
                  </p>
                </TableDataCell>

                <TableCell className="px-4 py-4 sm:px-5">
                  <p className="font-mono text-data-sm tabular-nums text-black/50">
                    {patient.lastSessionHoursAgo}h ago
                  </p>
                  <FlagBadge
                    label={patient.layerConfidence}
                    severity={confidenceSeverity(patient.layerConfidence)}
                  />
                </TableCell>

                <TableCell className="px-4 py-4 sm:px-5">
                  <Link
                    href={CLINIC_ROUTES.patient(patient.id)}
                    className="font-ui text-ui-body font-medium text-black hover:underline"
                  >
                    Review →
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
