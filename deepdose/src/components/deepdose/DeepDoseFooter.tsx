import Link from 'next/link'

import {
  DEEPDOSE_FOOTER_LEGAL,
  DEEPDOSE_LEGAL_NAME,
  DEEPDOSE_LOGO_GLYPH,
  DEEPDOSE_NAME,
  DEEPDOSE_REGISTRATION_LINE,
} from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_SITE_LINKS } from '@/lib/deepdose-marketing/site-nav-links'

export function DeepDoseFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="seco-footer">
      <div className="seco-landing__section-inner">
        <div className="seco-footer__main">
          <div className="seco-footer__brand-col">
            <Link href="/" className="seco-footer__brand" aria-label={DEEPDOSE_NAME}>
              <span className="seco-footer__lockup">
                <span className="seco-footer__glyph" aria-hidden="true">
                  {DEEPDOSE_LOGO_GLYPH}
                </span>
              </span>
            </Link>
            <p className="seco-footer__mission">
              Timing everyday care to your body clock, so the same dose does more.
            </p>
          </div>

          <nav className="seco-footer__nav" aria-label={DEEPDOSE_NAME}>
            <ul className="seco-footer__links">
              {DEEPDOSE_SITE_LINKS.map((link) => (
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
          <div className="seco-footer__copy-block">
            <p className="seco-footer__copy">© {year} {DEEPDOSE_LEGAL_NAME}</p>
            <p className="seco-footer__legal">{DEEPDOSE_REGISTRATION_LINE}</p>
            <p className="seco-footer__legal">{DEEPDOSE_FOOTER_LEGAL}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
