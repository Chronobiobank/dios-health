import { DEEPDOSE_PRODUCT_MANDATE } from '@/lib/unmed/product-philosophy'
import type { TriFocalStatusModel } from '@/lib/unmed/tri-focal-types'
import { cn } from '@/lib/utils/cn'

type BiochemicalTriFocalDashboardProps = {
  model: TriFocalStatusModel
}

function toneClass(tone: 'optimal' | 'warning' | 'critical'): string {
  if (tone === 'optimal') return 'deepdose-tri__tone--optimal'
  if (tone === 'warning') return 'deepdose-tri__tone--warning'
  return 'deepdose-tri__tone--critical'
}

export function BiochemicalTriFocalDashboard({ model }: BiochemicalTriFocalDashboardProps) {
  return (
    <main className="deepdose-tri">
      <header className="deepdose-tri__head">
        <div>
          <span className="deepdose-tri__id font-mono tabular-nums">Federated ID: {model.federatedId}</span>
          <h2 className="deepdose-tri__title">Biochemical status</h2>
          <p className="deepdose-tri__mandate">{DEEPDOSE_PRODUCT_MANDATE.designMandate}</p>
        </div>
        {model.syncLocked ? (
          <div className="deepdose-tri__sync-badge">
            <span className="deepdose-tri__sync-dot" aria-hidden />
            Safe sync locked
          </div>
        ) : null}
      </header>

      <section className="dios-glass-outer deepdose-tri__pillar">
        <header className="deepdose-tri__pillar-head">
          <span className="deepdose-tri__eyebrow">Pillar 1: Passive smartphone telemetry</span>
          <h3 className="deepdose-tri__pillar-title">Sleep Regularity Index (SRI)</h3>
        </header>
        <div className="deepdose-tri__sri-grid">
          {model.sriDials.map((dial) => (
            <div key={dial.label} className="dios-glass-inner deepdose-tri__sri-box">
              <span className="deepdose-tri__sri-label">{dial.label}</span>
              <strong className={cn('deepdose-tri__sri-value font-mono tabular-nums', toneClass(dial.tone))}>
                {dial.value != null ? Math.round(dial.value) : '—'}
              </strong>
            </div>
          ))}
        </div>
        <p className="deepdose-tri__note">{model.sriNote}</p>
      </section>

      <section className="dios-glass-outer deepdose-tri__pillar">
        <header className="deepdose-tri__pillar-head">
          <span className="deepdose-tri__eyebrow">Pillar 2: Hardware verification</span>
          <h3 className="deepdose-tri__pillar-title">TipTraQ sensor stream</h3>
        </header>
        {model.tiptraqPending ? (
          <p className="deepdose-tri__note">Three nights on TipTraQ unlock hardware-verified breathing metrics.</p>
        ) : (
          <div className="deepdose-tri__metric-row">
            {model.tiptraqMetrics.map((metric) => (
              <div
                key={metric.label}
                className={cn('dios-glass-inner deepdose-tri__metric', `deepdose-tri__metric--${metric.tone}`)}
              >
                <span className="deepdose-tri__metric-label">{metric.label}</span>
                <strong className="deepdose-tri__metric-value font-mono tabular-nums">{metric.value}</strong>
                <span className={cn('deepdose-tri__metric-status', toneClass(metric.tone))}>
                  {metric.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dios-glass-outer deepdose-tri__pillar">
        <header className="deepdose-tri__pillar-head">
          <span className="deepdose-tri__eyebrow">Pillar 3: Biochemical biomarkers</span>
          <h3 className="deepdose-tri__pillar-title">City Lab verification assay</h3>
        </header>
        <table className="deepdose-tri__lab-table">
          <thead>
            <tr>
              <th>Biomarker</th>
              <th>Value</th>
              <th>Metabolic state</th>
            </tr>
          </thead>
          <tbody>
            {model.labRows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td className="font-mono tabular-nums">{row.value}</td>
                <td className={cn('deepdose-tri__lab-state', toneClass(row.tone))}>{row.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {model.labPending ? (
          <p className="deepdose-tri__note">L2 blood panel results appear here when your clinician orders a City Lab assay.</p>
        ) : null}
      </section>

      <footer className="dios-glass-inner deepdose-tri__principle">
        <p>
          <strong>System operational principle</strong>
          {DEEPDOSE_PRODUCT_MANDATE.exitPrinciple}
        </p>
      </footer>
    </main>
  )
}
