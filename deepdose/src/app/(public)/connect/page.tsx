import type { Metadata } from 'next'
import Link from 'next/link'

import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { CONNECT_PAGE, CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/connect' },
}

/** Face-forward match matrix — Message soft-gates login. */
export default async function ConnectPage() {
  const copy = CONNECT_PAGE
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const messageHref = user ? '/chat' : '/login?next=/chat'

  return (
    <div className="dd-connect">
      <header className="dd-connect__head">
        <h1 className="dd-connect__title">
          <span className="dd-connect__title-line dd-connect__title-line--white">
            {copy.titleBefore}
          </span>{' '}
          <span className="dd-connect__title-line dd-connect__title-line--spectrum">
            {copy.titleHighlight}
          </span>
        </h1>
        {user ? (
          <Link href="/chat" className="dd-connect__inbox-link">
            Open inbox
          </Link>
        ) : (
          <Link href="/login?next=/chat" className="dd-connect__inbox-link">
            Sign in
          </Link>
        )}
      </header>

      <CommunityMatchesPanel variant="discovery" messageHref={messageHref} />
    </div>
  )
}
