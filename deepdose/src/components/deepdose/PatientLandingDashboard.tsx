'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { SocialProfileView } from '@/components/deepdose/SocialProfileView'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type PatientLandingDashboardProps = {
  planContext: PlanContextFromDraft
  signupHref?: string
  accountGear?: ReactNode
}

export function PatientLandingDashboard({
  planContext,
  accountGear,
}: PatientLandingDashboardProps) {
  return (
    <ProductAppShell title="Me" trailing={accountGear} className="dd-profile">
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
