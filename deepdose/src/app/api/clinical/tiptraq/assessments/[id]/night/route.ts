import { createClient } from '@/lib/supabase/server'
import { recordTipTraqNight } from '@/lib/clinical/tiptraq-assessments'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await recordTipTraqNight(supabase, user.id, id)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({ ok: true })
}
