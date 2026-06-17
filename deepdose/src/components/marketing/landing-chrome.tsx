import Link from 'next/link'
import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'
import {
  LANDING_FOOTER,
  LANDING_NAV,
} from '@/lib/marketing/landing-content'

export function LandingNav() {
  return (
    <nav className="clq-nav clq-nav--translucent" aria-label="Site">
      <Link href="/" className="clq-nav__logo" aria-label={`${DEEPDOSE_NAME} — home`}>
        <DeepdoseWordmark />
      </Link>
      <ul className="clq-nav__links">
        {LANDING_NAV.links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <Link href={LANDING_NAV.cta.href} className="clq-nav__cta">
        {LANDING_NAV.cta.label}
      </Link>
    </nav>
  )
}

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="clq-footer clq-footer--on-blobs">
      <div className="clq-footer__main">
        <div className="clq-footer__brand">
          <DeepdoseWordmark />
          <span className="clq-tag">{DEEPDOSE_TAGLINE}</span>
        </div>
        <nav className="clq-footer__columns" aria-label="Site">
          {LANDING_FOOTER.linkColumns.map((column) => (
            <div key={column.title}>
              <p className="clq-footer__col-title">{column.title}</p>
              <ul className="clq-footer__links">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="clq-footer__bar">
        <p className="clq-footer__copy">© {year} {DEEPDOSE_NAME}</p>
      </div>
    </footer>
  )
}
