import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchClinicianInviteCodes } from '@/lib/clinical/invites'
import { ClinicalAccountPanel } from '@/components/clinical/ClinicalAccountPanel'
import { ClinicianInvitePanel } from '@/components/clinical/ClinicianInvitePanel'

export default async function ClinicalSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/clinical/settings')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier, display_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['clinician', 'enterprise'].includes(profile.tier)) {
    redirect('/connect')
  }

  const invites = await fetchClinicianInviteCodes(supabase, user.id)

  return (
    <div className="dash-meds space-y-8">
      <header className="seco-landing__copy-stack dash-meds__page-head">
        <p className="seco-page__eyebrow">Clinical</p>
        <h1 className="seco-page__title dash-meds__page-title">Settings</h1>
      </header>

      <div className="dash-meds__form">
        <ClinicalAccountPanel
          displayName={profile.display_name ?? 'Clinician'}
          tier={profile.tier}
        />
        <ClinicianInvitePanel initialInvites={invites} variant="full" />
      </div>
    </div>
  )
}
