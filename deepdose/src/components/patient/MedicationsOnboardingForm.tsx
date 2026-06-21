'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PatientMedicationsEditor } from '@/components/patient/PatientMedicationsEditor'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'
import {
  buildMedicationRecommendation,
  getCatalogEntry,
} from '@/lib/medications/catalog'
import { parseMedsOnboardingParams } from '@/lib/medications/home-to-onboarding'

interface MedicationsOnboardingFormProps {
  phaseOffsetMinutes: number
}

export default function MedicationsOnboardingForm({
  phaseOffsetMinutes,
}: MedicationsOnboardingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { med: medCode, time } = parseMedsOnboardingParams(searchParams)

  const initialFromHome = useMemo(() => {
    if (!medCode) {
      return { selected: undefined, details: undefined }
    }

    const entry = getCatalogEntry(medCode)
    if (!entry) {
      return { selected: undefined, details: undefined }
    }

    const recommendation = buildMedicationRecommendation(entry, phaseOffsetMinutes)
    const selected = new Map([[medCode, recommendation]])
    const details = {
      [medCode]: {
        doseValue: '',
        currentTiming: time ?? recommendation.recommendedStart ?? '08:00',
      },
    }

    return { selected, details }
  }, [medCode, time, phaseOffsetMinutes])

  return (
    <div className="dash-meds dash-meds--onboarding space-y-6">
      <OnboardingHeader
        step={2}
        eyebrow="Step 2 · Meds"
        title="Your medications"
      />

      <PatientMedicationsEditor
        key={`${medCode ?? ''}-${time ?? ''}`}
        phaseOffsetMinutes={phaseOffsetMinutes}
        initialSelected={initialFromHome.selected}
        initialDetails={initialFromHome.details}
        submitLabel="Continue"
        savingLabel="Saving…"
        skipLabel="Skip for now"
        onSaved={() => {
          router.push('/patient/dashboard')
          router.refresh()
        }}
      />
    </div>
  )
}
