import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { requireEnterprise } from '@/lib/chronobiobank/require-enterprise'
import { CHI_ABBREV } from '@/lib/circadian/chi'
import { activeLicenses } from '@/lib/chronobiobank/enterprise-access'
import { fetchChronobiobankRecords, computeAggregates } from '@/lib/chronobiobank/records'
import { PopulationChart } from '@/components/enterprise/PopulationChart'

export const dynamic = 'force-dynamic'

function fmt(value: number | null): string {
  return value == null ? '—' : String(value)
}

export default async function EnterpriseDashboardPage() {
  const { supabase, context } = await requireEnterprise('/enterprise/dashboard')
  const active = activeLicenses(context)
  const orgName = context.orgs[0]?.name ?? 'Your organisation'

  if (active.length === 0) {
    return (
      <div className="space-y-8">
        <header>
          <p className="seco-page__eyebrow">Chronobiobank</p>
          <h1 className="seco-app-section-title">{orgName}</h1>
        </header>
        <section className="seco-app-card">
          <h2 className="seco-app-card__title">No active data license</h2>
          <p className="text-sm text-ink-faint">
            Your organisation does not currently hold an active Chronobiobank license. Contact{' '}
            {DEEPDOSE_NAME} to license a population cohort for analytics.
          </p>
        </section>
      </div>
    )
  }

  const records = await fetchChronobiobankRecords(supabase)
  const aggregates = computeAggregates(records)

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Chronobiobank</p>
        <h1 className="seco-app-section-title">Population overview</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {orgName} · {active.length} active license{active.length === 1 ? '' : 's'}. Pseudonymised,
          consent-gated cohort data — no identifiable patient records.
        </p>
      </header>

      <section className="cbb-kpi-grid" aria-label="Cohort summary">
        <Kpi label="Contributed records" value={aggregates.totalRecords} />
        <Kpi label="Unique participants" value={aggregates.uniqueCohorts} />
        <Kpi label={CHI_ABBREV} value={fmt(aggregates.meanCircadianScore)} />
        <Kpi
          label="Mean timing shift"
          value={aggregates.meanTimingShiftMinutes == null ? '—' : `${aggregates.meanTimingShiftMinutes} min`}
        />
      </section>

      <div className="cbb-chart-grid">
        <PopulationChart
          title="Chronotype distribution"
          data={aggregates.chronotypeDistribution}
          emptyHint="No contributed records yet — cohort fills as consenting patients act on recommendations."
        />
        <PopulationChart title="By age band" data={aggregates.ageBandDistribution} />
      </div>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="cbb-kpi">
      <span className="cbb-kpi__value">{value}</span>
      <span className="cbb-kpi__label">{label}</span>
    </div>
  )
}
