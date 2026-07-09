'use client'

import type { ReactNode } from 'react'

import { AppBottomNav, AppBottomNavSpacer } from '@/components/deepdose/AppBottomNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'

type PublicMarketingShellProps = {
  children: ReactNode
}

/** Public routes: dark shell + bottom nav. */
export function PublicMarketingShell({ children }: PublicMarketingShellProps) {
  return (
    <DeepDoseShell variant="dark">
      {children}
      <AppBottomNavSpacer />
      <AppBottomNav />
    </DeepDoseShell>
  )
}
