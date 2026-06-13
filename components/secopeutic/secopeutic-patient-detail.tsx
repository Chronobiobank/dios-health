import Link from 'next/link'

import {
  protocolLabel,
  type SecopeuticDemoPatient,
  zoneLabel,
  zoneSeverity,
} from '@/lib/secopeutic/demo-cohort'
import { SECOPUTIC_DEMO_PATH } from '@/lib/secopeutic/site'
import { cn } from '@/lib/utils'

type SecopeuticPatientDetailProps = {
  patient: SecopeuticDemoPatient
}

type MetricStatus = 'green' | 'amber' | 'red'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusPill({
  label,
  severity,
}: {
  label: string
  severity: MetricStatus | 'blue'
}) {
  return (
    <span
      className={cn(
        'seco-record__pill',
        severity === 'green' && 'seco-record__pill--green',
        severity === 'amber' && 'seco-record__pill--amber',
        severity === 'red' && 'seco-record__pill--red',
        severity === 'blue' && 'seco-record__pill--blue'
      )}
    >
      {label}
    </span>
  )
}

function KpiTile({
  label,
  value,
  status,
  hint,
  prior,
  large,
}: {
  label: string
  value: string
  status: MetricStatus
  hint?: string
  prior?: string
  large?: boolean
}) {
  return (
    <div className={cn('seco-record__kpi', large && 'seco-record__kpi--large')}>
      <p className="seco-record__kpi-label">{label}</p>
      <p
        className={cn(
          'seco-record__kpi-value',
          status === 'green' && 'seco-record__kpi-value--green',
          status === 'amber' && 'seco-record__kpi-value--amber',
          status === 'red' && 'seco-record__kpi-value--red'
        )}
      >
        {value}
      </p>
      {prior ? <p className="seco-record__kpi-prior">was {prior}</p> : null}
      {hint ? <p className="seco-record__kpi-hint">{hint}</p> : null}
    </div>
  )
}

