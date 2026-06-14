import { ClinicianFulfillmentWidgets } from '@/components/fulfillment/clinician-fulfillment-widgets'
import { ClinicTopBar } from '@/components/clinic/clinic-top-bar'
import { InvitePatientForm } from '@/components/clinic/invite-patient-form'
import { PrgcMonitoringTable } from '@/components/clinic/prgc-monitoring-table'
import { TipTraqPractitionerBanner } from '@/components/clinic/tiptraq-practitioner-banner'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { getTimeGreeting } from '@/lib/auth/greeting'
import { getClinicianSurname, requireClinicianSession } from '@/lib/auth/require-clinician'
import { fetchClinicCohort } from '@/lib/clinic/fetch-clinic-cohort'
import { buildClinicianFulfillmentSummary } from '@/lib/fulfillment/service'
import { PRGC_CADENCE_LINE } from '@/lib/product/intelligence-cadence'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ClinicPage() {
  const { user, profile, clinician } = await requireClinicianSession()
  const supabase = await createClient()
  const cohort = await fetchClinicCohort(supabase, user.id)

  const greeting = getTimeGreeting()
  const surname = getClinicianSurname(profile.full_name ?? 'Clinician', clinician.family_name)

  const fulfillmentSummary = buildClinicianFulfillmentSummary(
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
        <h1 className={`${DASHBOARD_HEADLINE} capitalize`}>Good {greeting}, Dr {surname}.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/70">
          Is the pRGC system working? Four numbers per patient — {PRGC_CADENCE_LINE}
        </p>
        {cohort.source === 'database' ? (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-black/45">
            Linked patient cohort
          </p>
        ) : (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-black/45">
            Demo cohort — invite patients to populate from triage view
          </p>
        )}
      </section>

      <PrgcMonitoringTable patients={cohort.entries.map((entry) => entry.prgc)} />

      <ClinicianFulfillmentWidgets summary={fulfillmentSummary} />

      <TipTraqPractitionerBanner />

      <InvitePatientForm clinicianId={user.id} />
    </>
  )
}
