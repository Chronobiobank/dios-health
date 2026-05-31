import Link from 'next/link'

import { HashLink } from '@/components/sections/HashLink'

import { BTN_HERO, CONTAINER } from './layout'
import { FOOTER_LINKS } from './navigation'

export function Footer() {
  return (
    <footer className="bg-black py-14 text-white sm:py-20">
      <div className={CONTAINER}>
        <h2 className="type-hero-overlay max-w-2xl text-white">
          The right medication at the wrong time is the wrong medication.
        </h2>
        <HashLink href="#demo" className={`${BTN_HERO} mt-8`}>
          Book a clinical demo →
        </HashLink>

        <nav
          className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-8"
          aria-label="Footer"
        >
          {FOOTER_LINKS.map((link) =>
            link.href.includes('#') ? (
              <HashLink
                key={link.label}
                href={link.href}
                className="type-nav text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </HashLink>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="type-nav text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <p className="type-caption mt-8 text-white/45">© 2026 DIOS Health</p>
      </div>
    </footer>
  )
}
