'use client'

import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { ProfileDashboardView } from '@/components/deepdose/ProfileDashboardView'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type ProfilePageClientProps = {
  urlPlanContext?: PlanContextFromDraft
  signupHrefFromUrl: string
}

export function ProfilePageClient({
  urlPlanContext,
  signupHrefFromUrl,
}: ProfilePageClientProps) {
  return (
    <ProductAppShell title="Profile" className="dd-profile-page">
      <ProfileDashboardView
        urlPlanContext={urlPlanContext}
        signupHrefFromUrl={signupHrefFromUrl}
      />
    </ProductAppShell>
  )
}
