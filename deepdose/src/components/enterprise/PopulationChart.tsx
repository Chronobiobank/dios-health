import type { Distribution } from '@/lib/chronobiobank/records'

type PopulationChartProps = {
  title: string
  data: Distribution[]
  /** Map a raw code/label to a friendlier display label. */
  formatLabel?: (label: string) => string
  emptyHint?: string
}

export function PopulationChart({ title, data, formatLabel, emptyHint }: PopulationChartProps) {
  const max = data.reduce((m, d) => Math.max(m, d.count), 0)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <section className="seco-app-card" aria-label={title}>
      <h2 className="seco-app-card__title">{title}</h2>
      {data.length === 0 ? (
        <p className="text-sm text-ink-faint">{emptyHint ?? 'No records yet.'}</p>
      ) : (
        <ul className="cbb-chart">
          {data.map((row) => {
            const pct = max > 0 ? Math.round((row.count / max) * 100) : 0
            const share = total > 0 ? Math.round((row.count / total) * 100) : 0
            return (
              <li key={row.label} className="cbb-chart__row">
                <span className="cbb-chart__label">
                  {formatLabel ? formatLabel(row.label) : row.label}
                </span>
                <span className="cbb-chart__track" aria-hidden="true">
                  <span className="cbb-chart__fill" style={{ width: `${pct}%` }} />
                </span>
                <span className="cbb-chart__value">
                  {row.count}
                  <span className="cbb-chart__share"> · {share}%</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
