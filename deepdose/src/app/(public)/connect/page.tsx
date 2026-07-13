import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CONNECT_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: CONNECT_PAGE_META.title,
  description: CONNECT_PAGE_META.description,
  alternates: { canonical: '/founders' },
}

/**
 * Guest Sync hub moved to /founders (how + signup).
 * Signed-in Sync goes to matches discovery.
 */
export default async function ConnectPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  redirect(user ? '/matches' : '/founders')
}
