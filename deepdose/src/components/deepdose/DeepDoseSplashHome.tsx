import { HomeDrugSearch } from '@/components/deepdose/HomeDrugSearch'
import { LandingHeroIntro } from '@/components/deepdose/LandingHeroIntro'
import { SplashHomeNav } from '@/components/deepdose/SplashHomeNav'
import { DEEPDOSE_HOME_SPLASH_HERO } from '@/lib/deepdose-marketing/landing-content'
import { SplashFrame } from '@/components/deepdose/SplashFrame'

export function DeepDoseSplashHome() {
  return (
    <SplashFrame videoBackground>
      <SplashHomeNav />

      <div className="seco-splash__stage seco-splash__stage--search seco-reveal seco-reveal--1">
        <div className="seco-splash__core seco-splash__core--search">
          <div className="seco-splash__search-stack">
            <LandingHeroIntro hero={DEEPDOSE_HOME_SPLASH_HERO} variant="splash" />
            <div className="seco-splash__search-band">
              <HomeDrugSearch />
            </div>
          </div>
        </div>
      </div>
    </SplashFrame>
  )
}
