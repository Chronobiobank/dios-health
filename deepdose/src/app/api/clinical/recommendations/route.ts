import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { createPrescribingRecommendation } from '@/lib/prescribing/recommendations'
import { MEDICATION_TIMINGS, type MedicationCode } from '@/lib/circadian/medications'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    patient_id?: string
    medication_code?: string
    recommended_timing?: string
    rationale?: string
    clinician_note?: string
    current_timing?: string
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const patientId = body.patient_id?.trim()
  const medicationCode = body.medication_code?.trim()
  const recommendedTiming = body.recommended_timing?.trim()

  if (!patientId || !medicationCode || !recommendedTiming) {
    return Response.json(
      { error: 'patient_id, medication_code, and recommended_timing are required' },
      { status: 400 }
    )
  }

  if (!(medicationCode in MEDICATION_TIMINGS)) {
    return Response.json({ error: 'Unknown medication' }, { status: 400 })
  }

  const canAccess = await clinicianCanAccessPatient(supabase, user.id, patientId)
  if (!canAccess) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: med } = await supabase
    .from('patient_medications')
    .select('current_timing')
    .eq('patient_id', patientId)
    .eq('medication_code', medicationCode)
    .eq('is_active', true)
    .maybeSingle()

  const result = await createPrescribingRecommendation(supabase, {
    patientId,
    clinicianId: user.id,
    medicationCode,
    recommendedTiming,
    rationale: body.rationale,
    clinicianNote: body.clinician_note,
    currentTiming: body.current_timing ?? med?.current_timing?.slice(0, 5) ?? null,
  })

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  const timing = MEDICATION_TIMINGS[medicationCode as MedicationCode]
  return Response.json({
    ok: true,
    id: result.id,
    medication: timing.displayName,
  })
}
