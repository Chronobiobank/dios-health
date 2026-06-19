import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { orderTipTraqKit } from '@/lib/clinical/tiptraq-assessments'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { patient_id?: string; note?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const patientId = body.patient_id?.trim()
  if (!patientId) {
    return Response.json({ error: 'patient_id is required' }, { status: 400 })
  }

  const canAccess = await clinicianCanAccessPatient(supabase, user.id, patientId)
  if (!canAccess) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const result = await orderTipTraqKit(supabase, user.id, patientId, body.note)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({ ok: true, id: result.id })
}
