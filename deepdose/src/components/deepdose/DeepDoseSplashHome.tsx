import Link from 'next/link'

import { HomeDrugSearch } from '@/components/deepdose/HomeDrugSearch'
import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_HOME_HEADLINE, DEEPDOSE_LOGO_GLYPH } from '@/lib/brand/deepdose-brand'
import { SplashFrame } from '@/components/deepdose/SplashFrame'

const FOOTER_LINKS = [
  { label: 'For clinicians', href: '/clinician-landing' },
  { label: 'For enterprise', href: '/enterprise-landing' },
  { label: 'Sign in', href: '/login' },
] as const

export function DeepDoseSplashHome() {
  return (
    <SplashFrame>
      <Link href="/" className="seco-splash__brand-corner" aria-label="Deepdose home">
        <DeepdoseWordmark />
      </Link>

      <span className="seco-splash__glyph-corner" aria-hidden="true">
        {DEEPDOSE_LOGO_GLYPH}
      </span>

      <div className="seco-splash__stage seco-splash__stage--search seco-reveal seco-reveal--1">
        <div className="seco-splash__core seco-splash__core--search">
          <div className="seco-splash__search-stack">
            <p className="seco-splash__tagline">{DEEPDOSE_HOME_HEADLINE}</p>
            <HomeDrugSearch />
            <nav className="seco-splash__subnav home-drug-search__foot-nav" aria-label="Site links">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="home-drug-search__foot-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </SplashFrame>
  )
}
