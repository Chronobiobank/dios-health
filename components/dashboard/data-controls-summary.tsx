import Link from 'next/link'

import { AuthToggle } from '@/components/auth/auth-toggle'
import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type DataControlsSummaryProps = {
  dataShareGp: boolean
  dataShareResearch: boolean
  dataSharePolicy: boolean
}

const TOGGLES = [
  { key: 'gp', label: 'Share with my GP' },
  { key: 'research', label: 'Contribute to research' },
  { key: 'policy', label: 'Contribute to health policy' },
] as const

export function DataControlsSummary({
  dataShareGp,
  dataShareResearch,
  dataSharePolicy,
}: DataControlsSummaryProps) {
  const values = {
    gp: dataShareGp,
    research: dataShareResearch,
    policy: dataSharePolicy,
  }

  return (
    <section className="mt-10">
      <h2 className={SECTION_LABEL}>Your data</h2>
      <div className="mt-4 space-y-3">
        {TOGGLES.map((toggle) => (
          <Link key={toggle.key} href={PATIENT_ROUTES.dataControls} className="block">
            <AuthToggle
              label={toggle.label}
              checked={values[toggle.key]}
              onChange={() => undefined}
              readOnly
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
