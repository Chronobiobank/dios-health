'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { AppBottomNav, AppBottomNavSpacer } from '@/components/deepdose/AppBottomNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import { isDeepdoseProductPath } from '@/lib/deepdose-marketing/site-nav-links'

type PublicMarketingShellProps = {
  children: ReactNode
}

/** Public routes: dark shell + bottom nav. Product tabs hide the marketing header. */
export function PublicMarketingShell({ children }: PublicMarketingShellProps) {
  const pathname = usePathname() ?? '/'
  const product = isDeepdoseProductPath(pathname)

  return (
    <DeepDoseShell variant="dark" nav={product ? null : undefined}>
      {children}
      <AppBottomNavSpacer />
      <AppBottomNav />
    </DeepDoseShell>
  )
}
