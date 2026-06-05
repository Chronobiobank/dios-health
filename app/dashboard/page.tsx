import { RetinomicDashboardClient } from '@/components/retinomic/retinomic-dashboard-client'
import { getLocalizedPatientGreeting, getPatientFirstName } from '@/lib/auth/greeting'
import { resolveDashboardAvatar } from '@/components/patient-dashboard/constants'
import { requirePatientSession } from '@/lib/auth/require-patient'
import type { BloodPanelSnapshot } from '@/lib/dashboard/insights-data'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { buildPatientCalibration } from '@/lib/patient-dashboard/calibration'
import {
  buildBaselineScanSummary,
  irisPigmentIsLight,
  parseStoredHardwareBaseline,
} from '@/lib/retinomic/baseline-scan-summary'
import {
  DAY_ONE_LOCKED_COPY,
  dayOneInterventionIntro,
  morningMluxMinutesFromBaseline,
  tailorDailyInterventionForBaseline,
} from '@/lib/retinomic/day-one-dashboard'
import {
  parseSmartphoneSensorPayload,
  resolveLiveMluxFeed,
} from '@/lib/retinomic/live-mlux-feed'
import {
  detectLightIris,
  estimateMelanopicLuxCeiling,
  resolvePhoticDayPhase,
} from '@/lib/retinomic/photic-dose'
import { getPatientRetinomicTier } from '@/lib/auth/retinomic-access'
import { mapPatientRowToUser } from '@/lib/retinomic/patient-user-mapper'
import { resolveRetinomicTierFromCounts } from '@/lib/retinomic/sync-tier'
import type { BiochemicalFuel, HardwareBaseline } from '@/src/types'
import {
  estimateAutonomicStrain,
  estimateRemCycleEfficiency,
} from '@/lib/retinomic/sleep-metrics'
import { buildDailyInterventionForPatient, resolveChronotypePhase } from '@/src/lib/engine/intervention'
import { readPatientMedicationList } from '@/lib/medication/patient-medications'
import { buildMedicationTimingFromIntervention } from '@/src/lib/engine/medication-timing'
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
    { data: latestTiptraqTelemetry },
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
      .select('rem_sleep_efficiency_pct, micro_arousals_count')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false })
      .limit(1)
      .maybeSingle<{
        rem_sleep_efficiency_pct: number | null
        micro_arousals_count: number | null
      }>(),
  ])

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

  const hardwareBaseline = parseStoredHardwareBaseline(patient.hardware_baseline)
  const baselineScan = buildBaselineScanSummary(patient, patient.hardware_baseline)

  const profileRow = mluxProfile as MluxProfileRow | null
  const calibration = buildPatientCalibration({
    patient,
    tipTraqNightsCount: tipTraqNightsCount ?? 0,
    latestTiptraqDate: latestTiptraqNight?.report_date ?? null,
    mluxChronotype: profileRow?.chronotype,
  })

  const fallbackTier = resolveRetinomicTierFromCounts(
    bloodPanelsCount ?? 0,
    tipTraqNightsCount ?? 0
  )
  const tier = await getPatientRetinomicTier(supabase, user.id)
  const retinomicUser = mapPatientRowToUser(
    {
      id: patient.id,
      retinomic_tier: tier,
      hardware_baseline: (patient.hardware_baseline as HardwareBaseline | null) ?? null,
      biochemical_fuel: (patient.biochemical_fuel as BiochemicalFuel | null) ?? null,
      hardware_bandwidth_coefficient: patient.hardware_bandwidth_coefficient,
      morning_mlux_target_duration_minutes: patient.morning_mlux_target_duration_minutes,
    },
    fallbackTier
  )
  const effectiveTier = retinomicUser.tier
  const photicPhase = resolvePhoticDayPhase()
  const melanopicLuxCeiling = estimateMelanopicLuxCeiling(
    patient.fitzpatrick_type,
    hardwareBaseline?.onboardingGeo?.lat ?? calibration.latitude
  )
  const morningMluxMinutes = hardwareBaseline
    ? morningMluxMinutesFromBaseline(hardwareBaseline.irisPigment, hardwareBaseline.skinITA)
    : (patient.morning_mlux_target_duration_minutes ?? 90)

  const sensorFields = parseSmartphoneSensorPayload(latestSmartphone?.sensor_payload)
  const smartphoneFeed = latestSmartphone
    ? {
        observedAt: latestSmartphone.observed_at,
        vdrDoseToday: sensorFields.vdrDoseToday,
        outdoorLightBefore10am: sensorFields.outdoorLightBefore10am,
        confidenceScore: latestSmartphone.confidence_score,
      }
    : null

  const liveMluxFeedInput = {
    melanopicLuxCeiling,
    photicPhase,
    mluxScore: profileRow?.mlux_score ?? null,
    smartphoneFeed,
    smartphoneActive,
    hardwareBaseline,
  }

  const liveMluxFeed = resolveLiveMluxFeed(liveMluxFeedInput)
  const photicSource = liveMluxFeed.source

  const isDayOneFree =
    effectiveTier === 'FREE_SCREENING' && baselineScan != null && (bloodPanelsCount ?? 0) === 0

  let dailyIntervention = buildDailyInterventionForPatient({
    tier: effectiveTier,
    chronotypeLabel: calibration.chronotype,
    chronotypeWakeTime: patient.chronotype_q1,
    vitaminD3NmolL: latestBloodPanel?.vitamin_d3_nmoll ?? null,
    vitaminB5UmolL: latestBloodPanel?.vitamin_b5_umoll ?? null,
    remSleepEfficiencyPercent:
      latestTiptraqTelemetry?.rem_sleep_efficiency_pct != null
        ? Number(latestTiptraqTelemetry.rem_sleep_efficiency_pct)
        : estimateRemCycleEfficiency(latestNight ?? null),
    microArousalsCount: latestTiptraqTelemetry?.micro_arousals_count ?? null,
    eveningLightDisciplineOptimal: smartphoneActive,
    morningMluxTargetDurationMinutes: morningMluxMinutes,
    locationCity: patient.location_city,
    locationCountry: patient.location_country,
  })

  if (isDayOneFree && baselineScan) {
    dailyIntervention = tailorDailyInterventionForBaseline(
      dailyIntervention,
      baselineScan,
      effectiveTier,
      morningMluxMinutes,
      photicSource
    )
  }

  const dayOneIntro =
    isDayOneFree && baselineScan
      ? dayOneInterventionIntro(baselineScan, photicSource)
      : null
  const bloodLockedCopy = isDayOneFree ? DAY_ONE_LOCKED_COPY.blood : null
  const sleepLockedCopy = isDayOneFree ? DAY_ONE_LOCKED_COPY.sleep : null

  const medicationTiming =
    isDayOneFree && baselineScan
      ? buildMedicationTimingFromIntervention({
          intervention: dailyIntervention,
          chronotype: resolveChronotypePhase(calibration.chronotype),
          currentMedications: readPatientMedicationList(patient.current_medications),
          fallbackSleepTime: patient.chronotype_q3,
          mluxProfile: profileRow,
        })
      : null

  return (
    <RetinomicDashboardClient
      greeting={greeting}
      firstName={firstName}
      fullName={profile.full_name ?? firstName}
      avatarUrl={profile.avatar_url ?? resolveDashboardAvatar(null)}
      tier={effectiveTier}
      baselineScan={baselineScan}
      dayOneIntro={dayOneIntro}
      photicDoseSourceCaption={liveMluxFeed.caption}
      liveMluxFeedInput={liveMluxFeedInput}
      lightCheckIn={{
        fitzpatrickType: patient.fitzpatrick_type,
        defaultSleepOnset: patient.chronotype_q3 ?? '22:30',
      }}
      bloodLockedCopy={bloodLockedCopy}
      sleepLockedCopy={sleepLockedCopy}
      melanopicLuxToday={liveMluxFeed.melanopicLuxToday}
      melanopicLuxCeiling={melanopicLuxCeiling}
      photicPhase={photicPhase}
      lightIrisDetected={
        hardwareBaseline?.irisPigment
          ? irisPigmentIsLight(hardwareBaseline.irisPigment)
          : detectLightIris(calibration.eyeColorLabel)
      }
      vitaminD3NmolL={latestBloodPanel?.vitamin_d3_nmoll ?? null}
      vitaminB5UmolL={latestBloodPanel?.vitamin_b5_umoll ?? null}
      remCycleEfficiency={estimateRemCycleEfficiency(latestNight ?? null)}
      autonomicStrain={estimateAutonomicStrain(latestNight ?? null)}
      dailyIntervention={dailyIntervention}
      medicationTiming={medicationTiming}
    />
  )
}
