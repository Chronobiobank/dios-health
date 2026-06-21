import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_LOGO_GLYPH, DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { SplashFrame } from '@/components/secopeutic/SplashFrame'

const SPLASH_PORTALS = [
  { label: 'For patients', href: '/patient-landing' },
  { label: 'For clinicians', href: '/clinician-landing' },
  { label: 'For enterprise', href: '/enterprise-landing' },
] as const

export function DeepDoseSplashHome() {
  return (
    <SplashFrame>
      <div className="seco-splash__stage seco-reveal seco-reveal--1">
        <div className="seco-splash__top">
          <span className="seco-footer__glyph seco-splash__glyph" aria-hidden="true">
            {DEEPDOSE_LOGO_GLYPH}
          </span>
        </div>

        <div className="seco-splash__core">
          <h1 className="seco-splash__title">
            <span className="seco-splash__title-line">
              {DEEPDOSE_NAME} knows your body clock
            </span>
            <span className="seco-splash__title-line seco-splash__title-accent">
              so meds work better.
            </span>
          </h1>

          <nav
            className="seco-landing__hero-actions seco-splash__actions"
            aria-label="Choose your portal"
          >
            {SPLASH_PORTALS.map((portal) => (
              <Link
                key={portal.href}
                href={portal.href}
                className="seco-landing__btn seco-landing__btn--ghost"
              >
                {portal.label}
              </Link>
            ))}
          </nav>
        </div>

        <footer className="seco-splash__foot">
          <DeepdoseWordmark className="seco-splash__logo" />
        </footer>
      </div>
    </SplashFrame>
  )
}
