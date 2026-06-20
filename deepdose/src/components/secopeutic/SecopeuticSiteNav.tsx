import { SiteNavBar } from '@/components/secopeutic/SiteNavBar'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_NAV_LINKS } from '@/lib/secopeutic/landing-content'

export function SecopeuticSiteNav() {
  return (
    <SiteNavBar
      brandHref="/"
      brandAriaLabel={`${DEEPDOSE_NAME} home`}
      navAriaLabel={DEEPDOSE_NAME}
      links={DEEPDOSE_NAV_LINKS}
    />
  )
}
