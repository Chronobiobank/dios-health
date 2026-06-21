import Link from 'next/link'

import { DEEPDOSE_LOGO_GLYPH, DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

const FOOTER_LINKS = [
  { label: 'Science & trust', href: '/science' },
  { label: 'Research', href: '/research' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Home test', href: '/home-test' },
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
  { label: 'Sign in', href: '/login' },
] as const

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
          <div className="seco-footer__copy-block">
            <p className="seco-footer__copy">© {year} Chronobiobank Ltd</p>
            <p className="seco-footer__legal">
              {`${DEEPDOSE_NAME} is a trademark and asset of Chronobiobank Ltd, a UK non-profit company limited by guarantee, registered in England & Wales (Company No. 00000000). Registered office: 167-169 Great Portland Street, London, W1W 5PF.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
