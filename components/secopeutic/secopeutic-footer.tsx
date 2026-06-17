import Link from 'next/link'

import { DIOS_BRAND_NAME, DIOS_LOGO_GLYPH, DIOS_TAGLINE } from '@/lib/brand/dios-brand'
import {
  DIOS_CLINICIANS_CLINICS_PATH,
  DIOS_CLINICIANS_DEMO_PATH,
  DIOS_CLINICIANS_EVIDENCE_PATH,
  DIOS_CLINICIANS_PATH,
  DIOS_CLINICIANS_PILOT_PATH,
} from '@/lib/secopeutic/site'

const FOOTER_LINKS = [
  { label: 'Evidence library', href: DIOS_CLINICIANS_EVIDENCE_PATH },
  { label: 'Monitoring demo', href: DIOS_CLINICIANS_DEMO_PATH },
  { label: 'Claim free pilot', href: DIOS_CLINICIANS_PILOT_PATH },
  { label: 'Certified clinics', href: DIOS_CLINICIANS_CLINICS_PATH },
] as const

export function SecopeuticFooter() {
  return (
    <footer className="seco-footer">
      <div className="seco-landing__section-inner">
        <div className="seco-footer__main">
          <Link href={DIOS_CLINICIANS_PATH} className="seco-footer__brand" aria-label={DIOS_BRAND_NAME}>
            <span className="seco-footer__lockup">
              <span className="seco-footer__glyph" aria-hidden="true">
                {DIOS_LOGO_GLYPH}
              </span>
              <span className="seco-footer__tag">{DIOS_TAGLINE}</span>
            </span>
          </Link>

          <nav className="seco-footer__nav" aria-label="DIOS">
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
          <p className="seco-footer__copy">© 2026 DIOS</p>
          <nav className="seco-footer__legal-nav" aria-label="Legal">
            <Link href="/privacy" className="seco-footer__legal-link">
              Privacy
            </Link>
            <Link href="/clinicians/terms" className="seco-footer__legal-link">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
