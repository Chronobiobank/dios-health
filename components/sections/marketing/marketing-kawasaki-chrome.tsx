import Link from 'next/link'

import { BodycloQWordmark, CloQMark, CloQTag, CloQWordmark } from '@/components/brand/cloq-wordmark'
import { DIOS_BRAND_NAME, DIOS_LOGO_GLYPH, DIOS_LOGO_MARK } from '@/components/DiosLogo'
import {
  KAWASAKI_FOOTER,
  KAWASAKI_NAV,
  type KawasakiBrandConfig,
  type KawasakiFooterConfig,
  type KawasakiNavConfig,
} from '@/lib/pitch/marketing-landing-content'

const DEFAULT_BRAND: KawasakiBrandConfig = {
  name: DIOS_BRAND_NAME,
  logoMark: DIOS_LOGO_MARK,
  logoGlyph: DIOS_LOGO_GLYPH,
  logoClassName: 'dios-wordmark',
}

function isCloqWordmark(brand: KawasakiBrandConfig) {
  return brand.logoClassName === 'cloq-wordmark' || brand.logoClassName === 'bodycloq-wordmark'
}

function NavWordmark({ brand }: { brand: KawasakiBrandConfig }) {
  if (brand.logoClassName === 'bodycloq-wordmark') {
    return <BodycloQWordmark />
  }
  if (brand.logoClassName === 'cloq-wordmark') {
    return <CloQWordmark />
  }
  return brand.logoMark
}

type MarketingKawasakiNavProps = {
  config?: KawasakiNavConfig
  brand?: KawasakiBrandConfig
}

export function MarketingKawasakiNav({
  config = KAWASAKI_NAV,
  brand = DEFAULT_BRAND,
}: MarketingKawasakiNavProps) {
  return (
    <nav className="kz-nav" aria-label="Site">
      <Link
        href="/"
        className={`kz-nav-logo ${brand.logoClassName ?? 'dios-wordmark'}`.trim()}
        aria-label={`${brand.name} — home`}
      >
        <NavWordmark brand={brand} />
      </Link>
      <ul className="kz-nav-links">
        {config.links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <Link href={config.cta.href} className="kz-cta-btn kz-nav-cta">
        {config.cta.label}
      </Link>
    </nav>
  )
}

type MarketingKawasakiFooterProps = {
  config?: KawasakiFooterConfig
  brand?: KawasakiBrandConfig
}

export function MarketingKawasakiFooter({
  config = KAWASAKI_FOOTER,
  brand = DEFAULT_BRAND,
}: MarketingKawasakiFooterProps) {
  const cloqBrand = isCloqWordmark(brand)

  return (
    <footer className="kz-footer">
      <div className="kz-footer__main">
        <div className="kz-footer__brand">
          {cloqBrand ? (
            <CloQMark />
          ) : (
            <span className={`kz-f-glyph ${brand.logoClassName ?? ''}`.trim()} aria-hidden>
              {brand.logoGlyph}
            </span>
          )}
          {cloqBrand ? (
            <CloQTag className="kz-f-tag">{config.descriptor}</CloQTag>
          ) : (
            <p className="kz-f-descriptor">{config.descriptor}</p>
          )}
          {config.ecosystem?.length ? (
            <ul className="kz-f-ecosystem" aria-label="Ecosystem">
              {config.ecosystem.map((item) => (
                <li key={item.name}>
                  <span className="kz-f-ecosystem__name">{item.name}</span>
                  <span className="kz-f-ecosystem__role">{item.role}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <nav className="kz-footer__nav" aria-label="Site">
          {config.linkColumns?.length ? (
            <div className="kz-f-columns">
              {config.linkColumns.map((column) => (
                <div key={column.title} className="kz-f-column">
                  <p className="kz-f-column__title">{column.title}</p>
                  <ul className="kz-f-column__links">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="kz-f-links">
              {(config.links ?? []).map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
      <div className="kz-footer__bar">
        <p className="kz-footer__copy">
          © {config.copyrightYear}{' '}
          {config.copyrightMark && cloqBrand ? (
            <CloQWordmark className="kz-footer__copy-mark" />
          ) : (
            config.brandName
          )}
        </p>
        {cloqBrand ? (
          <p className="kz-footer__legal">{config.brandName}</p>
        ) : (
          <p className="kz-footer__tagline">{config.tagline}</p>
        )}
      </div>
    </footer>
  )
}
