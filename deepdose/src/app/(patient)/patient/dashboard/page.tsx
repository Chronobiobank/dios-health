import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { loadDlmoProxy } from '@/lib/circadian/load-dlmo-proxy'
import { loadPatientBti } from '@/lib/bti/load-patient-bti'
import { fetchPendingRecommendations } from '@/lib/prescribing/recommendations'
import { fetchPatientTipTraqNights } from '@/lib/clinical/tiptraq-nights'
import { buildDoseDash, medClusterDetail } from '@/lib/patient/build-dose-dash'
import type { TipTraqNightInput, TipTraqNightRecord } from '@/lib/clinical/tiptraq/types'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Form'
import { PendingRecommendationsPanel } from '@/components/patient/PendingRecommendationsPanel'
import { DosingReminderBanner } from '@/components/patient/DosingReminderBanner'
import { DoseDashStack } from '@/components/patient/DoseDashStack'

function toNightInput(row: TipTraqNightRecord): TipTraqNightInput | null {
  if (!row.sleep_onset || !row.sleep_offset) return null
  return {
    report_date: row.report_date,
    night_index: row.night_index ?? undefined,
    day_type: row.day_type === 'weekend' ? 'weekend' : 'weekday',
    sleep_onset: row.sleep_onset.slice(0, 5),
    sleep_offset: row.sleep_offset.slice(0, 5),
    sleep_latency_minutes: row.sleep_latency_minutes ?? 0,
    tst_minutes: row.tst_minutes ?? 0,
    waso_minutes: row.waso_minutes ?? 0,
    sleep_efficiency_pct: row.sleep_efficiency_pct ?? 0,
    rem_duration_minutes: row.rem_duration_minutes ?? 0,
    rem_pct_tst: Number(row.rem_pct_tst ?? 0),
    first_rem_onset: row.first_rem_onset?.slice(0, 5) ?? null,
    ahi: Number(row.ahi),
    min_spo2: row.min_spo2,
    mean_pr: row.mean_pr,
    min_pr: row.min_pr,
    sns_pct: row.sns_pct,
    pns_pct: row.pns_pct,
    hypoxic_burden: row.hypoxic_burden != null ? Number(row.hypoxic_burden) : null,
    signal_quality_pct: row.signal_quality_pct,
  }
}

export default async function PatientDashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/dashboard')
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  const { data: deviceProfile } = await supabase
    .from('patient_profiles')
    .select('device_alert_triggered, reminders_enabled')
    .eq('id', user.id)
    .maybeSingle()

  const { data: meds } = await supabase
    .from('patient_medications')
    .select('medication_code')
    .eq('patient_id', user.id)
    .eq('is_active', true)

  const { data: chronotype } = await supabase
    .from('chronotype_profiles')
    .select('msf_sc')
    .eq('patient_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: assessment } = await supabase
    .from('tiptraq_assessments')
    .select('metabolic_alert_triggered')
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const today = new Date().toISOString().slice(0, 10)
  const { data: todayAcks } = await supabase
    .from('medication_reminder_acks')
    .select('medication_code')
    .eq('patient_id', user.id)
    .eq('ack_date', today)

  const btiPayloads = await loadPatientBti(supabase, user.id)
  const dlmoProxy = await loadDlmoProxy(supabase, user.id)
  const pendingRecommendations = await fetchPendingRecommendations(supabase, user.id)
  const tiptraqRecords = await fetchPatientTipTraqNights(supabase, user.id)
  const tiptraqNights = tiptraqRecords
    .map((r) => toNightInput(r))
    .filter((n): n is TipTraqNightInput => n != null)

  const hasOnboarding = Boolean(chronotype)
  const hasMeds = (meds?.length ?? 0) > 0

  const doseDash = hasOnboarding
    ? buildDoseDash({
        dlmoEstimateHours: context.dlmoEstimateHours,
        circadianScore: context.circadianScore,
        sjlHours: context.sjlHours,
        metabolicAlertTriggered: assessment?.metabolic_alert_triggered ?? false,
        btiPayloads,
        tiptraqNights,
        hasMeds,
        msfScHours: chronotype?.msf_sc != null ? Number(chronotype.msf_sc) : null,
        dlmoProxy,
      })
    : null

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Dose dash</p>
        <h1 className="seco-page__title">Your timing today</h1>
        <p className="seco-page__lede">
          One view: metabolic risk from your sleep block, what to do next, and when to dose each
          daily cue.
        </p>
      </header>

      {!hasOnboarding && (
        <Callout tone="warning">
          Complete onboarding to unlock your dose dash.{' '}
          <Link href="/patient/onboarding/consent" className="font-medium underline">
            Continue setup
          </Link>
        </Callout>
      )}

      {deviceProfile?.device_alert_triggered && (
        <Callout tone="warning">
          Device sync interrupted — reconnect in{' '}
          <Link href="/patient/dashboard/data" className="font-medium underline">
            Smart devices
          </Link>
          .
        </Callout>
      )}

      {hasMeds && (
        <DosingReminderBanner
          payloads={btiPayloads}
          remindersEnabled={deviceProfile?.reminders_enabled ?? true}
          todayAcks={(todayAcks ?? []).map((a) => a.medication_code)}
        />
      )}

      <PendingRecommendationsPanel recommendations={pendingRecommendations} />

      {doseDash && (
        <DoseDashStack model={doseDash} medDetail={medClusterDetail(btiPayloads)} />
      )}

      {hasOnboarding && !hasMeds && (
        <div className="flex justify-center">
          <Button href="/patient/onboarding/medications" variant="secondary">
            Add medicines
          </Button>
        </div>
      )}
    </div>
  )
}
