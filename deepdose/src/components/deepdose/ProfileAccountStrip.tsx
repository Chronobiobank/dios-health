import Link from 'next/link'

const ACCOUNT_LINKS = [
  { href: '/patient/profile', label: 'Account & consent' },
  { href: '/patient/dashboard/medications', label: 'Medicines' },
  { href: '/patient/dashboard/rhythm', label: 'Sleep rhythm' },
  { href: '/patient/dashboard/data', label: 'Devices' },
  { href: '/connect', label: 'Find matches' },
  { href: '/dosage', label: 'Your protocol' },
] as const

/** Account shortcuts on /profile when signed in (settings absorbed into profile IA). */
export function ProfileAccountStrip() {
  return (
    <nav className="sw-dash__account-strip" aria-label="Account">
      <p className="seco-page__eyebrow sw-dash__tile-eyebrow">Account</p>
      <ul className="sw-dash__account-list">
        {ACCOUNT_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="sw-dash__text-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
