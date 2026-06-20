import { requireEnterprise } from '@/lib/chronobiobank/require-enterprise'
import { activeLicenses } from '@/lib/chronobiobank/enterprise-access'
import { fetchChronobiobankRecords } from '@/lib/chronobiobank/records'
import { CohortBuilder } from '@/components/enterprise/CohortBuilder'

export const dynamic = 'force-dynamic'

function uniqueSorted(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort()
}

export default async function EnterpriseCohortsPage() {
  const { supabase, context } = await requireEnterprise('/enterprise/dashboard/cohorts')
  const active = activeLicenses(context)

  if (active.length === 0) {
    return (
      <div className="space-y-8">
        <header>
          <p className="seco-page__eyebrow">Chronobiobank</p>
          <h1 className="seco-app-section-title">Cohort builder</h1>
        </header>
        <section className="seco-app-card">
          <p className="text-sm text-ink-faint">An active data license is required to build cohorts.</p>
        </section>
      </div>
    )
  }

  const records = await fetchChronobiobankRecords(supabase)
  const options = {
    ageBands: uniqueSorted(records.map((r) => r.age_band)),
    biologicalSex: uniqueSorted(records.map((r) => r.biological_sex)),
    chronotypeCats: uniqueSorted(records.map((r) => r.chronotype_cat)),
    medicationCodes: uniqueSorted(records.map((r) => r.medication_code)),
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Chronobiobank</p>
        <h1 className="seco-app-section-title">Cohort builder</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Scope a sub-population and run an aggregate query. Every query is logged against your
          license for audit.
        </p>
      </header>

      <CohortBuilder options={options} />
    </div>
  )
}
