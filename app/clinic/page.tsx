import { Suspense } from 'react'

import { ClinicTopBar } from '@/components/clinic/clinic-top-bar'
import { CohortTriageBoard } from '@/components/clinic/cohort-triage-board'
import { InvitePatientForm } from '@/components/clinic/invite-patient-form'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { getTimeGreeting } from '@/lib/auth/greeting'
import { getClinicianSurname, requireClinicianSession } from '@/lib/auth/require-clinician'
import {
  COHORT_TRIAGE_DEMO_PATIENTS,
  cohortTriageCounts,
} from '@/lib/clinic/cohort-triage-patients'

export default async function ClinicPage() {
  const { user, profile, clinician } = await requireClinicianSession()

  const greeting = getTimeGreeting()
  const surname = getClinicianSurname(profile.full_name ?? 'Clinician', clinician.family_name)
  const patients = COHORT_TRIAGE_DEMO_PATIENTS
  const counts = cohortTriageCounts(patients)

  return (
    <>
      <ClinicTopBar fullName={profile.full_name ?? 'Clinician'} avatarUrl={profile.avatar_url} />

      <section>
        <h1 className={`${DASHBOARD_HEADLINE} capitalize`}>Good {greeting}, Dr {surname}.</h1>
        <p className="mt-2 text-sm text-black/70">
          {counts.red} red · {counts.amber} amber · {counts.green} green — scan red first, then amber,
          then green.
        </p>
      </section>

      <Suspense fallback={<p className="mt-6 text-sm text-black/50">Loading cohort…</p>}>
        <CohortTriageBoard patients={patients} />
      </Suspense>

      <InvitePatientForm clinicianId={user.id} />
    </>
  )
}
