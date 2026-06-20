import { requireEnterprise } from '@/lib/chronobiobank/require-enterprise'

export const dynamic = 'force-dynamic'

const ORG_TYPE_LABELS: Record<string, string> = {
  gp_practice: 'GP practice',
  icb: 'Integrated Care Board',
  pharma: 'Pharmaceutical',
  research: 'Research institution',
}

export default async function EnterpriseSettingsPage() {
  const { context } = await requireEnterprise('/enterprise/settings')

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Chronobiobank</p>
        <h1 className="seco-app-section-title">Organisation settings</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your organisations and the isolation policy governing Chronobiobank access.
        </p>
      </header>

      <section className="seco-app-card" aria-label="Organisations">
        <h2 className="seco-app-card__title">Organisations</h2>
        {context.orgs.length === 0 ? (
          <p className="text-sm text-ink-faint">You are not a member of any organisation.</p>
        ) : (
          <ul className="cbb-org-list">
            {context.orgs.map((org) => (
              <li key={org.id} className="cbb-org">
                <span className="cbb-org__name">{org.name}</span>
                <span className="cbb-org__type">{ORG_TYPE_LABELS[org.org_type] ?? org.org_type}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="seco-app-card" aria-label="Data isolation policy">
        <h2 className="seco-app-card__title">Data isolation policy</h2>
        <ul className="cbb-policy">
          <li>Records are pseudonymised — no patient identifiers, only coarse attributes.</li>
          <li>Access is gated by an active data license, enforced at the database layer.</li>
          <li>Cohorts below the minimum size are suppressed to prevent re-identification.</li>
          <li>Raw scoring weights, baselines, and training models are never exposed.</li>
          <li>Every cohort query is written to an immutable audit log.</li>
        </ul>
      </section>
    </div>
  )
}
