import Link from 'next/link'

import { DashboardPageTransition } from '@/components/dashboard/dashboard-page-transition'
import {
  PatientIdentityPanel,
  type PatientIdentityValues,
} from '@/components/dashboard/patient-identity-panel'
import {
  PatientProfilePanel,
  type PatientProfileDemographics,
} from '@/components/dashboard/patient-profile-panel'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { ProfileAvatarUpload } from '@/components/profile/profile-avatar-upload'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export const dynamic = 'force-dynamic'

export default async function DashboardProfilePage() {
  const { user, profile, patient } = await requirePatientSession()

  const identity: PatientIdentityValues = {
    firstName: patient.first_name ?? '',
    familyName: patient.family_name ?? '',
    dateOfBirth: patient.date_of_birth ?? '',
    biologicalSex: patient.biological_sex ?? '',
  }

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
    <DashboardPageTransition className="gap-6">
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />

      <section>
        <Link
          href={PATIENT_ROUTES.dashboard}
          className="font-mono text-[11px] text-black/45 transition-colors hover:text-black"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-medium text-black">Profile & settings</h1>
        <p className="mt-2 text-sm text-black/55">
          Update your photo, personal details, and chronoprofile. Each change saves when you edit a
          field.
        </p>
      </section>

      <section>
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Photo</h2>
        <div className="mt-4">
          <ProfileAvatarUpload
            fullName={profile.full_name ?? 'Patient'}
            initialAvatarUrl={profile.avatar_url}
          />
        </div>
      </section>

      <PatientIdentityPanel patientId={user.id} initial={identity} />

      <div className="dios-glass-outer mt-10 rounded-2xl p-5 sm:p-6">
        <PatientProfilePanel patientId={user.id} initial={demographics} />
      </div>

      <section className="border-t border-black/10 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
          Data & privacy
        </h2>
        <p className="mt-2 text-sm text-black/55">
          Control who can see your health data and manage TipTraQ sharing.
        </p>
        <Link
          href={PATIENT_ROUTES.dataControls}
          className="dios-glass-inner mt-4 flex items-center justify-between rounded-2xl px-5 py-4 transition-[box-shadow,background] duration-200 hover:brightness-[1.02]"
        >
          <div>
            <p className="text-sm font-medium text-black">Data controls</p>
            <p className="mt-1 text-sm text-black/55">Sharing preferences and recordings</p>
          </div>
          <span className="font-mono text-[11px] text-black/45">Open →</span>
        </Link>
      </section>

      <section className="border-t border-black/10 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Account</h2>
        <SignOutButton className="mt-4" />
      </section>
    </DashboardPageTransition>
  )
}
