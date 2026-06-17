import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClinicianInvitePanel } from '@/components/clinical/ClinicianInvitePanel'

export default async function ClinicalSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier, display_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['clinician', 'enterprise'].includes(profile.tier)) {
    redirect('/patient/dashboard')
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Clinical</p>
        <h1 className="seco-app-section-title">Settings</h1>
      </header>
      <ClinicianInvitePanel />
    </div>
  )
}
