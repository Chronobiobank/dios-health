import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { loadPatientBti } from '@/lib/bti/load-patient-bti'

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const patientIdParam = url.searchParams.get('patient_id')

  let patientId = user.id

  if (patientIdParam && patientIdParam !== user.id) {
    const canAccess = await clinicianCanAccessPatient(supabase, user.id, patientIdParam)
    if (!canAccess) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    patientId = patientIdParam
  }

  const payloads = await loadPatientBti(supabase, patientId)
  return Response.json({ payloads })
}
