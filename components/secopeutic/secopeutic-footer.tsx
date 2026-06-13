import Link from 'next/link'

import { SecopeuticWordmark } from '@/components/brand/secopeutic-wordmark'
import { SECOPEUTIC_LANDING_DISCLAIMER } from '@/lib/secopeutic/landing-content'
import { SECOPUTIC_DEMO_PATH } from '@/lib/secopeutic/site'

const FOOTER_LINKS = [
  { label: 'Evidence library', href: '/science' },
  { label: 'Monitoring demo', href: SECOPUTIC_DEMO_PATH },
  { label: 'Claim pilot', href: '/clinicians' },
  { label: 'Certified clinics', href: '/secopeutic#clinics' },
] as const

export function SecopeuticFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="seco-footer">
      <div className="seco-landing__section-inner">
        <div className="seco-footer__main">
          <div className="seco-footer__brand">
            <SecopeuticWordmark />
            <p className="seco-footer__tagline">High-dose vitamin D monitoring for clinicians.</p>
          </div>
          <nav className="seco-footer__nav" aria-label="Secopeutic">
            <ul className="seco-footer__links">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="seco-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="seco-footer__bar">
          <p className="seco-footer__copy">© {year} Secopeutic</p>
          <p className="seco-footer__legal">{SECOPEUTIC_LANDING_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  )
}
