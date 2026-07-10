import type { Metadata } from 'next'
import Link from 'next/link'

import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/connect' },
}

/** Face-forward match matrix — Chat soft-gates login. */
export default async function ConnectPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const messageHref = user ? '/chat' : '/?next=/chat'

  return (
    <article className="seco-page seco-marketing-page dd-connect">
      <div className="seco-landing__section-inner dd-connect__inner">
        <header className="dd-connect__head seco-reveal seco-reveal--1">
          <h1 className="seco-page__title dd-connect__title">
            <span className="seco-landing__hero-spectrum">Your matches</span>
          </h1>
          {user ? (
            <Link href="/chat" className="dd-connect__inbox-link">
              Inbox
            </Link>
          ) : (
            <Link href="/?next=/chat" className="dd-connect__inbox-link">
              Sign in
            </Link>
          )}
        </header>

        <CommunityMatchesPanel variant="discovery" messageHref={messageHref} />
      </div>
    </article>
  )
}
