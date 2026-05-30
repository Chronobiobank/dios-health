import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

import { CONTAINER } from './layout'
import { NavMenu } from './NavMenu'

export function Nav() {
  return (
    <header id="site-nav" className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]`}>
        <Link
          href="/"
          className="inline-flex shrink-0 items-baseline gap-2.5 sm:gap-3"
          aria-label="DIʘS — Make Time Count"
        >
          <span className="dios-wordmark text-[28px] leading-none text-black sm:text-[32px]">
            {DIOS_WORDMARK}
          </span>
          <span className="type-logo-tagline text-[21px] leading-none sm:text-[24px]" aria-hidden>
            |
          </span>
          <span className="type-logo-tagline text-[21px] leading-none sm:text-[24px]">Make Time Count</span>
        </Link>

        <NavMenu />
      </div>
    </header>
  )
}
