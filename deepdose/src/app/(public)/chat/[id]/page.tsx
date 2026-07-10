import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { ChatThread } from '@/components/chat/ChatThread'
import { getThreadPeer, listMessages } from '@/lib/chat/queries'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: `Chat · ${DEEPDOSE_NAME}`,
  robots: { index: false, follow: false },
}

export default async function ChatThreadPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(`/login?next=/chat/${id}`)
  }

  const { peer, error: peerError } = await getThreadPeer(supabase, id, user.id)
  if (peerError === 'Forbidden' || peerError === 'No peer' || !peer) {
    notFound()
  }
  if (peerError) {
    redirect('/chat')
  }

  const { messages, error } = await listMessages(supabase, id)
  if (error) {
    redirect('/chat')
  }

  return (
    <article className="seco-page seco-marketing-page dd-chat-shell">
      <div className="seco-landing__section-inner dd-chat-shell__inner">
        <ChatThread
          conversationId={id}
          currentUserId={user.id}
          peer={peer}
          initialMessages={messages}
        />
      </div>
    </article>
  )
}
