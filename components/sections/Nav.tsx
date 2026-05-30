import Link from 'next/link'

import { CONTAINER } from './layout'
import { NavMenu } from './NavMenu'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]`}>
        <Link
          href="/"
          className="inline-flex shrink-0 items-baseline gap-2 text-lg sm:gap-2.5 sm:text-xl"
          aria-label="DIOS — Dose Intelligence OS"
        >
          <span className="type-logo leading-none text-black">DIOS</span>
          <span className="type-logo-tagline whitespace-nowrap">Dose Intelligence OS</span>
        </Link>

        <NavMenu />
      </div>
    </header>
  )
}
