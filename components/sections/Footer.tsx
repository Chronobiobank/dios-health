import Link from 'next/link'

import { CONTAINER, SECTION } from './layout'

export function Footer() {
  return (
    <footer className={`${SECTION} ${CONTAINER}`}>
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-sans text-lg font-semibold tracking-tight text-black"
          aria-label="DIOS — home"
        >
          DIOS
        </Link>
        <p className="type-body text-sm">Dose Intelligence</p>
      </div>
    </footer>
  )
}
