import { SiteNavBar } from '@/components/deepdose/SiteNavBar'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

const PATIENT_NAV = [
  { href: '/dosage', label: 'Dosage' },
  { href: '/patient/dashboard/status', label: 'Biochemistry' },
  { href: '/patient/dashboard/data', label: 'Devices' },
  { href: '/patient/profile', label: 'Profile' },
] as const

export function PatientSiteNav() {
  return (
    <SiteNavBar
      brandHref="/"
      brandAriaLabel={`${DEEPDOSE_NAME} home`}
      navAriaLabel={DEEPDOSE_NAME}
      links={PATIENT_NAV}
      signOut
    />
  )
}
