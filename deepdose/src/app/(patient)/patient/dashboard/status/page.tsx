import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { fetchPatientTipTraqNights } from '@/lib/clinical/tiptraq-nights'
import type { TipTraqNightInput, TipTraqNightRecord } from '@/lib/clinical/tiptraq/types'
import { buildTriFocalStatus } from '@/lib/unmed/build-tri-focal-status'
import { BiochemicalTriFocalDashboard } from '@/components/patient/BiochemicalTriFocalDashboard'
import { ActivationLinkedBanner } from '@/components/patient/ActivationLinkedBanner'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import { Suspense } from 'react'

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

export default async function PatientBiochemicalStatusPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/gate')
  }

  const nextOnboardingStep = await resolveOnboardingStep(supabase, user.id)
  if (nextOnboardingStep === 'consent' || nextOnboardingStep === 'medications') {
    redirect(onboardingPathForStep(nextOnboardingStep))
  }

  const context = await getPatientCircadianContext(supabase, user.id)
  const tiptraqRecords = await fetchPatientTipTraqNights(supabase, user.id)
  const tiptraqNights = tiptraqRecords
    .map((r) => toNightInput(r))
    .filter((n): n is TipTraqNightInput => n != null)

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const { data: sleepRows } = await supabase
    .from('wearable_sleep_logs')
    .select('sleep_onset_timestamp, wake_timestamp')
    .eq('patient_id', user.id)
    .gte('synced_at', since.toISOString())
    .order('sleep_onset_timestamp', { ascending: false })
    .limit(30)

  const sleepLogs = (sleepRows ?? [])
    .filter((row) => row.sleep_onset_timestamp && row.wake_timestamp)
    .map((row) => ({
      sleepOnset: row.sleep_onset_timestamp as string,
      wake: row.wake_timestamp as string,
    }))

  const model = buildTriFocalStatus({
    patientId: user.id,
    sleepLogs,
    tiptraqNights,
    circadianScore: context.circadianScore,
  })

  return (
    <div className="dash-meds space-y-6">
      <Suspense fallback={null}>
        <ActivationLinkedBanner />
      </Suspense>
      <BiochemicalTriFocalDashboard model={model} />
    </div>
  )
}
