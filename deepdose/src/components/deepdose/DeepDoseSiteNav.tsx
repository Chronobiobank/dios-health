import { SiteNavBar } from '@/components/deepdose/SiteNavBar'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_SITE_CTA, DEEPDOSE_SITE_LINKS } from '@/lib/deepdose-marketing/site-nav-links'

export function DeepDoseSiteNav() {
  return (
    <SiteNavBar
      brandHref="/"
      brandAriaLabel={`${DEEPDOSE_NAME} home`}
      navAriaLabel={DEEPDOSE_NAME}
      links={DEEPDOSE_SITE_LINKS}
      cta={DEEPDOSE_SITE_CTA}
    />
  )
}
