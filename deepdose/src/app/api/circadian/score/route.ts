import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'

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

// Circadian Health Index (CHI) — composite summary for clinician triage.
export async function GET(request: Request) {
  const supabase = await createClient()
  const resolved = await resolvePatientId(supabase, request)
  if ('error' in resolved) {
    return Response.json({ error: resolved.error }, { status: resolved.status })
  }

  const context = await getPatientCircadianContext(supabase, resolved.patientId)

  return Response.json({
    score: {
      value: context.circadianScore,
      components: context.scoreComponents,
      phaseOffsetMinutes: context.phaseOffsetMinutes,
      dlmoEstimateHours: context.dlmoEstimateHours,
      sjlHours: context.sjlHours,
      chronotypeCat: context.chronotypeCat,
    },
  })
}

// Persist a CHI snapshot into circadian_scores (patient-owned).
export async function POST(request: Request) {
  const supabase = await createClient()
  const resolved = await resolvePatientId(supabase, request)
  if ('error' in resolved) {
    return Response.json({ error: resolved.error }, { status: resolved.status })
  }

  if (resolved.patientId !== resolved.userId) {
    return Response.json(
      { error: 'Only the patient can persist their own score.' },
      { status: 403 }
    )
  }

  const context = await getPatientCircadianContext(supabase, resolved.patientId)

  if (!context.scoreComponents) {
    return Response.json(
      { persisted: false, reason: 'No chronotype data yet — complete the assessment first.' },
      { status: 200 }
    )
  }

  const { error: insertError } = await supabase.from('circadian_scores').insert({
    patient_id: resolved.patientId,
    score: context.circadianScore,
    components: {
      ...context.scoreComponents,
      phaseOffsetMinutes: context.phaseOffsetMinutes,
      dlmoEstimateHours: context.dlmoEstimateHours,
      sjlHours: context.sjlHours,
    },
  })

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  return Response.json({ persisted: true, score: context.circadianScore })
}
