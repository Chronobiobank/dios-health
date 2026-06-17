import Link from 'next/link'
import SignOutButton from '@/components/auth/SignOutButton'
import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

const CLINICAL_NAV = [
  { href: '/clinical/dashboard', label: 'Triage' },
  { href: '/clinical/settings', label: 'Settings' },
] as const

export function ClinicalSiteNav() {
  return (
    <header className="clinical-site-nav">
      <Link href="/clinical/dashboard" className="clinical-site-nav__brand" aria-label={`${DEEPDOSE_NAME} — clinical`}>
        <DeepdoseWordmark />
      </Link>
      <div className="clinical-site-nav__actions">
        <nav className="clinical-site-nav__actions-desktop" aria-label="Clinical">
          {CLINICAL_NAV.map((link) => (
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
