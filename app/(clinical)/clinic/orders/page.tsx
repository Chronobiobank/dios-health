import { ClinicianFulfillmentWidgets } from '@/components/fulfillment/clinician-fulfillment-widgets'
import { ClinicTopBar } from '@/components/clinic/clinic-top-bar'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { requireClinicianSession } from '@/lib/auth/require-clinician'
import { fetchClinicCohort } from '@/lib/clinic/fetch-clinic-cohort'
import { buildClinicianFulfillmentSummary } from '@/lib/fulfillment/service'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Protocol fulfillment — DIOS clinic',
}

export default async function ClinicOrdersPage() {
  const { user, profile } = await requireClinicianSession()
  const supabase = await createClient()
  const cohort = await fetchClinicCohort(supabase, user.id)

  const summary = buildClinicianFulfillmentSummary(
    cohort.entries.map((entry) => ({
      ref: entry.prgc.recordId,
      name: entry.prgc.displayName,
      protocol: entry.protocol,
    }))
  )

  return (
    <>
      <ClinicTopBar fullName={profile.full_name ?? 'Clinician'} avatarUrl={profile.avatar_url} />
      <section>
        <h1 className={DASHBOARD_HEADLINE}>Protocol fulfillment</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/70">
          Cohort tasks for protocol-linked tests, TipTraQ blocks, and supplement reorders.
        </p>
      </section>
      <ClinicianFulfillmentWidgets summary={summary} />
    </>
  )
}
