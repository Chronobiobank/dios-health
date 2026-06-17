import type { ReactNode } from 'react'

import { SecopeuticSiteNav } from '@/components/secopeutic/SecopeuticSiteNav'

type SecopeuticDemoShellProps = {
  children: ReactNode
  /** maven.com dark header on landing */
  variant?: 'dark' | 'light'
  /** Override default marketing nav (e.g. patient app chrome). */
  nav?: ReactNode
}

export function SecopeuticDemoShell({
  children,
  variant = 'light',
  nav,
}: SecopeuticDemoShellProps) {
  return (
    <div
      data-clinical-layout
      className={
        variant === 'dark'
          ? 'clinical-layout secopeutic-demo seco-shell--dark'
          : 'clinical-layout secopeutic-demo'
      }
    >
      {nav ?? <SecopeuticSiteNav />}
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
