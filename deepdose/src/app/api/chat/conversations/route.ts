import { createClient } from '@/lib/supabase/server'
import { createOrGetDm, ensureGuideConversation, listInbox } from '@/lib/chat/queries'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const guide = await ensureGuideConversation(supabase)
  if (guide.error) {
    return Response.json({ error: guide.error }, { status: 500 })
  }

  const { items, error } = await listInbox(supabase, user.id)
  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ conversations: items })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { peerUserId?: string; sourceMatchId?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const peerUserId = body.peerUserId?.trim()
  if (!peerUserId) {
    return Response.json({ error: 'peerUserId is required' }, { status: 400 })
  }

  const { conversationId, error } = await createOrGetDm(
    supabase,
    peerUserId,
    body.sourceMatchId ?? null
  )

  if (error || !conversationId) {
    return Response.json({ error: error ?? 'Could not create conversation' }, { status: 500 })
  }

  return Response.json({ conversationId })
}
