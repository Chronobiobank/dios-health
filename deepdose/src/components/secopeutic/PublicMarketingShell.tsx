'use client'

import type { ReactNode } from 'react'

import { SecopeuticDemoShell } from '@/components/secopeutic/SecopeuticDemoShell'

type PublicMarketingShellProps = {
  children: ReactNode
}

/** All public routes use the homepage dark Maven shell. */
export function PublicMarketingShell({ children }: PublicMarketingShellProps) {
  return <SecopeuticDemoShell variant="dark">{children}</SecopeuticDemoShell>
}
