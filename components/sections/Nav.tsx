import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

import { CONTAINER } from './layout'
import { NavMenu } from './NavMenu'

export function Nav() {
  return (
    <header id="site-nav" className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center sm:h-[4.5rem]`}>
        <Link
          href="/"
          className="inline-flex shrink-0 items-baseline"
          aria-label="DIʘS — Make Time Count"
        >
          <span className="dios-wordmark nav-brand-wordmark text-[28px] leading-none text-black sm:text-[32px]">
            {DIOS_WORDMARK}
          </span>
          <span className="nav-brand-tagline ml-2.5 hidden items-baseline gap-x-2.5 text-[20px] leading-none sm:ml-3 sm:text-[23px] md:inline-flex">
            <span aria-hidden>&gt;</span>
            <span>Make Time Count</span>
          </span>
        </Link>

        <span className="nav-brand-tagline min-w-0 flex-1 truncate px-3 text-center text-[15px] leading-none sm:text-base md:hidden">
          Make Time Count
        </span>

        <div className="ml-auto shrink-0">
          <NavMenu />
        </div>
      </div>
    </header>
  )
}
