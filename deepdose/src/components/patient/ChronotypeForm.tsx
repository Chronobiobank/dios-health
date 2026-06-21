'use client'

import { useRouter } from 'next/navigation'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'
import { RhythmEditor } from '@/components/patient/RhythmEditor'

export default function ChronotypeForm() {
  const router = useRouter()

  return (
    <div className="dash-meds dash-meds--onboarding space-y-6">
      <OnboardingHeader step={3} eyebrow="Step 3 · Rhythm" title="Your sleep rhythm" />

      <RhythmEditor
        submitLabel="Update dose dash"
        savingLabel="Updating dash…"
        skipLabel="Skip for now"
        onSaved={() => {
          router.push('/patient/dashboard')
          router.refresh()
        }}
        onSkip={() => router.push('/patient/dashboard')}
      />
    </div>
  )
}
