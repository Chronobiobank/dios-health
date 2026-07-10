'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'
import { RhythmEditor } from '@/components/patient/RhythmEditor'
import { resolveOnboardingMedSeed } from '@/lib/patient/plan-onboarding-hydration'
import { readPlanDraft } from '@/lib/patient/plan-draft'
import { earliestTakeTime } from '@/lib/medications/home-to-onboarding'

export default function ChronotypeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const wakeHint = useMemo(() => {
    const seed = resolveOnboardingMedSeed(searchParams)
    if (seed.wake) return seed.wake
    const draft = typeof window !== 'undefined' ? readPlanDraft() : null
    return (
      draft?.wake?.trim()?.slice(0, 5) ??
      (draft?.medTimes?.length ? earliestTakeTime(draft.medTimes) : null)
    )
  }, [searchParams])

  return (
    <div className="dash-meds dash-meds--onboarding space-y-6">
      <OnboardingHeader step={3} eyebrow="Step 3 · Rhythm" title="Your sleep rhythm" />

      <RhythmEditor
        initialValues={wakeHint ? { workSleepEnd: wakeHint } : undefined}
        submitLabel="Update dose dash"
        savingLabel="Updating dash…"
        skipLabel="Skip for now"
        onSaved={() => {
          router.push('/connect')
          router.refresh()
        }}
        onSkip={() => router.push('/connect')}
      />
    </div>
  )
}
