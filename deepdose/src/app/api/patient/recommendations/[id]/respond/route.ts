import { createClient } from '@/lib/supabase/server'
import { respondToRecommendation } from '@/lib/prescribing/recommendations'

export async function POST(
  request: Request,
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

  let body: { action?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.action !== 'accepted' && body.action !== 'declined') {
    return Response.json({ error: 'action must be accepted or declined' }, { status: 400 })
  }

  const result = await respondToRecommendation(supabase, user.id, id, body.action)

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({ ok: true, status: body.action })
}
