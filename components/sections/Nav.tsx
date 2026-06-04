import Link from 'next/link'

import { DIOS_TAGLINE, DIOS_WORDMARK } from '@/components/DiosLogo'

import { NavActions } from './NavActions'
import { SiteNavHeader } from './SiteNavHeader'

export function Nav() {
  return (
    <SiteNavHeader>
      <div className="dios-site-nav__inner">
        <Link href="/" className="dios-site-nav__brand" aria-label={`DIOS — ${DIOS_TAGLINE}`}>
          <span className="dios-site-nav__wordmark dios-wordmark nav-brand-wordmark">{DIOS_WORDMARK}</span>
        </Link>

        <div className="dios-site-nav__actions">
          <NavActions />
        </div>
      </div>
    </SiteNavHeader>
  )
}
