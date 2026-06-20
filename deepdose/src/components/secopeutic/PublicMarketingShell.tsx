'use client'

import type { ReactNode } from 'react'

import { SecopeuticDemoShell } from '@/components/secopeutic/SecopeuticDemoShell'
import { SecopeuticFooter } from '@/components/secopeutic/SecopeuticFooter'

type PublicMarketingShellProps = {
  children: ReactNode
}

/** All public routes use the homepage dark Maven shell, with a shared footer. */
export function PublicMarketingShell({ children }: PublicMarketingShellProps) {
  return (
    <SecopeuticDemoShell variant="dark">
      {children}
      <SecopeuticFooter />
    </SecopeuticDemoShell>
  )
}
