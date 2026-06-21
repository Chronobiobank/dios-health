'use client'

import type { ReactNode } from 'react'

import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import { DeepDoseFooter } from '@/components/deepdose/DeepDoseFooter'

type PublicMarketingShellProps = {
  children: ReactNode
}

/** All public routes use the DeepDose dark shell with a shared footer. */
export function PublicMarketingShell({ children }: PublicMarketingShellProps) {
  return (
    <DeepDoseShell variant="dark">
      {children}
      <DeepDoseFooter />
    </DeepDoseShell>
  )
}
