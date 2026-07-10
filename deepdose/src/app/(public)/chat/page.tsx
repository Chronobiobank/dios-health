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

  await ensureGuideConversation(supabase)
  const { items, error } = await listInbox(supabase, user.id)

  return (
    <div className="dd-chat-shell">
      <div className="seco-landing__section-inner">
        {error ? (
          <p className="dd-chat__error" role="alert">
            {error}
          </p>
        ) : (
          <ChatInbox items={items} />
        )}
      </div>
    </div>
  )
}
