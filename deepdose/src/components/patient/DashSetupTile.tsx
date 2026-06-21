import Link from 'next/link'
import type { DashSetupRow } from '@/lib/patient/dash-setup-status'

type DashSetupTileProps = {
  rows: DashSetupRow[]
}

const STATUS_CLASS: Record<DashSetupRow['status'], string> = {
  done: 'dash-setup__status--done',
  optional: 'dash-setup__status--optional',
  attention: 'dash-setup__status--attention',
  empty: 'dash-setup__status--empty',
}

export function DashSetupTile({ rows }: DashSetupTileProps) {
  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="dash-setup-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="dash-setup-title" className="dash-meds__section-title">
          Your setup
        </h2>
      </div>

      <ul className="dash-setup__list">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={row.href} className="dash-setup__row">
              <span className="dash-setup__copy min-w-0 flex-1">
                <span className="dash-setup__label">{row.label}</span>
                <span className={`dash-setup__meta ${STATUS_CLASS[row.status]}`}>
                  {row.meta}
                </span>
              </span>
              <span className="dash-setup__chevron" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
