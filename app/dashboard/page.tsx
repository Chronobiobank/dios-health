import { DashboardClient } from '@/components/patient-dashboard/dashboard-client'
import { resolveDashboardAvatar } from '@/components/patient-dashboard/constants'
import { getLocalizedPatientGreeting, getPatientFirstName } from '@/lib/auth/greeting'
import { requirePatientSession } from '@/lib/auth/require-patient'
import type { BloodPanelSnapshot } from '@/lib/dashboard/insights-data'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { meanAhiFromValues } from '@/lib/patient-dashboard/dashboard-indicators'
import { buildPatientSnapshot } from '@/lib/patient-dashboard/build-patient-snapshot'
import { parseStoredHardwareBaseline } from '@/lib/retinomic/baseline-scan-summary'
import {
  isSmartphoneFeedFresh,
  resolveFeedFreshness,
} from '@/lib/retinomic/feed-retention'
import {
  parseSmartphoneSensorPayload,
  resolveLiveMluxFeed,
} from '@/lib/retinomic/live-mlux-feed'
import { estimateMelanopicLuxCeiling, resolvePhoticDayPhase } from '@/lib/retinomic/photic-dose'
import { resolveFirstLightDailyStatus } from '@/lib/product/first-light-daily-status'
import { resolveFirstLightWindow } from '@/lib/product/first-light-window'
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
    { data: recentAhiRows },
    { data: doseEventsToday },
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
      .select('observed_at, confidence_score, sensor_payload')
      .eq('patient_id', user.id)
      .order('observed_at', { ascending: false })
      .limit(1)
      .maybeSingle<{
        observed_at: string
        confidence_score: number | null
        sensor_payload: Record<string, unknown> | null
      }>(),
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
    supabase
      .from('tiptraq_nights')
      .select('ahi')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false })
      .limit(5),
    supabase
      .from('dose_events')
      .select('medication_name')
      .eq('patient_id', user.id)
      .eq('recommended_date', new Date().toISOString().slice(0, 10))
      .eq('confirmed', true),
  ])

  const now = new Date()
  const observedAt = latestSmartphone?.observed_at ?? null
  const feedFreshness = resolveFeedFreshness(observedAt, now)
  const smartphoneActive =
    observedAt != null &&
    now.getTime() - new Date(observedAt).getTime() <= 7 * 24 * 60 * 60 * 1000
  const phoneFeedFresh = smartphoneActive && isSmartphoneFeedFresh(observedAt, now)

  const firstName = getPatientFirstName({
    firstName: patient.first_name,
    fullName: profile.full_name,
  })

  const greeting = getLocalizedPatientGreeting(
    firstName,
    patient.location_city,
    patient.location_country
  )

  const hardwareBaseline = parseStoredHardwareBaseline(patient.hardware_baseline)
  const profileRow = mluxProfile as MluxProfileRow | null
  const photicPhase = resolvePhoticDayPhase()
  const melanopicLuxCeiling = estimateMelanopicLuxCeiling(
    patient.fitzpatrick_type,
    hardwareBaseline?.onboardingGeo?.lat
  )

  const sensorFields = parseSmartphoneSensorPayload(latestSmartphone?.sensor_payload)
  const liveMluxFeed = resolveLiveMluxFeed({
    melanopicLuxCeiling,
    photicPhase,
    mluxScore: profileRow?.mlux_score ?? null,
    smartphoneFeed: latestSmartphone
      ? {
          observedAt: latestSmartphone.observed_at,
          vdrDoseToday: sensorFields.vdrDoseToday,
          outdoorLightBefore10am: sensorFields.outdoorLightBefore10am,
          confidenceScore: latestSmartphone.confidence_score,
        }
      : null,
    smartphoneActive,
    hardwareBaseline,
  })

  const lightAlignmentOverride =
    phoneFeedFresh && melanopicLuxCeiling > 0
      ? Math.round((liveMluxFeed.melanopicLuxToday / melanopicLuxCeiling) * 100)
      : null

  const meanTipTraqAhi = meanAhiFromValues(
    (recentAhiRows ?? [])
      .map((row) => (row.ahi != null ? Number(row.ahi) : NaN))
      .filter((v) => !Number.isNaN(v))
  )

  const firstLightDailyStatus = resolveFirstLightDailyStatus(latestSmartphone ?? null, now)
  const firstLightWindow = resolveFirstLightWindow(now)
  const firstLightScanActionable =
    firstLightWindow.scanDue || firstLightWindow.outsideEntrainment

  const snapshot = buildPatientSnapshot({
    patient,
    mluxProfile: profileRow,
    tipTraqNightsCount: tipTraqNightsCount ?? 0,
    bloodPanelsCount: bloodPanelsCount ?? 0,
    smartphoneActive: phoneFeedFresh,
    latestNight,
    latestBloodPanel,
    latestTiptraqDate: latestTiptraqNight?.report_date ?? null,
    sleepOnsetDelayMinutes: null,
    meanTipTraqAhi,
    hardwareBaseline,
    feedFreshness,
    lightAlignmentOverride,
    firstLightDailyStatus,
    firstLightScanActionable,
  })

  return (
    <DashboardClient
      greeting={greeting}
      firstName={firstName}
      fullName={profile.full_name ?? firstName}
      avatarUrl={profile.avatar_url ?? resolveDashboardAvatar(null)}
      snapshot={snapshot}
      feedFreshness={feedFreshness}
      firstLightWindow={firstLightWindow}
      firstLightDailyStatus={firstLightDailyStatus}
      confirmedDosesToday={(doseEventsToday ?? []).map((row) => row.medication_name)}
      lightCheckIn={{
        fitzpatrickType: patient.fitzpatrick_type,
        defaultSleepOnset: patient.chronotype_q3 ?? '22:30',
      }}
    />
  )
}
