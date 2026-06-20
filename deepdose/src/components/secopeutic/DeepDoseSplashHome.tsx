import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_LOGO_GLYPH } from '@/lib/brand/deepdose-brand'
import { SplashFrame } from '@/components/secopeutic/SplashFrame'

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
            10 million UK citizens are on weighted meds that don&apos;t work because they were
            designed to a standardised (white) mean.
          </h1>

          <nav
            className="seco-landing__hero-actions seco-splash__actions"
            aria-label="Choose your portal"
          >
            <Link href="/patient-landing" className="seco-landing__btn seco-landing__btn--ghost">
              Dosing for patients
            </Link>
            <Link href="/clinician-landing" className="seco-landing__btn seco-landing__btn--ghost">
              Dosing for clinicians
            </Link>
          </nav>
        </div>

        <footer className="seco-splash__foot">
          <DeepdoseWordmark className="seco-splash__logo" />
        </footer>
      </div>
    </SplashFrame>
  )
}
