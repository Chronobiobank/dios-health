'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMedicationDisplayName } from '@/lib/medications/catalog'
import type { PrescribingRecommendation } from '@/lib/prescribing/recommendations'
import { formatTime24 } from '@/lib/utils/time'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

type RecommendationRowProps = {
  recommendation: PrescribingRecommendation
  loading: boolean
  onAccept: () => void
  onDecline: () => void
}

function RecommendationRow({
  recommendation,
  loading,
  onAccept,
  onDecline,
}: RecommendationRowProps) {
  const name = getMedicationDisplayName(recommendation.medication_code)
  const meta = `${formatTime24(recommendation.current_timing)} → ${formatTime24(recommendation.recommended_timing)}`

  return (
    <ProfileCollapsibleRow id={recommendation.id} label={name} meta={meta}>
      {recommendation.rationale && (
        <p className="text-sm leading-relaxed text-ink-muted">{recommendation.rationale}</p>
      )}
      <div className={`flex flex-wrap gap-2 ${recommendation.rationale ? 'mt-4' : ''}`}>
        <Button type="button" disabled={loading} onClick={onAccept}>
          {loading ? 'Saving…' : 'Accept'}
        </Button>
        <Button type="button" variant="secondary" disabled={loading} onClick={onDecline}>
          Decline
        </Button>
      </div>
    </ProfileCollapsibleRow>
  )
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
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="dash-clinician-recs-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="dash-clinician-recs-title" className="dash-meds__section-title">
          From your clinician
        </h2>
      </div>

      <ul className="dash-meds__list">
        {recommendations.map((rec) => (
          <RecommendationRow
            key={rec.id}
            recommendation={rec}
            loading={loadingId === rec.id}
            onAccept={() => void respond(rec.id, 'accepted')}
            onDecline={() => void respond(rec.id, 'declined')}
          />
        ))}
      </ul>

      {error && (
        <div className="mt-4">
          <FormError>{error}</FormError>
        </div>
      )}
    </section>
  )
}
