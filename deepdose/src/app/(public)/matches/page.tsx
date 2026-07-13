import type { Metadata } from 'next'

import { AppTopBarBack } from '@/components/deepdose/AppTopBar'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { MATCHES_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: MATCHES_PAGE_META.title,
  description: MATCHES_PAGE_META.description,
  alternates: { canonical: '/matches' },
}

/** Matches — people awake in your biological window. */
export default async function MatchesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <ProductAppShell
      title="Matches"
      leading={<AppTopBarBack href="/grid" label="Back" />}
      className="dd-connect"
    >
      <CommunityMatchesPanel variant="discovery" signedIn={Boolean(user)} />
    </ProductAppShell>
  )
}
