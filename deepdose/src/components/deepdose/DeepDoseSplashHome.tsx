import Link from 'next/link'

import { HomeFaceNetwork } from '@/components/deepdose/HomeFaceNetwork'
import { LandingHeroIntro } from '@/components/deepdose/LandingHeroIntro'
import { SplashFrame } from '@/components/deepdose/SplashFrame'
import { DEEPDOSE_HOME_SPLASH_HERO, DEEPDOSE_HOME_ACTIONS } from '@/lib/deepdose-marketing/landing-content'

export function DeepDoseSplashHome() {
  const actions = DEEPDOSE_HOME_ACTIONS

  return (
    <SplashFrame>
      <div className="seco-splash__stage seco-splash__stage--simple seco-reveal seco-reveal--1">
        <div className="seco-splash__core seco-splash__core--simple">
          <div className="seco-splash__simple">
            <LandingHeroIntro hero={DEEPDOSE_HOME_SPLASH_HERO} variant="splash" />
            <HomeFaceNetwork />
            <div className="seco-splash__simple-actions">
              <Link
                href={actions.mission.href}
                className="seco-landing__btn seco-landing__btn--ghost"
              >
                {actions.mission.label}
              </Link>
              <Link
                href={actions.create.href}
                className="seco-landing__btn seco-landing__btn--primary"
              >
                {actions.create.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SplashFrame>
  )
}
