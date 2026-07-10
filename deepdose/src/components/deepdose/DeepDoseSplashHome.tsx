'use client'

import { Suspense } from 'react'
import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DeepDoseHeroHeadline } from '@/components/deepdose/DeepDoseHeroHeadline'
import { HomeFaceNetwork } from '@/components/deepdose/HomeFaceNetwork'
import { SplashFrame } from '@/components/deepdose/SplashFrame'
import { SplashGateForm } from '@/components/deepdose/SplashGateForm'
import { DEEPDOSE_HOME_GATE } from '@/lib/deepdose-marketing/home-gate-content'
import { DEEPDOSE_HOME_SPLASH_HERO } from '@/lib/deepdose-marketing/landing-content'

/** Logo left · About + Sign In right · orbit · Sign up CTA · Terms + Report. */
export function DeepDoseSplashHome() {
  const gate = DEEPDOSE_HOME_GATE
  const { links } = gate

  return (
    <SplashFrame showNav={false}>
      <div className="dd-gate">
        <Suspense fallback={null}>
          <SplashGateForm
            aboutHref={links.about.href}
            aboutLabel={links.about.label}
            signInLabel={gate.signInLabel}
            signUpLabel={gate.signUpLabel}
            brand={
              <Link href="/" className="clinical-site-nav__brand" aria-label="Deepdose home">
                <DeepdoseWordmark />
              </Link>
            }
            headline={
              <div className="dd-gate__headline">
                <DeepDoseHeroHeadline hero={DEEPDOSE_HOME_SPLASH_HERO} />
              </div>
            }
            orbit={
              <div className="dd-gate__orbit" aria-hidden>
                <HomeFaceNetwork />
              </div>
            }
            footer={
              <p className="dd-gate__agree">
                {gate.agreeLine}{' '}
                <Link href={links.terms.href}>{links.terms.label}</Link>
                <span aria-hidden> · </span>
                <Link href={links.report.href}>{links.report.label}</Link>
              </p>
            }
          />
        </Suspense>
      </div>
    </SplashFrame>
  )
}
