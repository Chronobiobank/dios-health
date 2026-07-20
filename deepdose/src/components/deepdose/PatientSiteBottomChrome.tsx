'use client'

import { AppBottomNav, AppBottomNavSpacer } from '@/components/deepdose/AppBottomNav'
import { useSupabaseUser } from '@/lib/auth/use-supabase-user'

/** Same bottom nav as public product routes — only when signed in. */
export function PatientSiteBottomChrome() {
  const { user, ready } = useSupabaseUser()
  if (!ready || !user) return null

  return (
    <>
      <AppBottomNavSpacer />
      <AppBottomNav />
    </>
  )
}
