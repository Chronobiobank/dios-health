import Link from 'next/link'

import { CloQMark, CloQTag, CloQWordmark } from '@/components/brand/cloq-wordmark'
import {
  CORPORATE_BRAND,
  CORPORATE_FOOTER,
  CORPORATE_NAV,
} from '@/lib/pitch/corporate-landing-content'

export function CloqLandingNav() {
  return (
    <nav className="clq-nav" aria-label="Site">
      <Link href="/" className="clq-nav__logo" aria-label={`${CORPORATE_BRAND.name} — home`}>
        <CloQWordmark />
      </Link>
      <ul className="clq-nav__links">
        {CORPORATE_NAV.links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <Link href={CORPORATE_NAV.cta.href} className="clq-nav__cta">
        {CORPORATE_NAV.cta.label}
      </Link>
    </nav>
  )
}

export function CloqLandingFooter() {
  return (
    <footer className="clq-footer">
      <div className="clq-footer__main">
        <div className="clq-footer__brand">
          <CloQMark />
          <CloQTag>{CORPORATE_FOOTER.descriptor}</CloQTag>
          {CORPORATE_FOOTER.ecosystem?.length ? (
            <ul className="clq-footer__ecosystem" aria-label="Ecosystem">
              {CORPORATE_FOOTER.ecosystem.map((item) => (
                <li key={item.name}>
                  <span className="clq-footer__ecosystem-name">{item.name}</span>
                  <span className="clq-footer__ecosystem-role">{item.role}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <nav className="clq-footer__columns" aria-label="Site">
          {CORPORATE_FOOTER.linkColumns?.map((column) => (
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
        <p className="clq-footer__copy">
          © {CORPORATE_FOOTER.copyrightYear}{' '}
          <CloQWordmark />
        </p>
        <p className="clq-footer__legal">{CORPORATE_FOOTER.brandName}</p>
      </div>
    </footer>
  )
}
