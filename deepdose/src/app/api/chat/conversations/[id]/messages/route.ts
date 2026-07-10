import { createClient } from '@/lib/supabase/server'
import { getThreadPeer, listMessages, sendMessage } from '@/lib/chat/queries'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id: conversationId } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { peer, error: peerError } = await getThreadPeer(supabase, conversationId, user.id)
  if (peerError || !peer) {
    const status = peerError === 'Forbidden' ? 403 : 404
    return Response.json({ error: peerError ?? 'Not found' }, { status })
  }

  const { messages, error } = await listMessages(supabase, conversationId)
  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ peer, messages })
}

export async function POST(request: Request, context: RouteContext) {
  const { id: conversationId } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { peer, error: peerError } = await getThreadPeer(supabase, conversationId, user.id)
  if (peerError || !peer) {
    const status = peerError === 'Forbidden' ? 403 : 404
    return Response.json({ error: peerError ?? 'Not found' }, { status })
  }

  let body: { body?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { message, error } = await sendMessage(supabase, conversationId, user.id, body.body ?? '')
  if (error || !message) {
    const status = error?.includes('characters') ? 400 : 500
    return Response.json({ error: error ?? 'Send failed' }, { status })
  }

  return Response.json({ message })
}
