import Link from 'next/link'

import { DIOS_BRAND_NAME, DIOS_LOGO_MARK, DIOS_TAGLINE } from '@/components/DiosLogo'

import { NavActions } from './NavActions'
import { SiteNavHeader } from './SiteNavHeader'

export function Nav() {
  return (
    <SiteNavHeader>
      <div className="dios-site-nav__inner">
        <Link href="/" className="dios-site-nav__brand" aria-label={`${DIOS_BRAND_NAME} — ${DIOS_TAGLINE}`}>
          <span className="dios-site-nav__wordmark dios-wordmark nav-brand-wordmark">{DIOS_LOGO_MARK}</span>
        </Link>

        <div className="dios-site-nav__actions">
          <NavActions />
        </div>
      </div>
    </SiteNavHeader>
  )
}
