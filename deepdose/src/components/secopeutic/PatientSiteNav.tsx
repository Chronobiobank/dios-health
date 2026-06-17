import Link from 'next/link'

import SignOutButton from '@/components/auth/SignOutButton'
import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

const PATIENT_NAV = [
  { href: '/patient/dashboard', label: 'Dashboard' },
  { href: '/patient/profile', label: 'Profile' },
] as const

export function PatientSiteNav() {
  return (
    <header className="clinical-site-nav">
      <Link href="/" className="clinical-site-nav__brand" aria-label={`${DEEPDOSE_NAME} — home`}>
        <DeepdoseWordmark />
      </Link>
      <div className="clinical-site-nav__actions">
        <nav className="clinical-site-nav__actions-desktop" aria-label={DEEPDOSE_NAME}>
          {PATIENT_NAV.map((link) => (
            <Link key={link.href} href={link.href} className="clinical-site-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </div>
    </header>
  )
}
