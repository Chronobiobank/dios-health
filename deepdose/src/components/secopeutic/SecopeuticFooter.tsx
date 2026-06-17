import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Sign in', href: '/login' },
  { label: 'Patient dashboard', href: '/login' },
] as const

export function SecopeuticFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="seco-footer">
      <div className="seco-landing__section-inner">
        <div className="seco-footer__main">
          <Link href="/" className="seco-footer__brand" aria-label={DEEPDOSE_NAME}>
            <span className="seco-footer__lockup">
              <DeepdoseWordmark />
              <span className="seco-footer__tag">{DEEPDOSE_TAGLINE}</span>
            </span>
          </Link>

          <nav className="seco-footer__nav" aria-label={DEEPDOSE_NAME}>
            <ul className="seco-footer__links">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="seco-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="seco-footer__bar">
          <p className="seco-footer__copy">© {year} {DEEPDOSE_NAME}</p>
        </div>
      </div>
    </footer>
  )
}
