import Link from 'next/link'
import type { ReactNode } from 'react'

import { DiosWordmark } from '@/components/brand/dios-wordmark'
import {
  DIOS_CLINICIANS_CLINICS_PATH,
  DIOS_CLINICIANS_DEMO_PATH,
  DIOS_CLINICIANS_EVIDENCE_PATH,
  DIOS_CLINICIANS_PATH,
  DIOS_CLINICIANS_PILOT_PATH,
} from '@/lib/secopeutic/site'

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
        <Link href={DIOS_CLINICIANS_PATH} className="clinical-site-nav__brand">
          <DiosWordmark />
        </Link>
        <span className="clinical-site-nav__context">{context}</span>
        <div className="clinical-site-nav__actions">
          <Link href={DIOS_CLINICIANS_DEMO_PATH} className="clinical-site-nav__link">
            Monitoring demo
          </Link>
          <Link href={DIOS_CLINICIANS_EVIDENCE_PATH} className="clinical-site-nav__link">
            Evidence library
          </Link>
          <Link href={DIOS_CLINICIANS_CLINICS_PATH} className="clinical-site-nav__link">
            Certified clinics
          </Link>
          <Link href={DIOS_CLINICIANS_PILOT_PATH} className="seco-nav__cta">
            Claim pilot
          </Link>
        </div>
      </header>
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
