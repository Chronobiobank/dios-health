'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import LoginForm from '@/components/auth/LoginForm'
import { HomeDrugSearch } from '@/components/deepdose/HomeDrugSearch'
import { FOUNDERS_JOIN } from '@/lib/deepdose-marketing/founders-content'
import { buildPatientLandingPath } from '@/lib/medications/home-to-onboarding'
import { savePlanDraft } from '@/lib/patient/plan-draft'

type PlanSnapshot = {
  medCodes: string[]
  medTimes: string[]
  wake: string | null
}

/** Founder join: 2 med pills + email/password → /profile. */
export function FounderJoinForm() {
  const router = useRouter()
  const [plan, setPlan] = useState<PlanSnapshot | null>(null)

  const handlePlanChange = useCallback((next: PlanSnapshot) => {
    setPlan(next)
    savePlanDraft(next)
  }, [])

  useEffect(() => {
    if (!plan) return
    const landing = buildPatientLandingPath({
      medCodes: plan.medCodes,
      medTimes: plan.medTimes,
      wake: plan.wake ?? undefined,
    })
    const href = `/founders/join?signup=1&next=${encodeURIComponent(landing)}`
    router.replace(href, { scroll: false })
  }, [plan, router])

  return (
    <div className="dd-oai-stack">
      <header>
        <h1 className="seco-page__title">
          <span className="seco-landing__hero-spectrum">{FOUNDERS_JOIN.title}</span>
        </h1>
        <p className="seco-page__lede">{FOUNDERS_JOIN.lede}</p>
      </header>

      <section aria-label="Baseline medications">
        <p className="seco-page__eyebrow">{FOUNDERS_JOIN.medsLabel}</p>
        <HomeDrugSearch showCta={false} destination="profile" onPlanChange={handlePlanChange} />
      </section>

      <section aria-label="Create account">
        <p className="seco-page__eyebrow">{FOUNDERS_JOIN.authLabel}</p>
        <Suspense fallback={<p className="text-sm text-ink-muted">Loading…</p>}>
          <LoginForm
            variant="splash"
            hideDisplayName
            submitLabel={FOUNDERS_JOIN.submitLabel}
          />
        </Suspense>
      </section>
    </div>
  )
}
