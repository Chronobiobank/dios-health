import Link from 'next/link'

import { FlagBadge } from '@/components/ui/flag-badge'
import { DATA_LABEL, DASHBOARD_HEADLINE, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import {
  protocolLabel,
  type SecopeuticDemoPatient,
  zoneLabel,
  zoneSeverity,
} from '@/lib/secopeutic/demo-cohort'
import { cn } from '@/lib/utils'

type SecopeuticPatientDetailProps = {
  patient: SecopeuticDemoPatient
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function MetricCard({
  label,
  value,
  status,
  sub,
}: {
  label: string
  value: string
  status: 'green' | 'amber' | 'red'
  sub?: string
}) {
  return (
    <div className="secopeutic-metric-card">
      <p className={DATA_LABEL}>{label}</p>
      <p
        className={cn(
          'mt-1 font-mono text-2xl font-semibold tabular-nums',
          status === 'green' && 'text-status-green',
          status === 'amber' && 'text-status-amber',
          status === 'red' && 'text-status-red'
        )}
      >
        {value}
      </p>
      {sub ? <p className="mt-1 font-ui text-ui-sm text-black/55">{sub}</p> : null}
    </div>
  )
}

export function SecopeuticPatientDetail({ patient }: SecopeuticPatientDetailProps) {
  const latest = patient.labHistory[0]

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 pb-16 sm:px-6">
      <Link href="/secopeutic/demo" className="font-ui text-ui-sm text-black/50 hover:text-black">
        ← Cohort
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={DATA_LABEL}>Illustrative record · {patient.recordId}</p>
          <h1 className={`${DASHBOARD_HEADLINE} mt-1`}>{patient.displayName}</h1>
          <p className="mt-2 max-w-xl font-ui text-ui-sm text-black/65">{patient.indication}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FlagBadge label={protocolLabel(patient.protocol)} severity="blue" />
          <FlagBadge
            label={`Safety · ${zoneLabel(patient.safetyZone)}`}
            severity={zoneSeverity(patient.safetyZone)}
          />
          <FlagBadge
            label={`Response · ${zoneLabel(patient.responseZone)}`}
            severity={zoneSeverity(patient.responseZone)}
          />
        </div>
      </div>

      <section className="secopeutic-panel mt-8">
        <h2 className={SECTION_LABEL}>Secological response index</h2>
        <p className="mt-1 font-ui text-ui-sm text-black/60">
          Clinician-interpreted composite. Hibernation burden and window alignment between City Labs
          draws.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Response index"
            value={`${patient.secologicalResponseIndex}`}
            status={
              patient.responseZone === 'stable'
                ? 'green'
                : patient.responseZone === 'review'
                  ? 'amber'
                  : 'red'
            }
            sub={`Calendar age ${patient.calendarAge}`}
          />
          <MetricCard
            label="Hibernation lag"
            value={`${patient.hibernationBurdenWeeks} wk`}
            status={
              patient.hibernationBurdenWeeks <= 2
                ? 'green'
                : patient.hibernationBurdenWeeks <= 4
                  ? 'amber'
                  : 'red'
            }
            sub={
              patient.hibernationPriorWeeks
                ? `was ${patient.hibernationPriorWeeks} wk`
                : 'Sleep architecture debt'
            }
          />
          <MetricCard
            label="Window alignment"
            value={`${patient.windowAlignmentPct}%`}
            status={
              patient.windowAlignmentPct >= 90
                ? 'green'
                : patient.windowAlignmentPct >= 70
                  ? 'amber'
                  : 'red'
            }
            sub="Morning D3 confirmations · last 30 days"
          />
          <MetricCard
            label="REM latency"
            value={patient.remLatency.value}
            status={patient.remLatency.status}
            sub={patient.remLatency.hint}
          />
        </div>
      </section>

      <section className="secopeutic-panel mt-6">
        <h2 className={SECTION_LABEL}>Four-pathway readout</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Sleep efficiency"
            value={patient.sleepEfficiency.value}
            status={patient.sleepEfficiency.status}
            sub={patient.sleepEfficiency.hint}
          />
          <MetricCard
            label="PTH"
            value={patient.pth.value}
            status={patient.pth.status}
            sub={patient.pth.hint}
          />
          <MetricCard
            label="D3 timing"
            value={patient.d3Timing.value}
            status={patient.d3Timing.status}
            sub={patient.d3Timing.hint}
          />
          <MetricCard
            label="Next City Labs draw"
            value={formatDate(patient.nextPanelDue)}
            status="green"
            sub={`Last ${formatDate(patient.lastCityLabsDraw)}`}
          />
        </div>
        <p className="mt-4 font-ui text-ui-sm leading-relaxed text-black/75">{patient.clinicalRead}</p>
        <div className="mt-3">
          <FlagBadge label={patient.action} severity={zoneSeverity(patient.responseZone)} />
        </div>
      </section>

      <section className="secopeutic-panel mt-6">
        <h2 className={SECTION_LABEL}>Safety gate</h2>
        <p className="mt-1 font-ui text-ui-sm text-black/60">{patient.safetySummary}</p>
        {latest ? (
          <div className="mt-4 overflow-x-auto">
            <table className="secopeutic-lab-table">
              <thead>
                <tr>
                  <th>Drawn</th>
                  <th>PTH</th>
                  <th>25-OH-D</th>
                  <th>Ca</th>
                  <th>Urine Ca</th>
                  <th>eGFR</th>
                  <th>B12</th>
                </tr>
              </thead>
              <tbody>
                {patient.labHistory.map((row) => (
                  <tr key={row.drawnAt}>
                    <td>{formatDate(row.drawnAt)}</td>
                    <td>{row.pthPgMl} pg/mL</td>
                    <td>{row.vitaminDNmol} nmol/L</td>
                    <td>{row.calciumMmol} mmol/L</td>
                    <td>{row.urinaryCalciumMg ?? '—'} mg</td>
                    <td>{row.egfr}</td>
                    <td>{row.b12Pmol ?? '—'} pmol/L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="secopeutic-panel mt-6">
        <h2 className={SECTION_LABEL}>Data streams</h2>
        <ul className="mt-3 space-y-2 font-ui text-ui-sm text-black/70">
          <li>
            City Labs panel — last draw {formatDate(patient.lastCityLabsDraw)}
          </li>
          <li>
            TipTraQ block —{' '}
            {patient.lastTipTraqBlock
              ? `last block ${formatDate(patient.lastTipTraqBlock)}`
              : 'not ordered'}
          </li>
          <li>Dose intelligence — daily window log via Secopeutic Link</li>
        </ul>
      </section>

      <p className={cn(DATA_LABEL, 'mt-8 text-black/40')}>
        Illustrative demo only. Platform flags and exports — clinician owns all treatment decisions.
      </p>
    </div>
  )
}
