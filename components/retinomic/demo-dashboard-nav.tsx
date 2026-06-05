import Link from 'next/link'

import { HOW_IT_WORKS_DEMO_COPY } from '@/lib/pitch/retinomic-landing-copy'

/** Public demo — no auth profile links */
export function DemoDashboardNav() {
  return (
    <header className="patient-dashboard-nav relative z-10 bg-transparent">
      <div className="flex w-full min-w-0 flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="type-pitch-eyebrow text-[0.625rem]">{HOW_IT_WORKS_DEMO_COPY.eyebrow}</p>
          <p className="patient-dashboard-nav__greeting mt-1 truncate">Kia ora, Sean.</p>
          <p className="calm-auth-muted font-mono text-[10px]">{HOW_IT_WORKS_DEMO_COPY.sampleLabel}</p>
        </div>
        <Link href={HOW_IT_WORKS_DEMO_COPY.primaryHref} className="dios-btn-on-light shrink-0 text-sm">
          {HOW_IT_WORKS_DEMO_COPY.primaryCta} →
        </Link>
      </div>
    </header>
  )
}
