import { createClient } from '@/lib/supabase/server'
import { insertTipTraqNight } from '@/lib/clinical/tiptraq-nights'
import type { TipTraqNightInput } from '@/lib/clinical/tiptraq/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as {
    patient_id?: string
    assessment_id?: string
    night?: TipTraqNightInput
  }

  if (!body.patient_id || !body.night) {
    return Response.json({ error: 'patient_id and night are required.' }, { status: 400 })
  }

  const result = await insertTipTraqNight(
    supabase,
    user.id,
    body.patient_id,
    body.night,
    body.assessment_id ?? null
  )

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({ id: result.id })
}
