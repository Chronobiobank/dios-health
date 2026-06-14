import Link from 'next/link'
import type { ReactNode } from 'react'

import { DIOS_BRAND_NAME, DIOS_LOGO_MARK } from '@/components/DiosLogo'
import { MobileOverflowMenu } from '@/components/navigation/mobile-overflow-menu'
import { CLINICIAN_MOBILE_NAV_LINKS } from '@/lib/auth/mobile-nav-links'

type ClinicalShellProps = {
  children: ReactNode
  /** Mono uppercase label beside the wordmark (e.g. "Cohort triage"). */
  context?: string
}

export function ClinicalShell({ children, context = 'Clinical workspace' }: ClinicalShellProps) {
  return (
    <div data-clinical-layout className="clinical-layout">
      <header className="clinical-site-nav">
        <Link href="/clinic" className="clinical-site-nav__brand dios-wordmark" aria-label={DIOS_BRAND_NAME}>
          {DIOS_LOGO_MARK}
        </Link>
        <span className="clinical-site-nav__context">{context}</span>
        <div className="clinical-site-nav__actions">
          <div className="clinical-site-nav__actions-desktop">
            <Link href="/clinic/patients" className="clinical-site-nav__link">
              Patients
            </Link>
            <Link href="/" className="clinical-site-nav__link">
              Exit
            </Link>
          </div>
          <MobileOverflowMenu links={CLINICIAN_MOBILE_NAV_LINKS} />
        </div>
      </header>
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
