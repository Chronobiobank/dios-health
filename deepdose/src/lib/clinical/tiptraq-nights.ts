import type { SupabaseClient } from '@supabase/supabase-js'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import {
  assessmentStatusFromNights,
  nextQuarterlyReviewFrom,
  TIPTRAQ_BASELINE_NIGHTS,
  type TipTraqAssessmentStatus,
} from '@/lib/clinical/tiptraq-program'
import { deriveMetabolicRiskAlert } from '@/lib/clinical/metabolic-alert'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import {
  ahiSeverity,
  confidenceFromNights,
  remLatencyStatus,
  spo2Status,
} from '@/lib/clinical/tiptraq/clinical-status'
import { proxyDlmoFromOnset } from '@/lib/clinical/tiptraq/metrics'
import type { TipTraqNightInput, TipTraqNightRecord } from '@/lib/clinical/tiptraq/types'
import { computeTipTraqBlockMetrics } from '@/lib/clinical/tiptraq/metrics'

function remLatencyMinutes(onset: string, firstRem: string | null | undefined): number {
  if (!firstRem) return 0
  const clockToMinutes = (clock: string) => {
    const [h, m] = clock.split(':').map(Number)
    return h * 60 + m
  }
  let onsetM = clockToMinutes(onset)
  let remM = clockToMinutes(firstRem)
  if (remM < onsetM) remM += 1440
  return remM - onsetM
}

function enrichNight(input: TipTraqNightInput) {
  const proxyDlmo = proxyDlmoFromOnset(input.sleep_onset)
  const remLat = remLatencyMinutes(input.sleep_onset, input.first_rem_onset)
  const { score, label } = confidenceFromNights(1)

  return {
    ahi_severity: ahiSeverity(input.ahi),
    proxy_dlmo_time: proxyDlmo,
    confidence_score: score,
    confidence_label: label,
    chronotype_signal:
      remLatencyStatus(remLat) === 'green' ? 'Intermediate-late' : 'Delayed / fragmented REM',
    apnea_confound_flag: input.ahi >= 15,
    high_sympathetic_flag: (input.sns_pct ?? 0) >= 70,
    rem_delay_flag: remLatencyStatus(remLat) === 'red',
    spo2_status: spo2Status(input.min_spo2),
  }
}

async function syncAssessmentFromNights(
  supabase: SupabaseClient,
  assessmentId: string,
  patientId: string,
  nightsCount: number
): Promise<void> {
  const { data: assessment } = await supabase
    .from('tiptraq_assessments')
    .select('*')
    .eq('id', assessmentId)
    .single()

  if (!assessment) return

  const nights = Math.min(assessment.nights_required, nightsCount)
  const status = assessmentStatusFromNights(
    nights,
    assessment.status as TipTraqAssessmentStatus
  ) as TipTraqAssessmentStatus

  const updates: Record<string, unknown> = {
    nights_recorded: nights,
    status,
    updated_at: new Date().toISOString(),
  }

  if (nights >= assessment.nights_required && !assessment.baseline_completed_at) {
    const completedAt = new Date().toISOString()
    updates.baseline_completed_at = completedAt
    updates.next_review_at = nextQuarterlyReviewFrom(completedAt)
    updates.status = 'baseline_complete'

    await supabase.from('wearable_connections').upsert(
      {
        patient_id: patientId,
        provider: 'tiptraq',
        connected_at: completedAt,
        last_sync_at: completedAt,
        sync_status: 'ok',
      },
      { onConflict: 'patient_id,provider' }
    )

    await supabase
      .from('patient_profiles')
      .update({ is_premium_tier: true })
      .eq('id', patientId)
  }

  const context = await getPatientCircadianContext(supabase, patientId)
  updates.metabolic_alert_triggered = deriveMetabolicRiskAlert({
    circadianScore: context.circadianScore,
    sjlHours: context.sjlHours,
    deviceAlertTriggered: false,
    tiptraqBaselineComplete: nights >= assessment.nights_required,
  })

  await supabase.from('tiptraq_assessments').update(updates).eq('id', assessmentId)
}

