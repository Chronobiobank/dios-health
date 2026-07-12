'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { AppBottomNav, AppBottomNavSpacer } from '@/components/deepdose/AppBottomNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import { isDeepdoseProductPath } from '@/lib/deepdose-marketing/site-nav-links'

type PublicMarketingShellProps = {
  children: ReactNode
}

/** Public routes: light OpenAI grid shell + bottom nav. Product tabs hide the marketing header. */
export function PublicMarketingShell({ children }: PublicMarketingShellProps) {
  const pathname = usePathname() ?? '/'
  const product = isDeepdoseProductPath(pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('product-route', product)
    return () => {
      document.documentElement.classList.remove('product-route')
    }
  }, [product])

  return (
    <DeepDoseShell variant="light" nav={product ? null : undefined}>
      {children}
      <AppBottomNavSpacer />
      <AppBottomNav />
    </DeepDoseShell>
  )
}
