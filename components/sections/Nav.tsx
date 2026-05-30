import Link from 'next/link'

import { DiosLogo } from '@/components/DiosLogo'

import { BTN_PRIMARY, CONTAINER } from './layout'

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Evidence', href: '/evidence' },
  { label: 'Pricing', href: '#pricing' },
] as const

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]`}>
        <Link href="/" className="inline-flex shrink-0 items-center text-black" aria-label="DIOS Health — home">
          <DiosLogo priority className="h-10 w-auto min-w-[7.5rem] sm:h-11 sm:min-w-[8.5rem]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="type-nav transition-colors hover:text-black">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="#demo" className={BTN_PRIMARY}>
          Book a demo
        </Link>
      </div>
    </header>
  )
}
