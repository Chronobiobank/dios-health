'use client'

import Link from 'next/link'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { SocialProfileView } from '@/components/deepdose/SocialProfileView'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type PatientLandingDashboardProps = {
  planContext: PlanContextFromDraft
  signupHref?: string
}

export function PatientLandingDashboard({
  planContext,
}: PatientLandingDashboardProps) {
  return (
    <ProductAppShell title="Me" className="dd-profile">
      <SocialProfileView
        medCodes={planContext.medCodes}
        medTimes={planContext.medTimes}
        wake={planContext.wake}
      />
    </ProductAppShell>
  )
}

/** Inbox link for Connect top bar */
export function ConnectInboxLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="app-top-bar__text-btn">
      {label}
    </Link>
  )
}
