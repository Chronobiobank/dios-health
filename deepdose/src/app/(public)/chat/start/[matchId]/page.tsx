import { notFound, redirect } from 'next/navigation'

import { createOrGetDm } from '@/lib/chat/queries'
import { peerUserIdForMatch } from '@/lib/chat/connect-demo-peers'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{ matchId: string }>
}

/** Create or open a DM with a Connect match, then land on the thread. */
export default async function StartConnectChatPage({ params }: PageProps) {
  const { matchId } = await params
  const peerUserId = peerUserIdForMatch(matchId)
  if (!peerUserId) notFound()

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(`/?next=${encodeURIComponent(`/chat/start/${matchId}`)}`)
  }

  const { conversationId, error } = await createOrGetDm(supabase, peerUserId, matchId)
  if (error || !conversationId) {
    redirect('/chat')
  }

  redirect(`/chat/${conversationId}`)
}
