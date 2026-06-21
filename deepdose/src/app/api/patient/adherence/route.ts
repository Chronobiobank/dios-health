import { createClient } from '@/lib/supabase/server'
import { isTimeInWindow } from '@/lib/utils/time'
import { getMedicationDisplayName, isCatalogCode } from '@/lib/medications/catalog'
import { loadPatientBti } from '@/lib/bti/load-patient-bti'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { medication_code?: string; recommendation_id?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const medicationCode = body.medication_code?.trim()
  if (!medicationCode || !isCatalogCode(medicationCode)) {
    return Response.json({ error: 'Valid medication_code is required' }, { status: 400 })
  }

  const payloads = await loadPatientBti(supabase, user.id)
  const bti = payloads.find((p) => p.medication_id === medicationCode)
  const now = new Date()
  const current = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const windowStart = bti?.dosing_window_start.slice(11, 16) ?? '00:00'
  const windowEnd = bti?.dosing_window_end.slice(11, 16) ?? '00:00'
  const inWindow = bti ? isTimeInWindow(current, windowStart, windowEnd) : false

  const { error } = await supabase.from('medication_adherence_log').insert({
    patient_id: user.id,
    medication_code: medicationCode,
    in_window: inWindow,
    source: 'patient',
    recommendation_id: body.recommendation_id ?? null,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const today = now.toISOString().slice(0, 10)
  await supabase.from('medication_reminder_acks').upsert(
    {
      patient_id: user.id,
      medication_code: medicationCode,
      ack_date: today,
    },
    { onConflict: 'patient_id,medication_code,ack_date' }
  )

  return Response.json({
    ok: true,
    medication: getMedicationDisplayName(medicationCode),
    in_window: inWindow,
  })
}
