import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/connect' },
}

/** Dosers on your clock — Chat soft-gates login. */
export default async function ConnectPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const messageHref = user ? '/chat' : '/?next=/chat'
  const inboxHref = user ? '/chat' : '/?next=/chat'
  const inboxLabel = user ? 'Inbox' : 'Sign in'

  return (
    <ProductAppShell
      title="Friends"
      trailing={
        <Link href={inboxHref} className="app-top-bar__text-btn">
          {inboxLabel}
        </Link>
      }
      className="dd-connect"
    >
      <CommunityMatchesPanel variant="discovery" messageHref={messageHref} />
    </ProductAppShell>
  )
}
