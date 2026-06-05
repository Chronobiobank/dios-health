'use client'

import { PhoticProgressRing } from '@/components/retinomic/photic-progress-ring'
import type { PhoticDayPhase } from '@/lib/retinomic/types'
import { photicContextBanner } from '@/lib/retinomic/photic-dose'

type PhoticDosePanelProps = {
  melanopicLuxToday: number
  melanopicLuxCeiling: number
  phase: PhoticDayPhase
  lightIrisDetected: boolean
}

export function PhoticDosePanel({
  melanopicLuxToday,
  melanopicLuxCeiling,
  phase,
  lightIrisDetected,
}: PhoticDosePanelProps) {
  const banner = photicContextBanner(phase, lightIrisDetected)
  const pct = melanopicLuxCeiling > 0 ? Math.round((melanopicLuxToday / melanopicLuxCeiling) * 100) : 0

  return (
    <section className="retinomic-panel retinomic-panel--photic" aria-labelledby="photic-panel-title">
      <p id="photic-panel-title" className="retinomic-panel__label">
        Physical input · photic dose
      </p>
      <div className="retinomic-ring-wrap">
        <PhoticProgressRing current={melanopicLuxToday} ceiling={melanopicLuxCeiling} />
        <div className="retinomic-ring-metrics">
          <p className="retinomic-ring-value">
            {pct}% <span className="text-sm font-normal text-[rgb(250_250_247/0.55)]">of ceiling</span>
          </p>
          <p className="retinomic-ring-caption">
            Target {melanopicLuxCeiling} mLux · passive smartphone photometry
          </p>
        </div>
      </div>
      <p className="retinomic-photic-banner">{banner}</p>
    </section>
  )
}
