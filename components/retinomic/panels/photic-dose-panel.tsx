'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { LightCheckIn } from '@/components/retinomic/light-check-in'
import { PhoticProgressRing } from '@/components/retinomic/photic-progress-ring'
import type { FeedFreshness } from '@/lib/retinomic/feed-retention'
import type { LightCheckInConfig } from '@/lib/retinomic/light-check-in'
import {
  resolveLiveMluxFeed,
  type LiveMluxFeedInput,
  type SmartphoneFeedSnapshot,
} from '@/lib/retinomic/live-mlux-feed'
import { photicContextBanner } from '@/lib/retinomic/photic-dose'

type PhoticDosePanelProps = {
  feedInput: LiveMluxFeedInput
  lightIrisDetected: boolean
  lightCheckIn?: LightCheckInConfig | null
  feedFreshness?: FeedFreshness
}

export function PhoticDosePanel({
  feedInput,
  lightIrisDetected,
  lightCheckIn = null,
  feedFreshness = 'none',
}: PhoticDosePanelProps) {
  const [feedOverride, setFeedOverride] = useState<SmartphoneFeedSnapshot | null>(null)

  const activeFeedInput = useMemo<LiveMluxFeedInput>(
    () => ({
      ...feedInput,
      smartphoneFeed: feedOverride ?? feedInput.smartphoneFeed,
      smartphoneActive: feedOverride != null ? true : feedInput.smartphoneActive,
    }),
    [feedInput, feedOverride]
  )

  const [feed, setFeed] = useState(() => resolveLiveMluxFeed(activeFeedInput))

  const vdrDose = activeFeedInput.smartphoneFeed?.vdrDoseToday ?? null
  const observedAt = activeFeedInput.smartphoneFeed?.observedAt ?? null
  const confidenceScore = activeFeedInput.smartphoneFeed?.confidenceScore ?? null

  useEffect(() => {
    const tick = () => setFeed(resolveLiveMluxFeed(activeFeedInput))
    tick()
    const interval = window.setInterval(tick, 60_000)
    return () => window.clearInterval(interval)
  }, [
    activeFeedInput.melanopicLuxCeiling,
    activeFeedInput.photicPhase,
    activeFeedInput.mluxScore,
    activeFeedInput.smartphoneActive,
    activeFeedInput.hardwareBaseline,
    vdrDose,
    observedAt,
    confidenceScore,
  ])

  const handleLogged = useCallback((snapshot: SmartphoneFeedSnapshot) => {
    setFeedOverride(snapshot)
    setFeed(resolveLiveMluxFeed({
      ...feedInput,
      smartphoneFeed: snapshot,
      smartphoneActive: true,
    }))
  }, [feedInput])

  const effectiveFreshness: FeedFreshness = feedOverride ? 'fresh' : feedFreshness
  const banner = photicContextBanner(activeFeedInput.photicPhase, lightIrisDetected)
  const showStaleNudge = feed.staleNudge != null && !feedOverride
  const emphasizeCheckIn =
    effectiveFreshness === 'stale' ||
    effectiveFreshness === 'none' ||
    effectiveFreshness === 'aging'
  const pct =
    activeFeedInput.melanopicLuxCeiling > 0
      ? Math.round((feed.melanopicLuxToday / activeFeedInput.melanopicLuxCeiling) * 100)
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
          ceiling={activeFeedInput.melanopicLuxCeiling}
        />
        <div className="retinomic-ring-metrics">
          <p className="retinomic-ring-value">
            {pct}% <span className="dash-sub text-sm font-normal">of ceiling</span>
          </p>
          <p className="retinomic-ring-caption">
            Target {activeFeedInput.melanopicLuxCeiling} mLux · {feed.caption}
          </p>
          {feed.confidenceLabel ? (
            <p className="calm-auth-muted mt-1 font-mono text-[10px] uppercase tracking-widest">
              {feed.confidenceLabel}
              {feed.lastUpdatedLabel ? ` · ${feed.lastUpdatedLabel}` : ''}
            </p>
          ) : null}
        </div>
      </div>
      {showStaleNudge ? (
        <p className="retinomic-photic-stale-nudge" role="status">
          {feed.staleNudge}
        </p>
      ) : feed.agingHint ? (
        <p className="retinomic-photic-aging-hint" role="status">
          {feed.agingHint} — check in when you can
        </p>
      ) : null}
      <p className="retinomic-photic-banner">{banner}</p>
      {lightCheckIn ? (
        <LightCheckIn
          phase={activeFeedInput.photicPhase}
          config={lightCheckIn}
          feedFreshness={effectiveFreshness}
          emphasize={emphasizeCheckIn}
          onLogged={handleLogged}
        />
      ) : null}
    </section>
  )
}
