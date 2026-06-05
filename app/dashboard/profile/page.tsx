import Link from 'next/link'

import { DashboardSettingsPage } from '@/components/dashboard/dashboard-settings-page'
import {
  SETTINGS_HEADER,
  SETTINGS_PROFILE_HERO,
  SETTINGS_SECTION,
} from '@/components/dashboard/dashboard-styles'
import {
  PatientIdentityPanel,
  type PatientIdentityValues,
} from '@/components/dashboard/patient-identity-panel'
import { PatientMedicationsPanel } from '@/components/dashboard/patient-medications-panel'
import {
  PatientProfilePanel,
  type PatientProfileDemographics,
} from '@/components/dashboard/patient-profile-panel'
import { readPatientMedicationList } from '@/lib/medication/patient-medications'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { GovernanceWeightCard } from '@/components/chronobiobank/governance-weight-card'
import { ProfileAvatarUpload } from '@/components/profile/profile-avatar-upload'
import { fetchPatientChronobiobankContext } from '@/lib/chronobiobank/fetch-patient-governance'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardProfilePage() {
  const { user, profile, patient } = await requirePatientSession()
  const chronobiobank = await fetchPatientChronobiobankContext(user.id)

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
    <DashboardSettingsPage>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />

      <header className={SETTINGS_HEADER}>
        <Link
          href={PATIENT_ROUTES.dashboard}
          className="font-mono text-[11px] text-black/45 transition-colors hover:text-black"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-3">Profile & settings</h1>
        <p className="mt-2 text-sm text-black/55">
          Update your photo, personal details, and chronoprofile. Each change saves when you edit a
          field.
        </p>
      </header>

      <div className={SETTINGS_PROFILE_HERO}>
        <section className={SETTINGS_SECTION}>
          <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Photo</h2>
          <div className="mt-4">
            <ProfileAvatarUpload
              fullName={profile.full_name ?? 'Patient'}
              initialAvatarUrl={profile.avatar_url}
            />
          </div>
        </section>

        <PatientIdentityPanel patientId={user.id} initial={identity} />
      </div>

      <PatientMedicationsPanel
        patientId={user.id}
        initialMedications={readPatientMedicationList(patient.current_medications)}
      />

      <div className="dios-glass-outer rounded-2xl p-5 sm:p-6">
        <PatientProfilePanel patientId={user.id} initial={demographics} />
      </div>

      <section className={cn(SETTINGS_SECTION, 'border-t border-black/10 pt-8')}>
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
          Chronobiobank
        </h2>
        <p className="mt-2 text-sm text-black/55">
          Your governance weight reflects how much high-fidelity data you have contributed.
        </p>
        <div className="mt-4 md:max-w-xl">
          <GovernanceWeightCard contributions={chronobiobank.contributions} />
        </div>
      </section>

      <section className={cn(SETTINGS_SECTION, 'border-t border-black/10 pt-8')}>
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
          Data & privacy
        </h2>
        <p className="mt-2 text-sm text-black/55">
          Control who can see your health data and manage TipTraQ sharing.
        </p>
        <Link
          href={PATIENT_ROUTES.dataControls}
          className="dios-glass-inner mt-4 flex items-center justify-between rounded-2xl px-5 py-4 transition-[box-shadow,background] duration-200 hover:brightness-[1.02] md:max-w-xl"
        >
          <div>
            <p className="text-sm font-medium text-black">Data controls</p>
            <p className="mt-1 text-sm text-black/55">Sharing preferences and recordings</p>
          </div>
          <span className="font-mono text-[11px] text-black/45">Open →</span>
        </Link>
      </section>

      <section className={cn(SETTINGS_SECTION, 'border-t border-black/10 pt-8')}>
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Account</h2>
        <SignOutButton className="mt-4 md:max-w-xs" />
      </section>
    </DashboardSettingsPage>
  )
}
