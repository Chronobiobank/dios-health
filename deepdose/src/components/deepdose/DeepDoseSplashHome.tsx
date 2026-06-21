import Link from 'next/link'

import { HomeDrugSearch } from '@/components/deepdose/HomeDrugSearch'
import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_LOGO_GLYPH, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'
import { SplashFrame } from '@/components/deepdose/SplashFrame'

const FOOTER_LINKS = [
  { label: 'Sign in', href: '/login' },
  { label: 'For clinicians', href: '/clinician-landing' },
  { label: 'Enterprise', href: '/enterprise-landing' },
] as const

export function DeepDoseSplashHome() {
  return (
    <SplashFrame>
      <div className="seco-splash__stage seco-splash__stage--search seco-reveal seco-reveal--1">
        <div className="seco-splash__top">
          <span className="seco-footer__glyph seco-splash__glyph" aria-hidden="true">
            {DEEPDOSE_LOGO_GLYPH}
          </span>
        </div>

        <div className="seco-splash__core seco-splash__core--search">
          <div className="seco-splash__search-stack">
            <p className="seco-splash__tagline">{DEEPDOSE_TAGLINE}</p>
            <HomeDrugSearch />
          </div>
        </div>

        <footer className="seco-splash__foot seco-splash__foot--search">
          <nav className="home-drug-search__foot-nav" aria-label="Site links">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="home-drug-search__foot-link">
                {link.label}
              </Link>
            ))}
          </nav>
          <DeepdoseWordmark className="seco-splash__logo seco-splash__logo--foot" />
        </footer>
      </div>
    </SplashFrame>
  )
}
