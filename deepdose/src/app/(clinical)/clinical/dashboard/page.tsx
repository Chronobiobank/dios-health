import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchClinicianTriageRows } from '@/lib/clinical/triage'
import { ClinicalTriageList } from '@/components/clinical/ClinicalTriageList'
import { ClinicianInvitePanel } from '@/components/clinical/ClinicianInvitePanel'

export default async function ClinicalDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/clinical/dashboard')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier, display_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['clinician', 'enterprise'].includes(profile.tier)) {
    redirect('/patient/dashboard')
  }

  const rows = await fetchClinicianTriageRows(supabase, user.id)

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Clinical</p>
        <h1 className="seco-app-section-title">Patient triage</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Device alerts first, then misalignment. Read-only BTI summaries for linked patients.
        </p>
      </header>

      <ClinicianInvitePanel />
      <ClinicalTriageList rows={rows} />
    </div>
  )
}
