'use client'

import { DIOS_BRAND_NAME, DIOS_LOGO_MARK } from '@/components/DiosLogo'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '#platform', label: 'Platform' },
  { href: '#clients', label: "Who it's for" },
  { href: '#science', label: 'Evidence' },
  { href: '#model', label: 'Model' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="dios-nav w-full">
      <div className="dios-nav-bar">
        <div className="dios-nav-inner">
          <div className="dios-nav-row">
          <Link href="/" className="shrink-0" onClick={() => setOpen(false)} aria-label={`${DIOS_BRAND_NAME} — home`}>
            <span className="dios-wordmark text-[28px] leading-none text-black">{DIOS_LOGO_MARK}</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.9375rem] font-medium leading-none text-dios-muted transition-colors hover:text-dios-aubergine"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center text-dios-aubergine md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" strokeWidth={1.75} /> : <Menu className="h-6 w-6" strokeWidth={1.75} />}
          </button>
          </div>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-dios-border bg-dios-cream md:hidden"
          aria-label="Mobile"
        >
          <ul className="mx-auto flex w-full max-w-[76rem] flex-col gap-5 px-6 py-6 md:px-10 lg:px-14">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-lg font-medium text-dios-aubergine"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