export function SecopeuticPatientDetail({ patient }: SecopeuticPatientDetailProps) {
  const latestLab = patient.labHistory[patient.labHistory.length - 1]
  const responseSeverity = zoneSeverity(patient.responseZone)
  const tiptraqOnly = patient.profileScope === 'tiptraq-demographics'

  return (
    <div className="seco-demo-workspace seco-record">
      <Link href={SECOPUTIC_DEMO_PATH} className="seco-demo-back">
        ← Cohort dashboard
      </Link>

      <header className="seco-record__header">
        <div className="seco-record__identity">
          <p className="seco-record__eyebrow">
            {patient.recordId} · {patient.age} · {protocolLabel(patient.protocol)}
          </p>
          <h1 className="seco-record__name">{patient.displayName}</h1>
          <p className="seco-record__indication">{patient.indication}</p>
          {patient.demographics ? (
            <p className="seco-record__demographics">
              {patient.demographics.city}, {patient.demographics.country} · Fitzpatrick{' '}
              {patient.demographics.fitzpatrickType} · DOB{' '}
              {formatDate(patient.demographics.dateOfBirth)}
            </p>
          ) : null}
        </div>
        <div className="seco-record__status">
          <StatusPill label={`Safety · ${zoneLabel(patient.safetyZone)}`} severity={zoneSeverity(patient.safetyZone)} />
          <StatusPill
            label={`Response · ${zoneLabel(patient.responseZone)}`}
            severity={responseSeverity}
          />
        </div>
      </header>

      <section
        className="seco-record__strip"
        aria-label={tiptraqOnly ? 'TipTraQ readout' : 'Four-pathway readout'}
      >
        <p className="seco-record__strip-label">
          {tiptraqOnly ? 'TipTraQ readout' : 'Four-pathway readout'}
        </p>
        <div className="seco-record__strip-grid">
          <KpiTile
            label="Sleep efficiency"
            value={patient.sleepEfficiency.value}
            status={patient.sleepEfficiency.status}
            hint={patient.sleepEfficiency.hint}
            prior={patient.sleepEfficiency.prior}
            large
          />
          <KpiTile
            label="REM latency"
            value={patient.remLatency.value}
            status={patient.remLatency.status}
            hint={patient.remLatency.hint}
            prior={patient.remLatency.prior}
            large
          />
          {tiptraqOnly && patient.tiptraqSleepOnset && patient.tiptraqTotalSleep ? (
            <>
              <KpiTile
                label="Sleep onset"
                value={patient.tiptraqSleepOnset.value}
                status={patient.tiptraqSleepOnset.status}
                hint={patient.tiptraqSleepOnset.hint}
                large
              />
              <KpiTile
                label="Total sleep"
                value={patient.tiptraqTotalSleep.value}
                status={patient.tiptraqTotalSleep.status}
                hint={patient.tiptraqTotalSleep.hint}
                large
              />
            </>
          ) : (
            <>
              <KpiTile
                label="PTH"
                value={patient.pth.value}
                status={patient.pth.status}
                hint={patient.pth.hint}
                prior={patient.pth.prior}
                large
              />
              <KpiTile
                label="D3 timing"
                value={patient.d3Timing.value}
                status={patient.d3Timing.status}
                hint={patient.d3Timing.hint}
                large
              />
            </>
          )}
        </div>
      </section>

      <aside
        className={cn(
          'seco-record__callout',
          responseSeverity === 'green' && 'seco-record__callout--green',
          responseSeverity === 'amber' && 'seco-record__callout--amber',
          responseSeverity === 'red' && 'seco-record__callout--red'
        )}
      >
        <p className="seco-record__callout-label">Clinical read</p>
        <p className="seco-record__callout-text">{patient.clinicalRead}</p>
        <p className="seco-record__callout-action">{patient.action}</p>
      </aside>

      <div className="seco-record__body">
        <section className="seco-record__panel">
          <h2 className="seco-record__panel-title">Dose window inputs</h2>
          <p className="seco-record__panel-sub">
            Mobile diagnostics, blood panels, and TipTraQ set the daily window.
          </p>
          <div className="seco-record__panel-grid">
            <KpiTile
              label="Mobile light panel"
              value={patient.mobileLight.value}
              status={patient.mobileLight.status}
              hint={patient.mobileLight.hint}
            />
            <KpiTile
              label="Blood panel"
              value={patient.bloodPanel.value}
              status={patient.bloodPanel.status}
              hint={patient.bloodPanel.hint}
            />
            <KpiTile
              label="TipTraQ block"
              value={patient.tiptraqBlock.value}
              status={patient.tiptraqBlock.status}
              hint={patient.tiptraqBlock.hint}
            />
            <KpiTile
              label="Dose window"
              value={patient.doseWindowPct === null ? 'Pending' : `${patient.doseWindowPct}%`}
              status={
                patient.doseWindowPct === null
                  ? 'amber'
                  : patient.doseWindowPct >= 90
                    ? 'green'
                    : patient.doseWindowPct >= 70
                      ? 'amber'
                      : 'red'
              }
              hint={
                patient.doseWindowPct === null
                  ? 'Needs phone and blood inputs'
                  : 'Morning D3 confirmations · 30 days'
              }
            />
          </div>
        </section>

        <section className="seco-record__panel">
          <h2 className="seco-record__panel-title">Safety gate</h2>
          <p className="seco-record__panel-sub">{patient.safetySummary}</p>
          {patient.labHistory.length > 0 ? (
            <div className="seco-record__table-wrap">
              <table className="seco-record__table">
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
                  {[...patient.labHistory].reverse().map((row) => (
                    <tr key={row.drawnAt} className={row === latestLab ? 'seco-record__table-row--latest' : undefined}>
                      <td>{formatDate(row.drawnAt)}</td>
                      <td>{row.pthPgMl}</td>
                      <td>{row.vitaminDNmol}</td>
                      <td>{row.calciumMmol}</td>
                      <td>{row.urinaryCalciumMg ?? '—'}</td>
                      <td>{row.egfr}</td>
                      <td>{row.b12Pmol ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="seco-record__table-units">
                PTH pg/mL · 25-OH-D nmol/L · Ca mmol/L · urine Ca mg · B12 pmol/L
              </p>
            </div>
          ) : (
            <p className="seco-record__panel-sub">Blood panel not yet ingested.</p>
          )}
        </section>

        <section className="seco-record__panel seco-record__panel--streams">
          <h2 className="seco-record__panel-title">Input cadence</h2>
          <dl className="seco-record__streams">
            <div>
              <dt>Mobile diagnostics</dt>
              <dd>Monthly melanopic light panel from phone</dd>
            </div>
            <div>
              <dt>City Labs</dt>
              <dd>
                {patient.lastCityLabsDraw
                  ? `Last draw ${formatDate(patient.lastCityLabsDraw)}${
                      patient.nextPanelDue ? ` · Next ${formatDate(patient.nextPanelDue)}` : ''
                    }`
                  : 'No panel on file · order first draw'}
              </dd>
            </div>
            <div>
              <dt>TipTraQ</dt>
              <dd>
                {patient.lastTipTraqBlock
                  ? `Three nights ending ${formatDate(patient.lastTipTraqBlock)}`
                  : 'Block not ordered'}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <p className="seco-record__disclaimer">
        Illustrative demo only. Platform flags and exports — clinician owns all treatment decisions.
      </p>
    </div>
  )
}
