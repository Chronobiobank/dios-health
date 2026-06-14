import { FulfillmentOrdersView } from '@/components/fulfillment/fulfillment-orders-view'
import { PatientFulfillmentWidgets } from '@/components/fulfillment/patient-fulfillment-widgets'
import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { Section } from '@/components/patient-dashboard/section'
import { resolveDashboardAvatar } from '@/components/patient-dashboard/constants'
import { getLocalizedPatientGreeting, getPatientFirstName } from '@/lib/auth/greeting'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { getPatientFulfillmentSummary } from '@/lib/fulfillment/service'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Protocol orders — DIOS',
  description: 'Protocol-linked tests, assessments, and supplements.',
}

export default async function PatientOrdersPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()
  const summary = await getPatientFulfillmentSummary(supabase, user.id)

  const firstName = getPatientFirstName({
    firstName: profile.full_name,
    fullName: profile.full_name,
  })
  const greeting = getLocalizedPatientGreeting(
    firstName,
    patient.location_city,
    patient.location_country
  )
  const avatarUrl = resolveDashboardAvatar(profile.avatar_url)

  return (
    <div className="patient-dashboard-shell relative min-h-screen pb-[var(--patient-nav-offset)] md:pb-0">
      <main className="dash-dashboard-main">
        <DashboardNav
          greeting={greeting}
          fullName={profile.full_name ?? 'Patient'}
          avatarUrl={avatarUrl}
        />
        <Section label="Protocol fulfillment">
        <p className="dash-sub max-w-[44ch]">
          Order tests, sleep assessments, and supplements required by your active protocol.
        </p>
        {summary.requirements.length === 0 ? (
          <p className="fulfillment-panel__sub mt-3">
            No active protocol on file yet. Your clinician will assign a protocol before
            requirements appear here.
          </p>
        ) : null}
          <PatientFulfillmentWidgets summary={summary} />
          <FulfillmentOrdersView summary={summary} patientProfileId={user.id} />
        </Section>
      </main>
    </div>
  )
}
