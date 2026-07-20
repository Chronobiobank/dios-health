'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { AppBottomNav, AppBottomNavSpacer } from '@/components/deepdose/AppBottomNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import { useSupabaseUser } from '@/lib/auth/use-supabase-user'
import { isDeepdoseProductPath } from '@/lib/deepdose-marketing/site-nav-links'

type PublicMarketingShellProps = {
  children: ReactNode
}

/**
 * Public routes: light OpenAI grid shell.
 * Logged-in product routes hide the marketing header (AppTopBar owns chrome).
 * Guests / signup keep the homepage marketing top nav everywhere.
 */
export function PublicMarketingShell({ children }: PublicMarketingShellProps) {
  const pathname = usePathname() ?? '/'
  const product = isDeepdoseProductPath(pathname)
  const { user, ready } = useSupabaseUser()
  const memberProduct = product && ready && Boolean(user)

  useEffect(() => {
    document.documentElement.classList.toggle('product-route', memberProduct)
    return () => {
      document.documentElement.classList.remove('product-route')
    }
  }, [memberProduct])

  return (
    <DeepDoseShell variant="light" nav={memberProduct ? null : undefined}>
      {children}
      {/* Black dock — signed-in product routes only; never on public/marketing */}
      {memberProduct ? (
        <>
          <AppBottomNavSpacer />
          <AppBottomNav />
        </>
      ) : null}
    </DeepDoseShell>
  )
}
