import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { buildMedicationRecommendations } from '@/lib/medications/recommendations'

async function resolvePatientId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  request: Request
): Promise<{ patientId: string; userId: string } | { error: string; status: number }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 }
  }

  const patientIdParam = new URL(request.url).searchParams.get('patient_id')

  if (patientIdParam && patientIdParam !== user.id) {
    const canAccess = await clinicianCanAccessPatient(supabase, user.id, patientIdParam)
    if (!canAccess) {
      return { error: 'Forbidden', status: 403 }
    }
    return { patientId: patientIdParam, userId: user.id }
  }

  return { patientId: user.id, userId: user.id }
}

// Phase-adjusted chronotherapy timing windows for the patient's active medications.
export async function GET(request: Request) {
  const supabase = await createClient()
  const resolved = await resolvePatientId(supabase, request)
  if ('error' in resolved) {
    return Response.json({ error: resolved.error }, { status: resolved.status })
  }

  const context = await getPatientCircadianContext(supabase, resolved.patientId)

  const { data: patientMeds } = await supabase
    .from('patient_medications')
    .select('medication_code')
    .eq('patient_id', resolved.patientId)
    .eq('is_active', true)

  const codes = Array.from(
    new Set((patientMeds ?? []).map((m) => m.medication_code).filter(Boolean))
  )

  if (codes.length === 0) {
    return Response.json({
      recommendations: [],
      phaseOffsetMinutes: context.phaseOffsetMinutes,
      circadianScore: context.circadianScore,
    })
  }

  const { data: refs } = await supabase
    .from('medications')
    .select('code, display_name, drug_class, evidence_grade')
    .in('code', codes)

  const recommendations = buildMedicationRecommendations(
    refs ?? [],
    context.phaseOffsetMinutes
  )

  return Response.json({
    recommendations,
    phaseOffsetMinutes: context.phaseOffsetMinutes,
    circadianScore: context.circadianScore,
  })
}
