import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ChatInbox } from '@/components/chat/ChatInbox'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { ensureGuideConversation, listInbox } from '@/lib/chat/queries'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `Chat · ${DEEPDOSE_NAME}`,
  description: 'Private DMs with friends on your clock.',
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
    <ProductAppShell
      title="Messages"
      trailing={
        <Link href="/connect" className="app-top-bar__text-btn">
          Friends
        </Link>
      }
      className="dd-chat-shell"
    >
      {alert ? (
        <p className="dd-chat__error" role="alert">
          {alert}
        </p>
      ) : null}
      <ChatInbox items={items} />
    </ProductAppShell>
  )
}
