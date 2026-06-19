import { createClient } from '@/lib/supabase/server'
import { insertTipTraqNight } from '@/lib/clinical/tiptraq-nights'
import { SEAN_JAMES_TIPTRAQ_BLOCK } from '@/lib/clinical/tiptraq/sean-james-fixture'

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
  }

  if (!body.patient_id || !body.assessment_id) {
    return Response.json({ error: 'patient_id and assessment_id are required.' }, { status: 400 })
  }

  const ids: string[] = []
  for (const night of SEAN_JAMES_TIPTRAQ_BLOCK) {
    const result = await insertTipTraqNight(
      supabase,
      user.id,
      body.patient_id,
      night,
      body.assessment_id
    )
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 400 })
    }
    ids.push(result.id)
  }

  return Response.json({ ids, count: ids.length })
}
