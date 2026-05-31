import Link from 'next/link'

import {
  PatientProfilePanel,
  type PatientProfileDemographics,
} from '@/components/dashboard/patient-profile-panel'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export default async function DashboardProfilePage() {
  const { user, profile, patient } = await requirePatientSession()

  const demographics: PatientProfileDemographics = {
    fitzpatrickType: patient.fitzpatrick_type,
    locationCity: patient.location_city ?? '',
    locationCountry: patient.location_country ?? 'United Kingdom',
    shiftWorker: patient.shift_worker,
    shiftPattern: patient.shift_pattern ?? '',
    chronotypeQ1: patient.chronotype_q1 ?? '',
    chronotypeQ2: patient.chronotype_q2 ?? '',
    chronotypeQ3: patient.chronotype_q3 ?? '',
  }

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />

      <section>
        <Link
          href={PATIENT_ROUTES.dataControls}
          className="font-mono text-[11px] text-black/45 transition-colors hover:text-black"
        >
          ← Settings
        </Link>
        <h1 className="mt-3 text-2xl font-medium text-black">Profile</h1>
        <p className="mt-2 text-sm text-black/55">
          Update your demographic details. Each change saves immediately.
        </p>
      </section>

      <div className="mt-8">
        <PatientProfilePanel patientId={user.id} initial={demographics} />
      </div>
    </>
  )
}
