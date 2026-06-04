'use client'

import { DashboardPageTransition } from '@/components/dashboard/dashboard-page-transition'
import { cn } from '@/lib/utils'

type DashboardSettingsPageProps = {
  children: React.ReactNode
  className?: string
}

/** Profile, data controls, and streams — shared tablet/desktop rhythm. */
export function DashboardSettingsPage({ children, className }: DashboardSettingsPageProps) {
  return (
    <DashboardPageTransition className={cn('dashboard-settings-page', className)}>
      {children}
    </DashboardPageTransition>
  )
}
