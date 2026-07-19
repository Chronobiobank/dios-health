'use client'

import { Suspense } from 'react'
import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { HomeFaceNetwork } from '@/components/deepdose/HomeFaceNetwork'
import { SplashFrame } from '@/components/deepdose/SplashFrame'
import { SplashGateForm } from '@/components/deepdose/SplashGateForm'
import { DEEPDOSE_HOME_GATE } from '@/lib/deepdose-marketing/home-gate-content'
import { DEEPDOSE_MATCH_SPLASH } from '@/lib/deepdose-marketing/landing-content'

/** Orbit splash at /match — top nav · head · sub · Claim Free Access. */
export function DeepDoseSplashHome() {
  const gate = DEEPDOSE_HOME_GATE
  const splash = DEEPDOSE_MATCH_SPLASH

  return (
    <SplashFrame showNav={false}>
      <div className="dd-gate">
        <Suspense
          fallback={
            <div className="dd-gate__shell">
              <header className="dd-gate__chrome">
                <Link href="/" className="dd-gate__brand-lockup" aria-label="Deepdose home">
                  <DeepdoseWordmark />
                </Link>
                <nav className="dd-gate__chrome-links" aria-label="Account">
                  <Link href="/login" className="dd-gate__chrome-link">
                    {gate.signInLabel}
                  </Link>
                </nav>
              </header>
            </div>
          }
        >
          <SplashGateForm
            signInLabel={gate.signInLabel}
            brand={
              <Link href="/" className="dd-gate__brand-lockup" aria-label="Deepdose home">
                <DeepdoseWordmark />
              </Link>
            }
            headline={
              <div className="dd-gate__headline">
                <HomeFaceNetwork />
                <h1 className="seco-landing__hero-title seco-landing__hero-title--single">
                  <span className="seco-landing__hero-line seco-landing__hero-spectrum">
                    {splash.headline}
                  </span>
                </h1>
                <p className="dd-gate__lede">{splash.lede}</p>
              </div>
            }
            baseline={
              <div className="dd-gate__ctas">
                <Link
                  href={splash.primaryCta.href}
                  className="dd-gate__cta dd-gate__cta--primary"
                >
                  {splash.primaryCta.label}
                </Link>
              </div>
            }
          />
        </Suspense>
      </div>
    </SplashFrame>
  )
}
