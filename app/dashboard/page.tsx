import { CircadianDesynchronySpectrum } from '@/components/sections/CircadianDesynchronySpectrum'
import { DashboardPageTransition } from '@/components/dashboard/dashboard-page-transition'
import { MLuxUploadPrompt } from '@/components/dashboard/mlux-upload-prompt'
import { GpReportButton } from '@/components/dashboard/gp-report-button'
import { MedicationTimeline } from '@/components/dashboard/medication-timeline'
import { MLuxDial } from '@/components/dashboard/mlux-dial'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { SeededInsightCard } from '@/components/dashboard/seeded-insight-card'
import { SpectrumUpgradePaths } from '@/components/dashboard/spectrum-upgrade-paths'
import { StreamsStatus } from '@/components/dashboard/streams-status'
import { buildSeededInsight } from '@/lib/auth/chronotype-insight'
import { getLocalizedPatientGreeting, getPatientFirstName } from '@/lib/auth/greeting'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { buildBodyClockModel } from '@/lib/dashboard/body-clock'
import {
  buildBodyClockFromMLuxProfile,
  type MLuxProfileRow,
} from '@/lib/dashboard/mlux-profile'
import { buildSpectrumScores } from '@/lib/spectrum/spectrum-builder'
import type { SpectrumConfidence } from '@/lib/spectrum/spectrum-types'
import { createClient } from '@/lib/supabase/server'

type MluxProfileRow = MLuxProfileRow & {
  mlux_score?: number | null
}

export default async function DashboardPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const { data: mluxProfile } = await supabase
    .from('mlux_profiles')
    .select('*')
    .eq('patient_id', user.id)
    .maybeSingle()

  const { count: tipTraqNightsCount } = await supabase
    .from('tiptraq_nights')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', user.id)

  const { count: bloodPanelsCount } = await supabase
    .from('blood_circadian_panels')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', user.id)

  const { data: latestSmartphone } = await supabase
    .from('smartphone_circadian_observations')
    .select('observed_at')
    .eq('patient_id', user.id)
    .order('observed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const profileRow = mluxProfile as MluxProfileRow | null
  const nightsUploaded = tipTraqNightsCount ?? 0
  const hasTipTraqData = nightsUploaded > 0
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

  const bodyClock =
    profileRow && hasTipTraqData
      ? buildBodyClockFromMLuxProfile(profileRow)
      : buildBodyClockModel(
          patient.chronotype_q1 ?? '',
          patient.chronotype_q3 ?? '',
          insight.chronotypeLabel
        )

  const mluxScoreValue =
    profileRow?.mlux_score ?? Math.round((profileRow?.confidence_score ?? 20) * 3.5)

  const spectrumScores = buildSpectrumScores({
    mluxScore: mluxScoreValue,
    chronotype: profileRow?.chronotype ?? insight.chronotypeLabel ?? null,
    hasTipTraqData,
    hasBloodData: (bloodPanelsCount ?? 0) > 0,
    currentMedications: (patient.current_medications as string[] | null) ?? [],
  })

  const overallConfidence: SpectrumConfidence = hasTipTraqData
    ? 'CONFIRMED'
    : (bloodPanelsCount ?? 0) > 0
      ? 'PRECISION'
      : 'ESTIMATED'

  return (
    <DashboardPageTransition className="gap-6">
      <CircadianDesynchronySpectrum
        scores={spectrumScores}
        mluxScore={mluxScoreValue}
        patientName={firstName}
      />

      <PatientTopBar
        fullName={profile.full_name ?? firstName}
        avatarUrl={profile.avatar_url}
        greeting={greeting}
        subtitle={
          hasTipTraqData
            ? `Body clock from ${profileRow?.nights_count ?? nightsUploaded} TipTraQ night${(profileRow?.nights_count ?? nightsUploaded) === 1 ? '' : 's'}`
            : 'Body clock estimate · Based on your answers · Upload TipTraQ for precision'
        }
      />

      {overallConfidence === 'ESTIMATED' ? <SpectrumUpgradePaths /> : null}

      <MLuxDial
        mluxScore={Math.round((profileRow?.confidence_score ?? 20) * 3.5)}
        morningAdequacy={smartphoneActive ? 'low' : 'none'}
        eveningAdequacy={smartphoneActive ? 'low' : 'none'}
        nocturnalAdequacy={smartphoneActive ? 'good' : 'none'}
        chronotypeLabel={bodyClock.chronotypeLabel}
        confidenceScore={profileRow?.confidence_score ?? undefined}
        confidenceLabel={profileRow?.confidence_label ?? undefined}
      />

      {hasTipTraqData && bodyClock.doseWindows.length > 0 ? (
        <MedicationTimeline
          doseWindows={bodyClock.doseWindows}
          wakeMinutes={bodyClock.sleepEndMinutes}
          sleepMinutes={bodyClock.sleepStartMinutes}
        />
      ) : (
        <MLuxUploadPrompt />
      )}

      {hasTipTraqData && profileRow ? (
        <div>
          <GpReportButton />
        </div>
      ) : null}

      <SeededInsightCard insight={insight} hasTipTraqData={hasTipTraqData} />

      <StreamsStatus
        tipTraqNightsCount={nightsUploaded}
        bloodPanelsCount={bloodPanelsCount ?? 0}
        smartphoneActive={smartphoneActive}
      />
    </DashboardPageTransition>
  )
}
