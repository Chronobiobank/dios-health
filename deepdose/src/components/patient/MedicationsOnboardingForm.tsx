'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PatientMedicationsEditor } from '@/components/patient/PatientMedicationsEditor'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'
import { buildChronotypeOnboardingPath } from '@/lib/medications/home-to-onboarding'
import {
  buildOnboardingMedEditorState,
  medsPathOptionsFromSeed,
  resolveOnboardingMedSeed,
  resolveOnboardingMedSeedFromUrl,
} from '@/lib/patient/plan-onboarding-hydration'
import { useIsClient } from '@/lib/react/use-is-client'

interface MedicationsOnboardingFormProps {
  phaseOffsetMinutes: number
}

export default function MedicationsOnboardingForm({
  phaseOffsetMinutes,
}: MedicationsOnboardingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isClient = useIsClient()
  const seed = useMemo(
    () =>
      isClient
        ? resolveOnboardingMedSeed(searchParams)
        : resolveOnboardingMedSeedFromUrl(searchParams),
    [isClient, searchParams]
  )

  const initialFromPlan = useMemo(
    () => buildOnboardingMedEditorState(seed, phaseOffsetMinutes),
    [seed, phaseOffsetMinutes]
  )

  const medPathOptions = useMemo(() => medsPathOptionsFromSeed(seed), [seed])

  return (
    <div className="dash-meds dash-meds--onboarding space-y-6">
      <OnboardingHeader
        step={2}
        eyebrow="Step 2 · Meds"
        title="Your medications"
      />

      <PatientMedicationsEditor
        key={initialFromPlan?.seedKey ?? 'empty'}
        phaseOffsetMinutes={phaseOffsetMinutes}
        initialSelected={initialFromPlan?.selected}
        initialDetails={initialFromPlan?.details}
        submitLabel="Continue"
        savingLabel="Saving…"
        skipLabel="Skip for now"
        onSaved={() => {
          router.push(buildChronotypeOnboardingPath(medPathOptions))
          router.refresh()
        }}
      />
    </div>
  )
}
