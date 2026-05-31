import { BodyClockVisualization } from '@/components/dashboard/body-clock-visualization'
import { DashboardPageTransition } from '@/components/dashboard/dashboard-page-transition'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { DlmoScoreCard } from '@/components/dashboard/dlmo-score-card'
import { DlmoUploadPrompt } from '@/components/dashboard/dlmo-upload-prompt'
import { GpReportButton } from '@/components/dashboard/gp-report-button'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { SeededInsightCard } from '@/components/dashboard/seeded-insight-card'
import { StreamsStatus } from '@/components/dashboard/streams-status'
import { buildSeededInsight } from '@/lib/auth/chronotype-insight'
import { getPatientFirstName, getTimeGreeting } from '@/lib/auth/greeting'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { buildBodyClockModel } from '@/lib/dashboard/body-clock'
import {
  buildBodyClockFromDlmoProfile,
  type DlmoProfileRow,
} from '@/lib/dashboard/dlmo-profile'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const { data: dlmoProfile } = await supabase
    .from('dlmo_profiles')
    .select('*')
    .eq('patient_id', user.id)
    .maybeSingle()

  const profileRow = dlmoProfile as DlmoProfileRow | null
  const hasDlmoProfile = Boolean(profileRow?.nights_count && profileRow.nights_count > 0)

  const greeting = getTimeGreeting()
  const firstName = getPatientFirstName({
    firstName: patient.first_name,
    fullName: profile.full_name,
  })
  const insight = buildSeededInsight(
    patient.chronotype_q1 ?? '',
    patient.chronotype_q2 ?? '',
    patient.chronotype_q3 ?? ''
  )

  const bodyClock = hasDlmoProfile
    ? buildBodyClockFromDlmoProfile(profileRow!)
    : buildBodyClockModel(
        patient.chronotype_q1 ?? '',
        patient.chronotype_q3 ?? '',
        insight.chronotypeLabel
      )

  return (
    <DashboardPageTransition>
      <PatientTopBar fullName={profile.full_name ?? firstName} avatarUrl={profile.avatar_url} />

      <section>
        <h1 className={`${DASHBOARD_HEADLINE} capitalize`}>Good {greeting}, {firstName}.</h1>
        <p className="mt-2 font-mono text-[11px] text-black/45">
          {hasDlmoProfile
            ? `Body clock from ${profileRow!.nights_count} TipTraQ night${profileRow!.nights_count === 1 ? '' : 's'}`
            : 'Body clock estimate · Based on your answers · Upload TipTraQ for precision'}
        </p>
      </section>

      {hasDlmoProfile ? (
        <>
          <BodyClockVisualization
            model={bodyClock}
            nightsCount={profileRow!.nights_count ?? undefined}
            confidenceScore={profileRow!.confidence_score ?? undefined}
            confidenceLabel={profileRow!.confidence_label ?? undefined}
          />
          <DlmoScoreCard profile={profileRow!} />
          <div className="mt-4">
            <GpReportButton />
          </div>
        </>
      ) : (
        <DlmoUploadPrompt />
      )}

      <div className="mt-8">
        <SeededInsightCard insight={insight} />
      </div>

      <StreamsStatus wearableConnected={patient.wearable_connected} />
    </DashboardPageTransition>
  )
}
