'use client'

import { useRouter } from 'next/navigation'
import type { MCTQInput } from '@/lib/circadian/mctq'
import { RhythmEditor } from '@/components/patient/RhythmEditor'
import { Button } from '@/components/ui/Button'

type DashboardRhythmPanelProps = {
  initialValues?: Partial<MCTQInput>
}

export function DashboardRhythmPanel({ initialValues }: DashboardRhythmPanelProps) {
  const router = useRouter()

  return (
    <RhythmEditor
      key={JSON.stringify(initialValues ?? {})}
      initialValues={initialValues}
      submitLabel="Save & update dose dash"
      savingLabel="Updating dash…"
      onSaved={() => {
        router.push('/patient/dashboard')
        router.refresh()
      }}
      secondaryAction={
        <Button href="/patient/dashboard" variant="secondary" className="dash-meds__cancel">
          Back to dash
        </Button>
      }
    />
  )
}
