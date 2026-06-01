import { DASHBOARD_CARD, DASHBOARD_BODY, MONO_DATA, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { resolveChronotypeLabel } from '@/lib/dashboard/mlux-profile'

type MLuxScoreCardProps = {
  profile: MLuxProfileRow
}

export function MLuxScoreCard({ profile }: MLuxScoreCardProps) {
  const score = profile.confidence_score ?? 0
  const band = profile.confidence_band_minutes ?? 75
  const label = profile.confidence_label ?? 'Low'
  const nights = profile.nights_count ?? 0
  const chronotype = resolveChronotypeLabel(profile)

  return (
    <section>
      <div className={DASHBOARD_CARD}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={SECTION_LABEL}>Circadian signal confidence</p>
            <p className="mt-3 text-[15px] font-medium text-black">
              MLux score · {score} m-EDI
            </p>
            <p className="mt-1 text-[15px] capitalize text-black/60">{chronotype}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[28px] font-semibold leading-none text-black">{score}%</p>
            <p className={`${MONO_DATA} mt-1`}>{label}</p>
          </div>
        </div>
        <p className={`${DASHBOARD_BODY} mt-4`}>
          Based on {nights} TipTraQ night{nights === 1 ? '' : 's'}. Confidence band ±{band} minutes.
        </p>
      </div>
    </section>
  )
}
