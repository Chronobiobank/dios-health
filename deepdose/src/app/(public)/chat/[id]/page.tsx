import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { ChatThread } from '@/components/chat/ChatThread'
import { AppTopBarBack } from '@/components/deepdose/AppTopBar'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
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
    redirect(`/?next=/chat/${id}`)
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
    <ProductAppShell
      title={peer.displayName}
      leading={<AppTopBarBack href="/chat" label="Back to messages" />}
      className="dd-chat-shell"
    >
      <ChatThread
        conversationId={id}
        currentUserId={user.id}
        peer={peer}
        initialMessages={messages}
      />
    </ProductAppShell>
  )
}
