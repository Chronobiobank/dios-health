import { SiteNavBar } from '@/components/secopeutic/SiteNavBar'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

const CLINICAL_NAV = [
  { href: '/clinical/dashboard', label: 'Triage' },
  { href: '/clinical/settings', label: 'Settings' },
] as const

export function ClinicalSiteNav() {
  return (
    <SiteNavBar
      brandHref="/clinical/dashboard"
      brandAriaLabel={`${DEEPDOSE_NAME} — clinical`}
      navAriaLabel="Clinical"
      links={CLINICAL_NAV}
      signOut
    />
  )
}
