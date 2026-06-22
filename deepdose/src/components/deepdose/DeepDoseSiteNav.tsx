import { SiteNavBar } from '@/components/deepdose/SiteNavBar'
import { DEEPDOSE_SITE_LINKS } from '@/lib/deepdose-marketing/site-nav-links'

export function DeepDoseSiteNav() {
  return (
    <SiteNavBar
      brandHref="/"
      brandAriaLabel="DeepDose home"
      navAriaLabel="DeepDose"
      links={DEEPDOSE_SITE_LINKS}
    />
  )
}
