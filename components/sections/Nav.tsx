import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

import { NavActions } from './NavActions'

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
          <NavActions />
        </div>
      </div>
    </header>
  )
}
