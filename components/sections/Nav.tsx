import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

import { BTN_PRIMARY, CONTAINER } from './layout'
import { NavMenu } from './NavMenu'
import { NAV_ACCOUNT_LINKS } from './navigation'

const LOGO_SIZE = 'text-[28px] leading-none sm:text-[32px]'
/** Matches NavMenu icon (h-5 / 20px) — secondary to the wordmark */
const TAGLINE_SIZE = 'text-xl leading-none'

export function Nav() {
  return (
    <header id="site-nav" className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center sm:h-[4.5rem]`}>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center"
          aria-label="DIʘS — Make Time Count"
        >
          <span className={`dios-wordmark nav-brand-wordmark ${LOGO_SIZE} text-black`}>
            {DIOS_WORDMARK}
          </span>
        </Link>

        <div className="ml-auto flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <span className={`nav-brand-tagline hidden min-[480px]:inline ${TAGLINE_SIZE}`}>
            Make Time Count
          </span>

          <nav
            aria-label="Account"
            className="flex shrink-0 items-center gap-2 border-r border-black/10 pr-2 sm:gap-3 sm:pr-3"
          >
            <Link
              href={NAV_ACCOUNT_LINKS[0].href}
              className="type-nav whitespace-nowrap text-[13px] transition-colors hover:text-black sm:text-sm"
            >
              {NAV_ACCOUNT_LINKS[0].label}
            </Link>
            <Link
              href={NAV_ACCOUNT_LINKS[1].href}
              className={`${BTN_PRIMARY} h-8 whitespace-nowrap px-3 text-[13px] sm:h-9 sm:px-4 sm:text-sm`}
            >
              <span className="min-[480px]:hidden">{NAV_ACCOUNT_LINKS[1].mobileLabel}</span>
              <span className="hidden min-[480px]:inline">{NAV_ACCOUNT_LINKS[1].label}</span>
            </Link>
          </nav>

          <NavMenu />
        </div>
      </div>
    </header>
  )
}
