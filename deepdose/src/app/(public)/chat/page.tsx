import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { ChatInbox } from '@/components/chat/ChatInbox'
import { ensureGuideConversation, listInbox } from '@/lib/chat/queries'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `Chat · ${DEEPDOSE_NAME}`,
  description: 'Message people who share your chemistry.',
  alternates: { canonical: '/chat' },
  robots: { index: false, follow: false },
}

export default async function ChatInboxPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/chat')
  }

  const guide = await ensureGuideConversation(supabase)
  const { items, error } = await listInbox(supabase, user.id)
  const alert = guide.error ?? error

  return (
    <div className="dd-chat-shell">
      <div className="dd-chat-shell__inner">
        {alert ? (
          <p className="dd-chat__error" role="alert">
            {alert}
          </p>
        ) : null}
        <ChatInbox items={items} />
      </div>
    </div>
  )
}
