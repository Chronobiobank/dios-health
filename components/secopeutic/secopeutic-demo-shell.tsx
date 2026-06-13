import Link from 'next/link'
import type { ReactNode } from 'react'

import { SecopeuticWordmark } from '@/components/brand/secopeutic-wordmark'
import { SECOPUTIC_DEMO_PATH, SECOPUTIC_LANDING_PATH, SECOPUTIC_PILOT_PATH } from '@/lib/secopeutic/site'

type SecopeuticDemoShellProps = {
  children: ReactNode
  context?: string
  /** maven.com dark header on landing */
  variant?: 'dark' | 'light'
}

export function SecopeuticDemoShell({
  children,
  context = 'Pilot demo',
  variant = 'light',
}: SecopeuticDemoShellProps) {
  return (
    <div
      data-clinical-layout
      className={variant === 'dark' ? 'clinical-layout secopeutic-demo seco-shell--dark' : 'clinical-layout secopeutic-demo'}
    >
      <header className="clinical-site-nav">
        <Link href={SECOPUTIC_LANDING_PATH} className="clinical-site-nav__brand">
          <SecopeuticWordmark />
        </Link>
        <span className="clinical-site-nav__context">{context}</span>
        <div className="clinical-site-nav__actions">
          <Link href={SECOPUTIC_DEMO_PATH} className="clinical-site-nav__link">
            Monitoring demo
          </Link>
          <Link href={`${SECOPUTIC_LANDING_PATH}#clinics`} className="clinical-site-nav__link">
            Certified clinics
          </Link>
          <Link href={SECOPUTIC_PILOT_PATH} className="seco-nav__cta">
            Claim pilot
          </Link>
        </div>
      </header>
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
