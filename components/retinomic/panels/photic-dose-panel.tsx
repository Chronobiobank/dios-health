'use client'

import { PhoticProgressRing } from '@/components/retinomic/photic-progress-ring'
import type { PhoticDayPhase } from '@/lib/retinomic/types'
import { photicContextBanner } from '@/lib/retinomic/photic-dose'

type PhoticDosePanelProps = {
  melanopicLuxToday: number
  melanopicLuxCeiling: number
  phase: PhoticDayPhase
  lightIrisDetected: boolean
  doseSourceCaption?: string
}

export function PhoticDosePanel({
  melanopicLuxToday,
  melanopicLuxCeiling,
  phase,
  lightIrisDetected,
  doseSourceCaption,
}: PhoticDosePanelProps) {
  const banner = photicContextBanner(phase, lightIrisDetected)
  const pct = melanopicLuxCeiling > 0 ? Math.round((melanopicLuxToday / melanopicLuxCeiling) * 100) : 0

  return (
    <section
      className="dios-glass-outer retinomic-panel retinomic-panel--photic"
      aria-labelledby="photic-panel-title"
    >
      <p id="photic-panel-title" className="retinomic-panel__label">
        Light dose
      </p>
      <div className="retinomic-ring-wrap">
        <PhoticProgressRing current={melanopicLuxToday} ceiling={melanopicLuxCeiling} />
        <div className="retinomic-ring-metrics">
          <p className="retinomic-ring-value">
            {pct}% <span className="dash-sub text-sm font-normal">of ceiling</span>
          </p>
          <p className="retinomic-ring-caption">
            Target {melanopicLuxCeiling} mLux · {doseSourceCaption ?? 'phone sensor'}
          </p>
        </div>
      </div>
      <p className="retinomic-photic-banner">{banner}</p>
    </section>
  )
}
