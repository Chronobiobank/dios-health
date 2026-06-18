'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MEDICATION_TIMINGS, type MedicationCode } from '@/lib/circadian/medications'
import type { PrescribingRecommendation } from '@/lib/prescribing/recommendations'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'
import { Badge } from '@/components/ui/Layout'

function formatTime(t: string | null): string {
  if (!t) return '—'
  return t.slice(0, 5)
}

export function PendingRecommendationsPanel({
  recommendations,
}: {
  recommendations: PrescribingRecommendation[]
}) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!recommendations.length) return null

  async function respond(id: string, action: 'accepted' | 'declined') {
    setLoadingId(id)
    setError(null)

    const res = await fetch(`/api/patient/recommendations/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })

    const data = await res.json()
    setLoadingId(null)

    if (!res.ok) {
      setError(data.error ?? 'Could not update recommendation.')
      return
    }

    router.refresh()
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="seco-page__eyebrow">From your clinician</p>
        <h2 className="seco-app-section-title">Timing recommendations</h2>
      </div>

      <div className="seco-app-card overflow-hidden !p-0">
        <ul className="divide-y divide-border">
          {recommendations.map((rec) => {
            const name =
              rec.medication_code in MEDICATION_TIMINGS
                ? MEDICATION_TIMINGS[rec.medication_code as MedicationCode].displayName
                : rec.medication_code

            return (
              <li key={rec.id} className="space-y-3 p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{name}</p>
                  <Badge tone="warning">Pending</Badge>
                </div>
                <p className="text-sm text-ink-muted">
                  Change {formatTime(rec.current_timing)} →{' '}
                  <span className="text-accent font-medium">
                    {formatTime(rec.recommended_timing)}
                  </span>
                </p>
                {rec.rationale && (
                  <p className="text-sm text-ink-muted">{rec.rationale}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={loadingId === rec.id}
                    onClick={() => respond(rec.id, 'accepted')}
                  >
                    {loadingId === rec.id ? 'Saving…' : 'Accept'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={loadingId === rec.id}
                    onClick={() => respond(rec.id, 'declined')}
                  >
                    Decline
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {error && <FormError>{error}</FormError>}
    </section>
  )
}
