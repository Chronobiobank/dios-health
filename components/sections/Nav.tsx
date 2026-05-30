import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

import { NavMenu } from './NavMenu'
import { NAV_DASHBOARD_LINK } from './navigation'

export function Nav() {
  return (
    <header id="site-nav" className="dios-site-nav">
      <div className="dios-site-nav__inner">
        <Link href="/" className="dios-site-nav__brand" aria-label="DIOS – Make Time Count">
          <span className="dios-site-nav__wordmark dios-wordmark nav-brand-wordmark">{DIOS_WORDMARK}</span>
          <span className="nav-brand-tagline hidden shrink-0 sm:inline" aria-hidden>
            –
          </span>
          <span className="nav-brand-tagline hidden min-w-0 truncate sm:inline">Make Time Count</span>
        </Link>

        <div className="dios-site-nav__actions">
          <Link href={NAV_DASHBOARD_LINK.href} className="dios-site-nav__cta type-button">
            <span className="dios-site-nav__cta-short">{NAV_DASHBOARD_LINK.mobileLabel}</span>
            <span className="dios-site-nav__cta-long">{NAV_DASHBOARD_LINK.label}</span>
          </Link>

          <NavMenu />
        </div>
      </div>
    </header>
  )
}
