import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { loadDlmoProxy } from '@/lib/circadian/load-dlmo-proxy'

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

// Compute the free-tier smartphone / wearable DLMO proxy on the fly.
export async function GET(request: Request) {
  const supabase = await createClient()
  const resolved = await resolvePatientId(supabase, request)
  if ('error' in resolved) {
    return Response.json({ error: resolved.error }, { status: resolved.status })
  }

  const proxy = await loadDlmoProxy(supabase, resolved.patientId)
  return Response.json({ proxy })
}

// Compute and persist a snapshot into dlmo_estimates (patient-owned, smartphone_l3).
export async function POST(request: Request) {
  const supabase = await createClient()
  const resolved = await resolvePatientId(supabase, request)
  if ('error' in resolved) {
    return Response.json({ error: resolved.error }, { status: resolved.status })
  }

  // Persisting writes a patient-owned row; RLS only permits the patient themselves.
  if (resolved.patientId !== resolved.userId) {
    return Response.json(
      { error: 'Only the patient can persist their own proxy reading.' },
      { status: 403 }
    )
  }

  const proxy = await loadDlmoProxy(supabase, resolved.patientId)

  if (!proxy.available || proxy.dlmoTime === null) {
    return Response.json(
      { proxy, persisted: false, reason: 'No phone, wearable, or chronotype data yet.' },
      { status: 200 }
    )
  }

  const { error: insertError } = await supabase.from('dlmo_estimates').insert({
    patient_id: resolved.patientId,
    method: proxy.method,
    dlmo_time: proxy.dlmoTime,
    confidence: proxy.confidence,
    phase_offset: proxy.phaseOffsetMinutes,
    raw_data: proxy,
  })

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  return Response.json({ proxy, persisted: true })
}
