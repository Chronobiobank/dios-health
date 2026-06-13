import Link from 'next/link'

import { SECOPEUTIC_BRAND_NAME, SECOPEUTIC_LOGO_GLYPH } from '@/lib/brand/secopeutic-brand'
import { SECOPUTIC_CLINICS_PATH, SECOPUTIC_DEMO_PATH, SECOPUTIC_LANDING_PATH, SECOPUTIC_PILOT_PATH } from '@/lib/secopeutic/site'

const FOOTER_LINKS = [
  { label: 'Evidence library', href: '/science' },
  { label: 'Monitoring demo', href: SECOPUTIC_DEMO_PATH },
  { label: 'Claim free pilot', href: SECOPUTIC_PILOT_PATH },
  { label: 'Certified clinics', href: SECOPUTIC_CLINICS_PATH },
] as const

export function SecopeuticFooter() {
  return (
    <footer className="seco-footer">
      <div className="seco-landing__section-inner">
        <div className="seco-footer__main">
          <Link href={SECOPUTIC_LANDING_PATH} className="seco-footer__brand" aria-label={SECOPEUTIC_BRAND_NAME}>
            <span className="seco-footer__glyph" aria-hidden="true">
              {SECOPEUTIC_LOGO_GLYPH}
            </span>
            <span className="seco-footer__tag">VD3 Therapy</span>
          </Link>

          <nav className="seco-footer__nav" aria-label="Secopeutic">
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
          <p className="seco-footer__copy">© 2026 SECOMED</p>
          <nav className="seco-footer__legal-nav" aria-label="Legal">
            <Link href="/privacy" className="seco-footer__legal-link">
              Privacy
            </Link>
            <Link href="/secopeutic/terms" className="seco-footer__legal-link">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
