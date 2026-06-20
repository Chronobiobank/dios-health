import type { DataLicense } from '@/lib/chronobiobank/enterprise-access'

const LICENSE_LABELS: Record<string, string> = {
  icb_population: 'ICB population analytics',
  pharma_rd: 'Pharmaceutical R&D',
  academic: 'Academic research',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  expired: 'Expired',
  suspended: 'Suspended',
}

export type AccessLogEntry = {
  id: string
  query_hash: string | null
  record_count: number | null
  accessed_at: string | null
}

function formatFee(fee: number | null): string {
  if (fee == null) return '—'
  return `£${Number(fee).toLocaleString('en-GB')}/yr`
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function LicensingStatus({
  licenses,
  accessLog,
}: {
  licenses: DataLicense[]
  accessLog: AccessLogEntry[]
}) {
  return (
    <div className="space-y-8">
      <section className="seco-app-card" aria-label="Data licenses">
        <h2 className="seco-app-card__title">Data licenses</h2>
        {licenses.length === 0 ? (
          <p className="text-sm text-ink-faint">
            No data licenses on file. Contact DeepDose to license a cohort.
          </p>
        ) : (
          <ul className="cbb-license-list">
            {licenses.map((license) => (
              <li key={license.id} className="cbb-license">
                <div className="cbb-license__head">
                  <span className="cbb-license__type">
                    {LICENSE_LABELS[license.license_type ?? ''] ?? license.license_type ?? 'License'}
                  </span>
                  <span className={`cbb-badge cbb-badge--${license.status}`}>
                    {STATUS_LABELS[license.status] ?? license.status}
                  </span>
                </div>
                <dl className="cbb-license__meta">
                  <div>
                    <dt>Term</dt>
                    <dd>
                      {formatDate(license.start_date)} – {formatDate(license.end_date)}
                    </dd>
                  </div>
                  <div>
                    <dt>Annual fee</dt>
                    <dd>{formatFee(license.annual_fee_gbp)}</dd>
                  </div>
                  <div>
                    <dt>Purposes</dt>
                    <dd>{license.purpose_codes?.join(', ') || '—'}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="seco-app-card" aria-label="Access log">
        <h2 className="seco-app-card__title">Query access log</h2>
        <p className="mb-4 text-sm text-ink-faint">
          Every licensed cohort query is recorded immutably for audit.
        </p>
        {accessLog.length === 0 ? (
          <p className="text-sm text-ink-faint">No queries run yet.</p>
        ) : (
          <ul className="cbb-log">
            {accessLog.map((entry) => (
              <li key={entry.id} className="cbb-log__row">
                <span className="cbb-log__hash">{entry.query_hash ?? '—'}</span>
                <span className="cbb-log__count">{entry.record_count ?? 0} records</span>
                <span className="cbb-log__time">{formatDate(entry.accessed_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