export async function insertTipTraqNight(
  supabase: SupabaseClient,
  clinicianId: string,
  patientId: string,
  input: TipTraqNightInput,
  assessmentId?: string | null
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const allowed = await clinicianCanAccessPatient(supabase, clinicianId, patientId)
  if (!allowed) return { ok: false, error: 'No access to this patient.' }

  const enriched = enrichNight(input)

  const { data, error } = await supabase
    .from('tiptraq_nights')
    .insert({
      patient_id: patientId,
      clinician_id: clinicianId,
      assessment_id: assessmentId ?? null,
      report_date: input.report_date,
      night_index: input.night_index ?? null,
      day_type: input.day_type ?? null,
      sleep_onset: input.sleep_onset,
      sleep_offset: input.sleep_offset,
      sleep_latency_minutes: input.sleep_latency_minutes,
      tst_minutes: input.tst_minutes,
      waso_minutes: input.waso_minutes,
      sleep_efficiency_pct: input.sleep_efficiency_pct,
      rem_duration_minutes: input.rem_duration_minutes,
      rem_pct_tst: input.rem_pct_tst,
      first_rem_onset: input.first_rem_onset ?? null,
      ahi: input.ahi,
      ahi_severity: enriched.ahi_severity,
      min_spo2: input.min_spo2 ?? null,
      mean_pr: input.mean_pr ?? null,
      min_pr: input.min_pr ?? null,
      sns_pct: input.sns_pct ?? null,
      pns_pct: input.pns_pct ?? null,
      hypoxic_burden: input.hypoxic_burden ?? null,
      signal_quality_pct: input.signal_quality_pct ?? null,
      proxy_dlmo_time: enriched.proxy_dlmo_time,
      confidence_score: enriched.confidence_score,
      confidence_label: enriched.confidence_label,
      chronotype_signal: enriched.chronotype_signal,
      apnea_confound_flag: enriched.apnea_confound_flag,
      high_sympathetic_flag: enriched.high_sympathetic_flag,
      rem_delay_flag: enriched.rem_delay_flag,
      clinician_note: input.clinician_note ?? null,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  if (assessmentId) {
    const { count } = await supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('assessment_id', assessmentId)

    await syncAssessmentFromNights(supabase, assessmentId, patientId, count ?? 0)
  }

  return { ok: true, id: data.id }
}

export async function fetchPatientTipTraqNights(
  supabase: SupabaseClient,
  patientId: string,
  assessmentId?: string | null
): Promise<TipTraqNightRecord[]> {
  let query = supabase
    .from('tiptraq_nights')
    .select('*')
    .eq('patient_id', patientId)
    .order('report_date', { ascending: true })

  if (assessmentId) {
    query = query.eq('assessment_id', assessmentId)
  }

  const { data } = await query
  return (data ?? []) as TipTraqNightRecord[]
}

export async function fetchClinicianTipTraqNightsSummary(
  supabase: SupabaseClient,
  clinicianId: string
): Promise<{ patientId: string; nightsCount: number; latestDate: string | null }[]> {
  const { data } = await supabase
    .from('tiptraq_nights')
    .select('patient_id, report_date')
    .eq('clinician_id', clinicianId)
    .order('report_date', { ascending: false })

  const byPatient = new Map<string, { count: number; latest: string | null }>()
  for (const row of data ?? []) {
    const current = byPatient.get(row.patient_id) ?? { count: 0, latest: null }
    current.count += 1
    if (!current.latest || row.report_date > current.latest) {
      current.latest = row.report_date
    }
    byPatient.set(row.patient_id, current)
  }

  return [...byPatient.entries()].map(([patientId, v]) => ({
    patientId,
    nightsCount: v.count,
    latestDate: v.latest,
  }))
}

export function buildBlockMetricsFromRecords(
  nights: TipTraqNightRecord[],
  nightsRequired = TIPTRAQ_BASELINE_NIGHTS
) {
  return computeTipTraqBlockMetrics(nights, nightsRequired)
}

export async function deleteTipTraqNight(
  supabase: SupabaseClient,
  clinicianId: string,
  nightId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: night } = await supabase
    .from('tiptraq_nights')
    .select('id, patient_id, assessment_id, clinician_id')
    .eq('id', nightId)
    .single()

  if (!night) return { ok: false, error: 'Night not found.' }
  if (night.clinician_id !== clinicianId) {
    const allowed = await clinicianCanAccessPatient(supabase, clinicianId, night.patient_id)
    if (!allowed) return { ok: false, error: 'No access.' }
  }

  const { error } = await supabase.from('tiptraq_nights').delete().eq('id', nightId)
  if (error) return { ok: false, error: error.message }

  if (night.assessment_id) {
    const { count } = await supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('assessment_id', night.assessment_id)

    await syncAssessmentFromNights(supabase, night.assessment_id, night.patient_id, count ?? 0)
  }

  return { ok: true }
}
