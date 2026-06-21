import { SiteNavBar } from '@/components/deepdose/SiteNavBar'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

const ENTERPRISE_NAV = [
  { href: '/enterprise/dashboard', label: 'Overview' },
  { href: '/enterprise/dashboard/analytics', label: 'Analytics' },
  { href: '/enterprise/dashboard/cohorts', label: 'Cohorts' },
  { href: '/enterprise/dashboard/licensing', label: 'Licensing' },
  { href: '/enterprise/settings', label: 'Settings' },
] as const

export function EnterpriseSiteNav() {
  return (
    <SiteNavBar
      brandHref="/enterprise/dashboard"
      brandAriaLabel={`${DEEPDOSE_NAME} — enterprise`}
      navAriaLabel="Enterprise"
      links={ENTERPRISE_NAV}
      signOut
    />
  )
}
