import Link from 'next/link'

import { DIOS_BRAND_NAME, DIOS_LOGO_GLYPH, DIOS_LOGO_MARK } from '@/components/DiosLogo'
import { KAWASAKI_FOOTER, KAWASAKI_NAV } from '@/lib/pitch/marketing-landing-content'

export function MarketingKawasakiNav() {
  return (
    <nav className="kz-nav" aria-label="Site">
      <Link
        href="/"
        className="kz-nav-logo dios-wordmark"
        aria-label={`${DIOS_BRAND_NAME} — home`}
      >
        {DIOS_LOGO_MARK}
      </Link>
      <ul className="kz-nav-links">
        {KAWASAKI_NAV.links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <Link href={KAWASAKI_NAV.cta.href} className="kz-cta-btn kz-nav-cta">
        {KAWASAKI_NAV.cta.label}
      </Link>
    </nav>
  )
}

export function MarketingKawasakiFooter() {
  return (
    <footer className="kz-footer">
      <div className="kz-footer__main">
        <div className="kz-footer__brand">
          <span className="kz-f-glyph" aria-hidden>
            {DIOS_LOGO_GLYPH}
          </span>
          <p className="kz-f-descriptor">{KAWASAKI_FOOTER.descriptor}</p>
        </div>
        <nav className="kz-footer__nav" aria-label="Site">
          <ul className="kz-f-links">
            {KAWASAKI_FOOTER.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="kz-footer__bar">
        <p className="kz-footer__copy">
          © {KAWASAKI_FOOTER.copyrightYear} {DIOS_BRAND_NAME}
        </p>
        <p className="kz-footer__tagline">{KAWASAKI_FOOTER.tagline}</p>
      </div>
    </footer>
  )
}
