import Link from 'next/link'
import type { ReactNode } from 'react'

type SecopeuticDemoShellProps = {
  children: ReactNode
  context?: string
}

export function SecopeuticDemoShell({
  children,
  context = 'Pilot demo',
}: SecopeuticDemoShellProps) {
  return (
    <div data-clinical-layout className="clinical-layout secopeutic-demo">
      <header className="clinical-site-nav">
        <Link href="/secopeutic/demo" className="clinical-site-nav__brand secopeutic-demo__wordmark">
          Secopeutic
        </Link>
        <span className="clinical-site-nav__context">{context}</span>
        <div className="clinical-site-nav__actions">
          <Link href="/secopeutic/demo" className="clinical-site-nav__link">
            Cohort
          </Link>
          <Link href="/clinicians" className="clinical-site-nav__link">
            For clinicians
          </Link>
        </div>
      </header>
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
