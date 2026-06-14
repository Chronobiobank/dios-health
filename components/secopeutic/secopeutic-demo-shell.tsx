import type { ReactNode } from 'react'

import { SecopeuticSiteNav } from '@/components/secopeutic/secopeutic-site-nav'

type SecopeuticDemoShellProps = {
  children: ReactNode
  context?: string
  /** maven.com dark header on landing */
  variant?: 'dark' | 'light'
}

export function SecopeuticDemoShell({
  children,
  context,
  variant = 'light',
}: SecopeuticDemoShellProps) {
  return (
    <div
      data-clinical-layout
      className={variant === 'dark' ? 'clinical-layout secopeutic-demo seco-shell--dark' : 'clinical-layout secopeutic-demo'}
    >
      <SecopeuticSiteNav context={context} />
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
