'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { slug: '', label: 'Overview' },
  { slug: 'medications', label: 'Medications' },
  { slug: 'circadian', label: 'Circadian' },
  { slug: 'history', label: 'History' },
] as const

export function ClinicalPatientNav({ patientId }: { patientId: string }) {
  const pathname = usePathname()
  const base = `/clinical/dashboard/patient/${patientId}`

  return (
    <nav className="clinical-patient-nav" aria-label="Patient chart sections">
      <ul className="clinical-patient-nav__list">
        {SECTIONS.map(({ slug, label }) => {
          const href = slug ? `${base}/${slug}` : base
          const active =
            slug === ''
              ? pathname === base
              : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <li key={slug || 'overview'}>
              <Link
                href={href}
                className={`clinical-patient-nav__link${active ? ' clinical-patient-nav__link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
