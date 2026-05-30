import Link from 'next/link'

import { DIOS_WORDMARK } from '@/components/DiosLogo'

import { CONTAINER } from './layout'
import { NavMenu } from './NavMenu'

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

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          <span className={`nav-brand-tagline ${TAGLINE_SIZE}`}>Make Time Count</span>
          <NavMenu />
        </div>
      </div>
    </header>
  )
}
