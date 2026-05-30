import { DataControlsPanel } from '@/components/dashboard/data-controls-panel'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { ProfileAvatarUpload } from '@/components/profile/profile-avatar-upload'
import { requirePatientSession } from '@/lib/auth/require-patient'

export default async function DashboardDataControlsPage() {
  const { user, profile, patient } = await requirePatientSession()

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />

      <section>
        <h1 className="text-2xl font-medium text-black">Settings</h1>
        <p className="mt-2 text-sm text-black/55">
          Your profile and data sharing preferences.
        </p>
      </section>

      <section className="mt-8">
        <ProfileAvatarUpload fullName={profile.full_name ?? 'Patient'} initialAvatarUrl={profile.avatar_url} />
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Data controls</h2>
        <p className="mt-2 text-sm text-black/55">
          You decide who sees your data. Each toggle saves immediately when you change it.
        </p>
      </section>

      <div className="mt-4">
        <DataControlsPanel
          patientId={user.id}
          dataShareGp={patient.data_share_gp}
          dataShareResearch={patient.data_share_research}
          dataSharePolicy={patient.data_share_policy}
        />
      </div>

      <section className="mt-12 border-t border-black/10 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Account</h2>
        <SignOutButton className="mt-4" />
      </section>
    </>
  )
}
