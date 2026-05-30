import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { formatDbTime } from '@/lib/dashboard/dlmo-profile'

type DlmoScoreCardProps = {
  profile: DlmoProfileRow
}

export function DlmoScoreCard({ profile }: DlmoScoreCardProps) {
  const score = profile.confidence_score ?? 0
  const band = profile.confidence_band_minutes ?? 75
  const label = profile.confidence_label ?? 'Low'
  const nights = profile.nights_count ?? 0
  const dlmoTime = formatDbTime(profile.proxy_dlmo_rolling)

  return (
    <section className="mt-6">
      <div className="rounded-2xl border-[0.5px] border-black/[0.08] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={SECTION_LABEL}>Body clock confidence</p>
            <p className="mt-2 text-base font-medium text-black">
              Proxy DLMO · {dlmoTime}
            </p>
            <p className="mt-1 text-sm capitalize text-black/55">{profile.chronotype}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-medium text-black">{score}%</p>
            <p className="font-mono text-[11px] text-black/45">{label}</p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-300"
            style={{ width: `${Math.min(100, score)}%` }}
          />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-black/45">
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
