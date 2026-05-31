import { InsightsView } from '@/components/dashboard/insights-view'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { requirePatientSession } from '@/lib/auth/require-patient'
import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { buildInsightsData } from '@/lib/dashboard/insights-data'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardInsightsPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const [{ data: dlmoProfile }, { data: nights, count: nightsCount }] = await Promise.all([
    supabase.from('dlmo_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
    supabase
      .from('tiptraq_nights')
      .select(
        'non_dipper_flag, high_sympathetic_flag, rem_delay_flag, apnea_confound_flag',
        { count: 'exact' }
      )
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false })
      .limit(7),
  ])

  const insights = buildInsightsData({
    profile: (dlmoProfile as DlmoProfileRow | null) ?? null,
    nights: nights ?? [],
    nightsCount: nightsCount ?? 0,
    fallbackSleepTime: patient.chronotype_q3 ?? '11:00pm',
    locationCity: patient.location_city,
    locationCountry: patient.location_country,
  })

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />
      <InsightsView data={insights} />
    </>
  )
}
