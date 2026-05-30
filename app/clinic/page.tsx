import { AllPatientsTable } from '@/components/clinic/all-patients-table'
import { ClinicTopBar } from '@/components/clinic/clinic-top-bar'
import { InvitePatientForm } from '@/components/clinic/invite-patient-form'
import { NeedsActionSection } from '@/components/clinic/needs-action-section'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { getTimeGreeting } from '@/lib/auth/greeting'
import { getClinicianSurname, requireClinicianSession } from '@/lib/auth/require-clinician'
import {
  DEMO_CLINIC_PATIENTS,
  getNeedsActionCount,
  getNeedsActionPatients,
} from '@/lib/clinic/demo-patients'

export default async function ClinicPage() {
  const { user, profile } = await requireClinicianSession()

  const greeting = getTimeGreeting()
  const surname = getClinicianSurname(profile.full_name ?? 'Clinician')
  const patients = DEMO_CLINIC_PATIENTS
  const needsAction = getNeedsActionPatients(patients)
  const needsActionCount = getNeedsActionCount(patients)

  return (
    <>
      <ClinicTopBar fullName={profile.full_name ?? 'Clinician'} />

      <section>
        <h1 className={`${DASHBOARD_HEADLINE} capitalize`}>Good {greeting}, Dr {surname}.</h1>
        <p className="mt-2 text-sm text-black/70">
          {needsActionCount} patient{needsActionCount === 1 ? '' : 's'} need attention today.
        </p>
      </section>

      <NeedsActionSection patients={needsAction} />
      <AllPatientsTable patients={patients} />
      <InvitePatientForm clinicianId={user.id} />
    </>
  )
}
