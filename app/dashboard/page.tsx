import { DashboardClient } from '@/components/patient-dashboard/dashboard-client'
import { getPatientDashboardGreeting, getPatientFirstName } from '@/lib/auth/greeting'
import { resolveDashboardAvatar } from '@/components/patient-dashboard/constants'
import { requirePatientSession } from '@/lib/auth/require-patient'
import type { BloodPanelSnapshot } from '@/lib/dashboard/insights-data'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { buildPatientSnapshot } from '@/lib/patient-dashboard/build-patient-snapshot'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type MluxProfileRow = MLuxProfileRow & {
  mlux_score?: number | null
  layers_active?: number | null
}

export default async function PatientDashboardPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const [
    { data: mluxProfile },
    { count: tipTraqNightsCount },
    { count: bloodPanelsCount },
    { data: latestNight },
    { data: latestSmartphone },
    { data: latestBloodPanel },
    { data: latestTiptraqNight },
  ] = await Promise.all([
    supabase.from('mlux_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
    supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', user.id),
    supabase
      .from('blood_circadian_panels')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', user.id),
    supabase
      .from('tiptraq_nights')
      .select('non_dipper_flag, high_sympathetic_flag, rem_delay_flag, apnea_confound_flag')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('smartphone_circadian_observations')
      .select('observed_at')
      .eq('patient_id', user.id)
      .order('observed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blood_circadian_panels')
      .select('vitamin_d3_nmoll, vitamin_b12_pmoll, ferritin_ugl, vitamin_b5_umoll, collected_at')
      .eq('patient_id', user.id)
      .order('collected_at', { ascending: false })
      .limit(1)
      .maybeSingle<BloodPanelSnapshot>(),
    supabase
      .from('tiptraq_nights')
      .select('report_date, rem_delay_flag')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false })
      .limit(1)
      .maybeSingle<{ report_date: string; rem_delay_flag: boolean | null }>(),
  ])

  const smartphoneActive =
    latestSmartphone?.observed_at != null &&
    Date.now() - new Date(latestSmartphone.observed_at).getTime() <= 7 * 24 * 60 * 60 * 1000

  const firstName = getPatientFirstName({
    firstName: patient.first_name,
    fullName: profile.full_name,
  })

  const greeting = getPatientDashboardGreeting(firstName)

  const snapshot = buildPatientSnapshot({
    patient,
    mluxProfile: (mluxProfile as MluxProfileRow | null) ?? null,
    tipTraqNightsCount: tipTraqNightsCount ?? 0,
    bloodPanelsCount: bloodPanelsCount ?? 0,
    smartphoneActive,
    latestNight: latestNight ?? null,
    latestBloodPanel: latestBloodPanel ?? null,
    latestTiptraqDate: latestTiptraqNight?.report_date ?? null,
    sleepOnsetDelayMinutes: latestTiptraqNight?.rem_delay_flag ? 44 : null,
  })

  return (
    <DashboardClient
      greeting={greeting}
      firstName={firstName}
      fullName={profile.full_name ?? firstName}
      avatarUrl={resolveDashboardAvatar(profile.avatar_url)}
      snapshot={snapshot}
    />
  )
}
