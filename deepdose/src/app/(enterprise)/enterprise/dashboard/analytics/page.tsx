import { requireEnterprise } from '@/lib/chronobiobank/require-enterprise'
import { activeLicenses } from '@/lib/chronobiobank/enterprise-access'
import { fetchChronobiobankRecords, computeAggregates } from '@/lib/chronobiobank/records'
import { PopulationChart } from '@/components/enterprise/PopulationChart'

export const dynamic = 'force-dynamic'

export default async function EnterpriseAnalyticsPage() {
  const { supabase, context } = await requireEnterprise('/enterprise/dashboard/analytics')
  const active = activeLicenses(context)

  if (active.length === 0) {
    return (
      <div className="space-y-8">
        <header>
          <p className="seco-page__eyebrow">Chronobiobank</p>
          <h1 className="seco-app-section-title">Population analytics</h1>
        </header>
        <section className="seco-app-card">
          <p className="text-sm text-ink-faint">An active data license is required to view analytics.</p>
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
        <h1 className="seco-app-section-title">Population analytics</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Aggregate distributions across the licensed cohort. All figures are derived from
          pseudonymised records — raw scoring weights and training models stay isolated.
        </p>
      </header>

      <section className="cbb-stat-grid" aria-label="Headline metrics">
        <Metric label="Mean circadian score" value={fmt(aggregates.meanCircadianScore)} />
        <Metric label="Mean social jet lag" value={fmtUnit(aggregates.meanSjlHours, 'h')} />
        <Metric label="Mean timing shift" value={fmtUnit(aggregates.meanTimingShiftMinutes, 'min')} />
        <Metric label="Outcomes recorded" value={aggregates.outcomesRecorded} />
      </section>

      <div className="cbb-chart-grid">
        <PopulationChart title="Chronotype distribution" data={aggregates.chronotypeDistribution} />
        <PopulationChart title="Age bands" data={aggregates.ageBandDistribution} />
        <PopulationChart title="Biological sex" data={aggregates.sexDistribution} />
        <PopulationChart title="Medications by volume" data={aggregates.medicationDistribution} />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="cbb-stat">
      <span className="cbb-stat__value">{value}</span>
      <span className="cbb-stat__label">{label}</span>
    </div>
  )
}

function fmt(value: number | null): string {
  return value == null ? '—' : String(value)
}

function fmtUnit(value: number | null, unit: string): string {
  return value == null ? '—' : `${value} ${unit}`
}
