import { ClinicianFulfillmentWidgets } from '@/components/fulfillment/clinician-fulfillment-widgets'
import { ClinicTopBar } from '@/components/clinic/clinic-top-bar'
import { InvitePatientForm } from '@/components/clinic/invite-patient-form'
import { PrgcMonitoringTable } from '@/components/clinic/prgc-monitoring-table'
import { TipTraqPractitionerBanner } from '@/components/clinic/tiptraq-practitioner-banner'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { getTimeGreeting } from '@/lib/auth/greeting'
import { getClinicianSurname, requireClinicianSession } from '@/lib/auth/require-clinician'
import { PRGC_MONITORING_PATIENTS } from '@/lib/clinic/prgc-monitoring'
import { buildClinicianFulfillmentSummary } from '@/lib/fulfillment/service'
import { PRGC_CADENCE_LINE } from '@/lib/product/intelligence-cadence'

export default async function ClinicPage() {
  const { user, profile, clinician } = await requireClinicianSession()

  const greeting = getTimeGreeting()
  const surname = getClinicianSurname(profile.full_name ?? 'Clinician', clinician.family_name)

  const fulfillmentSummary = buildClinicianFulfillmentSummary(
    PRGC_MONITORING_PATIENTS.map((p) => ({
      ref: p.recordId,
      name: p.displayName,
      protocol: 'coimbra',
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
      </section>

      <PrgcMonitoringTable patients={PRGC_MONITORING_PATIENTS} />

      <ClinicianFulfillmentWidgets summary={fulfillmentSummary} />

      <TipTraqPractitionerBanner />

      <InvitePatientForm clinicianId={user.id} />
    </>
  )
}
