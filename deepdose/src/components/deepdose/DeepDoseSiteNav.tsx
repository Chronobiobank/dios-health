import { SiteNavBar } from '@/components/deepdose/SiteNavBar'
import { DEEPDOSE_NAV_LINKS } from '@/lib/deepdose-marketing/landing-content'

export function DeepDoseSiteNav() {
  return (
    <SiteNavBar
      brandHref="/"
      brandAriaLabel="DeepDose home"
      navAriaLabel="DeepDose"
      links={DEEPDOSE_NAV_LINKS}
    />
  )
}
