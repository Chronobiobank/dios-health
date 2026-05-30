import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

import { BTN_PRIMARY, CONTAINER } from './layout'
import { NavMenu } from './NavMenu'
import { NAV_DASHBOARD_LINK } from './navigation'

const LOGO_SIZE = 'text-[28px] leading-none sm:text-[32px]'
/** Matches NavMenu icon (h-5 / 20px) — secondary to the wordmark */
const TAGLINE_SIZE = 'text-xl leading-none'

export function Nav() {
  return (
    <header id="site-nav" className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center gap-3 sm:h-[4.5rem]`}>
        <Link
          href="/"
          className="inline-flex min-w-0 flex-1 items-center gap-x-1.5 sm:gap-x-2"
          aria-label="DIOS – Make Time Count"
        >
          <span className={`dios-wordmark nav-brand-wordmark shrink-0 ${LOGO_SIZE} text-black`}>
            {DIOS_WORDMARK}
          </span>
          <span className={`nav-brand-tagline shrink-0 ${TAGLINE_SIZE}`} aria-hidden>
            –
          </span>
          <span className={`nav-brand-tagline min-w-0 truncate ${TAGLINE_SIZE}`}>Make Time Count</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={NAV_DASHBOARD_LINK.href}
            className={`${BTN_PRIMARY} h-8 whitespace-nowrap px-3 text-[13px] sm:h-9 sm:px-4 sm:text-sm`}
          >
            <span className="min-[480px]:hidden">{NAV_DASHBOARD_LINK.mobileLabel}</span>
            <span className="hidden min-[480px]:inline">{NAV_DASHBOARD_LINK.label}</span>
          </Link>

          <NavMenu />
        </div>
      </div>
    </header>
  )
}
