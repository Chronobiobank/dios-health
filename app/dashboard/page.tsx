import { DashboardPageTransition } from '@/components/dashboard/dashboard-page-transition'
import { PatientCommandCentre } from '@/components/dashboard/patient-command-centre'
import { buildSeededInsight } from '@/lib/auth/chronotype-insight'
import { getLocalizedPatientGreeting, getPatientFirstName } from '@/lib/auth/greeting'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { buildCommandCentreViewModel } from '@/lib/dashboard/command-centre'
import type { MLuxProfileRow as PatientMluxProfileRow } from '@/lib/dashboard/mlux-profile'
import { createClient } from '@/lib/supabase/server'

type MluxProfileRow = PatientMluxProfileRow & {
  mlux_score?: number | null
}

export default async function DashboardPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const [{ data: mluxProfile }, { count: tipTraqNightsCount }, { count: bloodPanelsCount }, { data: latestNight }, { data: latestSmartphone }] =
    await Promise.all([
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
        .select(
          'non_dipper_flag, high_sympathetic_flag, rem_delay_flag, apnea_confound_flag'
        )
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
    ])

  const profileRow = mluxProfile as MluxProfileRow | null
  const nightsUploaded = tipTraqNightsCount ?? 0
  const smartphoneActive =
    latestSmartphone?.observed_at != null &&
    Date.now() - new Date(latestSmartphone.observed_at).getTime() <= 7 * 24 * 60 * 60 * 1000

  const firstName = getPatientFirstName({
    firstName: patient.first_name,
    fullName: profile.full_name,
  })
  const greeting = getLocalizedPatientGreeting(
    firstName,
    patient.location_city,
    patient.location_country
  )
  const insight = buildSeededInsight(
    patient.chronotype_q1 ?? '',
    patient.chronotype_q2 ?? '',
    patient.chronotype_q3 ?? ''
  )

  const model = buildCommandCentreViewModel({
    greeting,
    fullName: profile.full_name ?? firstName,
    avatarUrl: profile.avatar_url,
    firstName,
    chronotypeQ1: patient.chronotype_q1 ?? '',
    chronotypeQ3: patient.chronotype_q3 ?? '',
    chronotypeLabel: insight.chronotypeLabel,
    currentMedications: (patient.current_medications as string[] | null) ?? [],
    mluxProfile: profileRow,
    tipTraqNightsCount: nightsUploaded,
    bloodPanelsCount: bloodPanelsCount ?? 0,
    smartphoneActive,
    latestNight: latestNight ?? null,
  })

  return (
    <DashboardPageTransition className="gap-0">
      <PatientCommandCentre model={model} />
    </DashboardPageTransition>
  )
}
