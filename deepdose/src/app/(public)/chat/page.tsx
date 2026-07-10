import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { ChatInbox } from '@/components/chat/ChatInbox'
import { ensureGuideConversation, listInbox } from '@/lib/chat/queries'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `Chat · ${DEEPDOSE_NAME}`,
  description: 'Private DMs to share chemistry, correct what drifted, and stay connected.',
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
    redirect('/?next=/chat')
  }

  const guide = await ensureGuideConversation(supabase)
  const { items, error } = await listInbox(supabase, user.id)
  const alert = guide.error ?? error

  return (
    <article className="seco-page seco-marketing-page dd-chat-shell">
      <div className="seco-landing__section-inner dd-chat-shell__inner">
        {alert ? (
          <p className="dd-chat__error" role="alert">
            {alert}
          </p>
        ) : null}
        <ChatInbox items={items} />
      </div>
    </article>
  )
}
