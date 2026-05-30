import { ClinicTopBar } from '@/components/clinic/clinic-top-bar'
import { ProfileAvatarUpload } from '@/components/profile/profile-avatar-upload'
import { requireClinicianSession } from '@/lib/auth/require-clinician'

export default async function ClinicSettingsPage() {
  const { profile } = await requireClinicianSession()

  return (
    <>
      <ClinicTopBar fullName={profile.full_name ?? 'Clinician'} avatarUrl={profile.avatar_url} />

      <section>
        <h1 className="text-2xl font-medium text-black">Settings</h1>
        <p className="mt-2 text-sm text-black/55">Your clinician profile.</p>
      </section>

      <section className="mt-8">
        <ProfileAvatarUpload fullName={profile.full_name ?? 'Clinician'} initialAvatarUrl={profile.avatar_url} />
      </section>
    </>
  )
}
