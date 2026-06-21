'use client'

import { getMedicationDisplayName } from '@/lib/medications/catalog'
import type { PrescribingRecommendation } from '@/lib/prescribing/recommendations'
import { PRESCRIBING_STATUS_LABEL } from '@/lib/clinical/patient-chart'
import { formatDateTime24, formatTime24 } from '@/lib/utils/time'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Badge } from '@/components/ui/Layout'

function RecommendationRow({ recommendation }: { recommendation: PrescribingRecommendation }) {
  const name = getMedicationDisplayName(recommendation.medication_code)
  const meta = `${PRESCRIBING_STATUS_LABEL[recommendation.status] ?? recommendation.status} · ${formatTime24(recommendation.current_timing)} → ${formatTime24(recommendation.recommended_timing)}`

  return (
    <ProfileCollapsibleRow id={recommendation.id} label={name} meta={meta}>
      <dl className="clinical-triage__facts">
        <div>
          <dt>Status</dt>
          <dd>
            <Badge tone={recommendation.status === 'pending' ? 'warning' : 'success'}>
              {PRESCRIBING_STATUS_LABEL[recommendation.status] ?? recommendation.status}
            </Badge>
          </dd>
        </div>
        <div>
          <dt>Proposed</dt>
          <dd>
            {formatTime24(recommendation.current_timing)} →{' '}
            {formatTime24(recommendation.recommended_timing)}
          </dd>
        </div>
        <div>
          <dt>Sent</dt>
          <dd>{formatDateTime24(recommendation.created_at)}</dd>
        </div>
        {recommendation.actioned_at && (
          <div>
            <dt>Actioned</dt>
            <dd>{formatDateTime24(recommendation.actioned_at)}</dd>
          </div>
        )}
      </dl>

      {recommendation.rationale && (
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">{recommendation.rationale}</p>
      )}
    </ProfileCollapsibleRow>
  )
}

export function ClinicalRecommendationsPanel({
  recommendations,
}: {
  recommendations: PrescribingRecommendation[]
}) {
  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="clinical-recommendations-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="clinical-recommendations-title" className="dash-meds__section-title">
          Recommendations
        </h2>
      </div>

      {recommendations.length === 0 ? (
        <p className="dash-meds__empty-copy">No timing recommendations sent yet.</p>
      ) : (
        <ul className="dash-meds__list">
          {recommendations.map((rec) => (
            <RecommendationRow key={rec.id} recommendation={rec} />
          ))}
        </ul>
      )}
    </section>
  )
}
