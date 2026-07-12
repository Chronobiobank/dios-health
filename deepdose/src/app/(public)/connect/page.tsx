import type { Metadata } from 'next'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/connect' },
}

/** Sync — who is online in your biological window. Chat soft-gates login. */
export default async function ConnectPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const messageHref = user ? '/chat' : '/?next=/chat'

  return (
    <ProductAppShell title="Sync" className="dd-connect">
      <CommunityMatchesPanel variant="discovery" messageHref={messageHref} />
    </ProductAppShell>
  )
}
