import { InsightsView } from '@/components/dashboard/insights-view'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { requirePatientSession } from '@/lib/auth/require-patient'
import {
  buildInsightsData,
  type BloodPanelSnapshot,
  type InsightsMLuxProfile,
  type PatientProtocolRow,
} from '@/lib/dashboard/insights-data'
import { readPatientMedicationList } from '@/lib/medication/patient-medications'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardInsightsPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const [
    { data: mluxProfile },
    { data: latestNight, count: nightsCount },
    { data: bloodPanel },
    { data: protocols },
  ] = await Promise.all([
    supabase.from('mlux_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
    supabase
      .from('tiptraq_nights')
      .select(
        'non_dipper_flag, high_sympathetic_flag, rem_delay_flag, apnea_confound_flag',
        { count: 'exact' }
      )
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false })
      .limit(1),
    supabase
      .from('blood_circadian_panels')
      .select('vitamin_d3_nmoll, vitamin_b12_pmoll, ferritin_ugl, vitamin_b5_umoll, collected_at')
      .eq('patient_id', user.id)
      .order('collected_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('patient_protocols')
      .select(
        'id, protocol_type, status, review_at, target_d3_nmoll, current_d3_nmoll, d3_dose_iu, cofactors, b_vitamin_targets, requires_supervision'
      )
      .eq('patient_id', user.id)
      .eq('status', 'active'),
  ])

  const insights = buildInsightsData({
    profile: (mluxProfile as InsightsMLuxProfile | null) ?? null,
    latestNight: latestNight?.[0] ?? null,
    nightsCount: nightsCount ?? 0,
    currentMedications: readPatientMedicationList(patient.current_medications),
    fallbackSleepTime: patient.chronotype_q3 ?? '11:00pm',
    activeProtocols: (protocols ?? []) as PatientProtocolRow[],
    latestBloodPanel: (bloodPanel as BloodPanelSnapshot | null) ?? null,
  })

  const subtitle = insights.hasMLuxProfile
    ? insights.dominantLayerLabel
      ? `Personalised from ${insights.dominantLayerLabel.toLowerCase()} · MLux phase ${insights.phaseTimeLabel}`
      : `MLux phase ${insights.phaseTimeLabel}`
    : 'Log sleep on Streams or upload TipTraQ to build your body clock reading.'

  return (
    <>
      <PatientTopBar
        fullName={profile.full_name ?? 'Patient'}
        avatarUrl={profile.avatar_url}
        subtitle={subtitle}
      />
      <InsightsView data={insights} />
    </>
  )
}
