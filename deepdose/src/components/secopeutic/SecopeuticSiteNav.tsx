import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_NAV_LINKS } from '@/lib/secopeutic/landing-content'

export function SecopeuticSiteNav() {
  return (
    <header className="clinical-site-nav">
      <Link href="/" className="clinical-site-nav__brand" aria-label={`${DEEPDOSE_NAME} — home`}>
        <DeepdoseWordmark />
      </Link>
      <div className="clinical-site-nav__actions">
        <nav className="clinical-site-nav__actions-desktop" aria-label={DEEPDOSE_NAME}>
          {DEEPDOSE_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="clinical-site-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/login" className="clinical-site-nav__link md:hidden">
          Sign in
        </Link>
      </div>
    </header>
  )
}
