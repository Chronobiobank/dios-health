import type { SupabaseClient } from '@supabase/supabase-js'
import {
  TIPTRAQ_BASELINE_NIGHTS,
  assessmentStatusFromNights,
  isReviewDue,
  nextQuarterlyReviewFrom,
  type TipTraqAssessmentStatus,
} from '@/lib/clinical/tiptraq-program'
import { deriveMetabolicRiskAlert } from '@/lib/clinical/metabolic-alert'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'

export type TipTraqAssessment = {
  id: string
  patient_id: string
  clinician_id: string
  status: TipTraqAssessmentStatus
  nights_recorded: number
  nights_required: number
  kit_ordered_at: string
  baseline_completed_at: string | null
  next_review_at: string | null
  metabolic_alert_triggered: boolean
  clinician_note: string | null
}

export async function orderTipTraqKit(
  supabase: SupabaseClient,
  clinicianId: string,
  patientId: string,
  note?: string
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { data: existing } = await supabase
    .from('tiptraq_assessments')
    .select('id, status')
    .eq('patient_id', patientId)
    .eq('clinician_id', clinicianId)
    .in('status', ['kit_ordered', 'baseline_in_progress', 'baseline_complete', 'review_due'])
    .maybeSingle()

  if (existing && existing.status !== 'review_due') {
    return { ok: false, error: 'An active TipTraQ assessment already exists for this patient.' }
  }

  if (existing?.status === 'review_due') {
    const { error: resetError } = await supabase
      .from('tiptraq_assessments')
      .update({
        status: 'kit_ordered',
        nights_recorded: 0,
        kit_ordered_at: new Date().toISOString(),
        baseline_completed_at: null,
        next_review_at: null,
        metabolic_alert_triggered: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (resetError) return { ok: false, error: resetError.message }
    return { ok: true, id: existing.id }
  }

  const { data, error } = await supabase
    .from('tiptraq_assessments')
    .insert({
      patient_id: patientId,
      clinician_id: clinicianId,
      clinician_note: note ?? null,
      status: 'kit_ordered',
      nights_required: TIPTRAQ_BASELINE_NIGHTS,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

export async function recordTipTraqNight(
  supabase: SupabaseClient,
  clinicianId: string,
  assessmentId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: assessment, error: fetchError } = await supabase
    .from('tiptraq_assessments')
    .select('*')
    .eq('id', assessmentId)
    .eq('clinician_id', clinicianId)
    .single()

  if (fetchError || !assessment) {
    return { ok: false, error: 'Assessment not found.' }
  }

  const nights = Math.min(
    assessment.nights_required,
    assessment.nights_recorded + 1
  )
  let status = assessmentStatusFromNights(
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
    status = 'baseline_complete'
    updates.status = status

    await supabase.from('wearable_connections').upsert(
      {
        patient_id: assessment.patient_id,
        provider: 'tiptraq',
        connected_at: completedAt,
        last_sync_at: completedAt,
        sync_status: 'ok',
      },
      { onConflict: 'patient_id,provider' }
    )
  }

  const context = await getPatientCircadianContext(supabase, assessment.patient_id)
  updates.metabolic_alert_triggered = deriveMetabolicRiskAlert({
    circadianScore: context.circadianScore,
    sjlHours: context.sjlHours,
    deviceAlertTriggered: false,
    tiptraqBaselineComplete: nights >= assessment.nights_required,
  })

  const { error: updateError } = await supabase
    .from('tiptraq_assessments')
    .update(updates)
    .eq('id', assessmentId)

  if (updateError) return { ok: false, error: updateError.message }

  if (nights >= assessment.nights_required) {
    await supabase
      .from('patient_profiles')
      .update({ is_premium_tier: true })
      .eq('id', assessment.patient_id)
  }

  return { ok: true }
}

export async function refreshTipTraqReviewStatuses(
  supabase: SupabaseClient,
  clinicianId: string
): Promise<void> {
  const { data: due } = await supabase
    .from('tiptraq_assessments')
    .select('id, next_review_at, status')
    .eq('clinician_id', clinicianId)
    .eq('status', 'baseline_complete')

  for (const row of due ?? []) {
    if (isReviewDue(row.next_review_at)) {
      await supabase
        .from('tiptraq_assessments')
        .update({ status: 'review_due', updated_at: new Date().toISOString() })
        .eq('id', row.id)
    }
  }
}

export async function fetchClinicianTipTraqQueue(
  supabase: SupabaseClient,
  clinicianId: string
): Promise<TipTraqAssessment[]> {
  await refreshTipTraqReviewStatuses(supabase, clinicianId)

  const { data } = await supabase
    .from('tiptraq_assessments')
    .select('*')
    .eq('clinician_id', clinicianId)
    .in('status', ['kit_ordered', 'baseline_in_progress', 'review_due'])
    .order('updated_at', { ascending: false })

  return (data ?? []) as TipTraqAssessment[]
}

export async function fetchPatientTipTraqAssessment(
  supabase: SupabaseClient,
  patientId: string,
  clinicianId: string
): Promise<TipTraqAssessment | null> {
  const { data } = await supabase
    .from('tiptraq_assessments')
    .select('*')
    .eq('patient_id', patientId)
    .eq('clinician_id', clinicianId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (data as TipTraqAssessment | null) ?? null
}
