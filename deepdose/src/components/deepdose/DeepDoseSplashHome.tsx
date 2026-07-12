'use client'

import { Suspense } from 'react'
import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DeepDoseHeroHeadline } from '@/components/deepdose/DeepDoseHeroHeadline'
import { SplashFrame } from '@/components/deepdose/SplashFrame'
import { SplashGateForm } from '@/components/deepdose/SplashGateForm'
import { DEEPDOSE_HOME_GATE } from '@/lib/deepdose-marketing/home-gate-content'
import {
  DEEPDOSE_HOME_SPLASH,
  DEEPDOSE_HOME_SPLASH_HERO,
} from '@/lib/deepdose-marketing/landing-content'

/** Logo · About · Chemistry That Connects · dual CTAs · Terms. Auth on /login. */
export function DeepDoseSplashHome() {
  const gate = DEEPDOSE_HOME_GATE
  const { links } = gate

  return (
    <SplashFrame showNav={false} videoBackground>
      <div className="dd-gate">
        <Suspense fallback={null}>
          <SplashGateForm
            aboutHref={links.about.href}
            aboutLabel={links.about.label}
            signInLabel={gate.signInLabel}
            brand={
              <Link href="/" className="clinical-site-nav__brand" aria-label="Deepdose home">
                <DeepdoseWordmark />
              </Link>
            }
            headline={
              <div className="dd-gate__headline">
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
                  className="dd-gate__signup dd-gate__cta dd-gate__cta--primary"
                >
                  {DEEPDOSE_HOME_SPLASH.primaryCta.label}
                </Link>
                <Link
                  href={DEEPDOSE_HOME_SPLASH.secondaryCta.href}
                  className="dd-gate__cta dd-gate__cta--secondary"
                >
                  {DEEPDOSE_HOME_SPLASH.secondaryCta.label}
                </Link>
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
