'use client'

import { useEffect, useState } from 'react'

import { PhoticProgressRing } from '@/components/retinomic/photic-progress-ring'
import { resolveLiveMluxFeed, type LiveMluxFeedInput } from '@/lib/retinomic/live-mlux-feed'
import { photicContextBanner } from '@/lib/retinomic/photic-dose'

type PhoticDosePanelProps = {
  feedInput: LiveMluxFeedInput
  lightIrisDetected: boolean
}

export function PhoticDosePanel({ feedInput, lightIrisDetected }: PhoticDosePanelProps) {
  const [feed, setFeed] = useState(() => resolveLiveMluxFeed(feedInput))

  const vdrDose = feedInput.smartphoneFeed?.vdrDoseToday ?? null
  const observedAt = feedInput.smartphoneFeed?.observedAt ?? null
  const confidenceScore = feedInput.smartphoneFeed?.confidenceScore ?? null

  useEffect(() => {
    const tick = () => setFeed(resolveLiveMluxFeed(feedInput))
    tick()
    const interval = window.setInterval(tick, 60_000)
    return () => window.clearInterval(interval)
  }, [
    feedInput.melanopicLuxCeiling,
    feedInput.photicPhase,
    feedInput.mluxScore,
    feedInput.smartphoneActive,
    feedInput.hardwareBaseline,
    vdrDose,
    observedAt,
    confidenceScore,
  ])

  const banner = photicContextBanner(feedInput.photicPhase, lightIrisDetected)
  const pct =
    feedInput.melanopicLuxCeiling > 0
      ? Math.round((feed.melanopicLuxToday / feedInput.melanopicLuxCeiling) * 100)
      : 0

  return (
    <section
      className="dios-glass-outer retinomic-panel retinomic-panel--photic"
      aria-labelledby="photic-panel-title"
    >
      <p id="photic-panel-title" className="retinomic-panel__label">
        Light dose
      </p>
      <div className="retinomic-ring-wrap">
        <PhoticProgressRing
          current={feed.melanopicLuxToday}
          ceiling={feedInput.melanopicLuxCeiling}
        />
        <div className="retinomic-ring-metrics">
          <p className="retinomic-ring-value">
            {pct}% <span className="dash-sub text-sm font-normal">of ceiling</span>
          </p>
          <p className="retinomic-ring-caption">
            Target {feedInput.melanopicLuxCeiling} mLux · {feed.caption}
          </p>
          {feed.confidenceLabel ? (
            <p className="calm-auth-muted mt-1 font-mono text-[10px] uppercase tracking-widest">
              {feed.confidenceLabel}
              {feed.lastUpdatedLabel ? ` · ${feed.lastUpdatedLabel}` : ''}
            </p>
          ) : null}
        </div>
      </div>
      <p className="retinomic-photic-banner">{banner}</p>
    </section>
  )
}
