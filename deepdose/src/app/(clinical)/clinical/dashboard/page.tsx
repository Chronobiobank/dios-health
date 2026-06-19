import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchClinicianTriageRows } from '@/lib/clinical/triage'
import { fetchClinicianTipTraqQueue } from '@/lib/clinical/tiptraq-assessments'
import { fetchClinicianTipTraqNightsSummary } from '@/lib/clinical/tiptraq-nights'
import { ClinicalTriageList } from '@/components/clinical/ClinicalTriageList'
import { ClinicianInvitePanel } from '@/components/clinical/ClinicianInvitePanel'
import { TipTraqGpProgramPanel } from '@/components/clinical/TipTraqGpProgramPanel'

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
  const tiptraqQueue = await fetchClinicianTipTraqQueue(supabase, user.id)
  const tiptraqNightsSummary = await fetchClinicianTipTraqNightsSummary(supabase, user.id)
  const nightsByPatient = Object.fromEntries(
    tiptraqNightsSummary.map((row) => [row.patientId, row.nightsCount])
  )

  const patientNames: Record<string, string> = {}
  for (const row of rows) {
    patientNames[row.patientId] = row.patientName
  }
  for (const item of tiptraqQueue) {
    if (!patientNames[item.patient_id]) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('id', item.patient_id)
        .single()
      patientNames[item.patient_id] = profile?.display_name ?? 'Patient'
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Clinical</p>
        <h1 className="seco-app-section-title">Patient triage</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Device alerts first, then misalignment. TipTraQ kits profile patients for precision dosing
          and metabolic early warning.
        </p>
      </header>

      <ClinicianInvitePanel />
      <TipTraqGpProgramPanel
        queue={tiptraqQueue}
        patientNames={patientNames}
        nightsByPatient={nightsByPatient}
      />
      <ClinicalTriageList rows={rows} />
    </div>
  )
}
