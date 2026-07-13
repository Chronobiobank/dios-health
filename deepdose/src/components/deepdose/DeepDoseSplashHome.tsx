'use client'

import { Suspense } from 'react'
import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DeepDoseHeroHeadline } from '@/components/deepdose/DeepDoseHeroHeadline'
import { HomeFaceNetwork } from '@/components/deepdose/HomeFaceNetwork'
import { SplashFrame } from '@/components/deepdose/SplashFrame'
import { SplashGateForm } from '@/components/deepdose/SplashGateForm'
import { DEEPDOSE_HOME_GATE } from '@/lib/deepdose-marketing/home-gate-content'
import {
  DEEPDOSE_HOME_SPLASH,
  DEEPDOSE_HOME_SPLASH_HERO,
} from '@/lib/deepdose-marketing/landing-content'

/** Logo · orbit · Max Your Chemistry · founder CTA. */
export function DeepDoseSplashHome() {
  const gate = DEEPDOSE_HOME_GATE

  return (
    <SplashFrame showNav={false}>
      <div className="dd-gate">
        <Suspense fallback={null}>
          <SplashGateForm
            signInLabel={gate.signInLabel}
            brand={
              <Link href="/" className="clinical-site-nav__brand" aria-label="Deepdose home">
                <DeepdoseWordmark />
              </Link>
            }
            headline={
              <div className="dd-gate__headline">
                <HomeFaceNetwork />
                <DeepDoseHeroHeadline hero={DEEPDOSE_HOME_SPLASH_HERO} />
                {DEEPDOSE_HOME_SPLASH.lede ? (
                  <p className="dd-gate__lede">{DEEPDOSE_HOME_SPLASH.lede}</p>
                ) : null}
              </div>
            }
            baseline={
              <div className="dd-gate__ctas">
                <Link
                  href={DEEPDOSE_HOME_SPLASH.primaryCta.href}
                  className="dd-gate__cta dd-gate__cta--primary"
                >
                  {DEEPDOSE_HOME_SPLASH.primaryCta.label}
                </Link>
              </div>
            }
          />
        </Suspense>
      </div>
    </SplashFrame>
  )
}
