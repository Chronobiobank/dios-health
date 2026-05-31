import { DASHBOARD_CARD, DASHBOARD_BODY, MONO_DATA, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { resolveChronotypeLabel } from '@/lib/dashboard/dlmo-profile'

type DlmoScoreCardProps = {
  profile: DlmoProfileRow
}

export function DlmoScoreCard({ profile }: DlmoScoreCardProps) {
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

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-300"
            style={{ width: `${Math.min(100, score)}%` }}
          />
        </div>

        <div className={`${MONO_DATA} mt-3 flex flex-wrap items-center justify-between gap-2`}>
          <span>± {band} minutes</span>
          <span>
            {nights} night{nights === 1 ? '' : 's'} uploaded
            {nights < 3 && ` · ${3 - nights} more for clinical confidence`}
          </span>
        </div>
      </div>
    </section>
  )
}
