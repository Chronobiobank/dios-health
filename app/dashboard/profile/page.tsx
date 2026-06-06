import Link from 'next/link'

import { DashboardSettingsPage } from '@/components/dashboard/dashboard-settings-page'
import {
  DASHBOARD_CARD,
  SECTION_LABEL,
  SETTINGS_BACK_LINK,
  SETTINGS_HEADER,
  SETTINGS_LEDE,
  SETTINGS_LINK_CARD,
  SETTINGS_PROFILE_HERO,
  SETTINGS_SECTION,
  SETTINGS_SECTION_DIVIDED,
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
import { SignOutButton } from '@/components/auth/sign-out-button'
import { GovernanceWeightCard } from '@/components/chronobiobank/governance-weight-card'
import { ProfileAvatarUpload } from '@/components/profile/profile-avatar-upload'
import { fetchPatientChronobiobankContext } from '@/lib/chronobiobank/fetch-patient-governance'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

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
      <header className={SETTINGS_HEADER}>
        <Link href={PATIENT_ROUTES.dashboard} className={SETTINGS_BACK_LINK}>
          ← Dashboard
        </Link>
        <h1>Profile &amp; settings</h1>
        <p className={SETTINGS_LEDE}>
          Update your photo, personal details, and chronoprofile. Each change saves when you edit a
          field.
        </p>
      </header>

      <div className={SETTINGS_PROFILE_HERO}>
        <section className={SETTINGS_SECTION}>
          <h2 className={SECTION_LABEL}>Photo</h2>
          <ProfileAvatarUpload
            fullName={profile.full_name ?? 'Patient'}
            initialAvatarUrl={profile.avatar_url}
          />
        </section>

        <PatientIdentityPanel patientId={user.id} initial={identity} />
      </div>

      <PatientMedicationsPanel
        patientId={user.id}
        initialMedications={readPatientMedicationList(patient.current_medications)}
      />

      <div className={DASHBOARD_CARD}>
        <PatientProfilePanel patientId={user.id} initial={demographics} />
      </div>

      <section className={SETTINGS_SECTION_DIVIDED}>
        <h2 className={SECTION_LABEL}>Chronobiobank</h2>
        <p className={SETTINGS_LEDE}>
          Your governance weight reflects how much high-fidelity data you have contributed.
        </p>
        <GovernanceWeightCard contributions={chronobiobank.contributions} />
      </section>

      <section className={SETTINGS_SECTION_DIVIDED}>
        <h2 className={SECTION_LABEL}>Data & privacy</h2>
        <p className={SETTINGS_LEDE}>
          Control who can see your health data and manage TipTraQ sharing.
        </p>
        <Link href={PATIENT_ROUTES.dataControls} className={SETTINGS_LINK_CARD}>
          <div>
            <p className="text-sm font-medium text-black">Data controls</p>
            <p className="type-body">Sharing preferences and recordings</p>
          </div>
          <span className="type-caption">Open →</span>
        </Link>
      </section>

      <section className={SETTINGS_SECTION_DIVIDED}>
        <h2 className={SECTION_LABEL}>Account</h2>
        <SignOutButton className="md:max-w-xs" />
      </section>
    </DashboardSettingsPage>
  )
}
