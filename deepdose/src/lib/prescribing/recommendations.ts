import type { SupabaseClient } from '@supabase/supabase-js'

export type PrescribingStatus = 'pending' | 'accepted' | 'declined' | 'modified'

export interface PrescribingRecommendation {
  id: string
  patient_id: string
  clinician_id: string
  medication_code: string
  current_timing: string | null
  recommended_timing: string
  rationale: string | null
  status: PrescribingStatus
  clinician_note: string | null
  created_at: string
  actioned_at: string | null
}

export interface CreateRecommendationInput {
  patientId: string
  clinicianId: string
  medicationCode: string
  recommendedTiming: string
  rationale?: string
  clinicianNote?: string
  currentTiming?: string | null
}

function timeToDb(time: string): string {
  return time.length === 5 ? `${time}:00` : time
}

export async function createPrescribingRecommendation(
  supabase: SupabaseClient,
  input: CreateRecommendationInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { data, error } = await supabase
    .from('prescribing_recommendations')
    .insert({
      patient_id: input.patientId,
      clinician_id: input.clinicianId,
      medication_code: input.medicationCode,
      current_timing: input.currentTiming ? timeToDb(input.currentTiming) : null,
      recommended_timing: timeToDb(input.recommendedTiming),
      rationale: input.rationale ?? null,
      clinician_note: input.clinicianNote ?? null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

export async function respondToRecommendation(
  supabase: SupabaseClient,
  patientId: string,
  recommendationId: string,
  action: 'accepted' | 'declined'
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: rec, error: fetchError } = await supabase
    .from('prescribing_recommendations')
    .select('id, patient_id, medication_code, recommended_timing, status')
    .eq('id', recommendationId)
    .eq('patient_id', patientId)
    .single()

  if (fetchError || !rec) {
    return { ok: false, error: 'Recommendation not found.' }
  }

  if (rec.status !== 'pending') {
    return { ok: false, error: 'This recommendation was already actioned.' }
  }

  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('prescribing_recommendations')
    .update({ status: action, actioned_at: now })
    .eq('id', recommendationId)
    .eq('patient_id', patientId)

  if (updateError) return { ok: false, error: updateError.message }

  if (action === 'accepted') {
    const { error: medError } = await supabase
      .from('patient_medications')
      .update({ current_timing: rec.recommended_timing })
      .eq('patient_id', patientId)
      .eq('medication_code', rec.medication_code)
      .eq('is_active', true)

    if (medError) return { ok: false, error: medError.message }
  }

  await supabase.from('prescribing_outcomes').insert({
    recommendation_id: recommendationId,
    patient_id: patientId,
    outcome_type: 'adherence',
    value: action === 'accepted' ? 1 : 0,
    unit: 'decision',
    measured_at: now,
    reported_by: 'patient',
    notes: action === 'accepted' ? 'Patient accepted timing change' : 'Patient declined timing change',
  })

  return { ok: true }
}

export async function fetchPendingRecommendations(
  supabase: SupabaseClient,
  patientId: string
): Promise<PrescribingRecommendation[]> {
  const { data } = await supabase
    .from('prescribing_recommendations')
    .select('*')
    .eq('patient_id', patientId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (data ?? []) as PrescribingRecommendation[]
}

export async function fetchPatientRecommendationsForClinician(
  supabase: SupabaseClient,
  patientId: string
): Promise<PrescribingRecommendation[]> {
  const { data } = await supabase
    .from('prescribing_recommendations')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(20)

  return (data ?? []) as PrescribingRecommendation[]
}
