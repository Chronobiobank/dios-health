'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { DEEPDOSE_PATIENT_PLAN_TIMING } from '@/lib/deepdose-marketing/landing-content'
import {
  TIME_ORDER,
} from '@/lib/medications/polypharmacy-timing'
import type { PolyPlanMed } from '@/lib/medications/poly-plan-meds'
import {
  buildDoseTimelineMarkers,
  DOSE_PREVIEW_STATUS_LABEL,
  dosePreviewStatus,
  dosePreviewTone,
  doseTimeForMed,
  openWindowLabel,
  PLAN_TICKS,
  primaryNowMarkerPos,
} from '@/lib/patient/plan-dose-preview'

type PatientPlanDosingPanelProps = {
  meds: PolyPlanMed[]
  wake: string | null
  takeTimes?: Record<string, string>
  variant?: 'landing' | 'app'
}

function useMountReveal() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setActive(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return active
}

export function PatientPlanDosingPanel({
  meds,
  wake,
  takeTimes,
  variant = 'landing',
}: PatientPlanDosingPanelProps) {
  const active = useMountReveal()
  const sorted = [...meds].sort(
    (a, b) =>
      (TIME_ORDER[a.meta.timing.toLowerCase()] ?? 2) -
      (TIME_ORDER[b.meta.timing.toLowerCase()] ?? 2)
  )
  const markers = buildDoseTimelineMarkers(sorted, wake, takeTimes)
  const nowPos = primaryNowMarkerPos(markers)
  const windowLabel = openWindowLabel(sorted, wake)
  const wakeLabel = wake ?? '07:30'

  return (
    <div className={cn('seco-planpreview', variant === 'app' && 'seco-planpreview--app')}>
      <div className="seco-planpreview__head">
        <div>
          <p className="seco-planpreview__day">{DEEPDOSE_PATIENT_PLAN_TIMING.dosingTitle}</p>
          <p className="seco-planpreview__phase">
            Today · Wake <span className="font-mono tabular-nums">{wakeLabel}</span>
            {' · '}
            {sorted.length} dose{sorted.length === 1 ? '' : 's'}
          </p>
        </div>
        {windowLabel ? (
          <span className="seco-planpreview__window">
            <span className="seco-hero-tabs__dot seco-hero-tabs__dot--open" />
            {windowLabel}
          </span>
        ) : null}
      </div>

      <div className="seco-planpreview__timeline">
        <div className="seco-planpreview__rail">
          {markers.map((marker) => (
            <span
              key={marker.id}
              className={cn(
                'seco-planpreview__marker',
                `seco-planpreview__marker--${marker.tone}`,
                marker.now && 'seco-planpreview__marker--now'
              )}
              style={{ left: `${marker.pos}%` }}
              title={marker.label}
            />
          ))}
          <span
            className={cn('seco-planpreview__now', active && 'seco-planpreview__now--in')}
            style={{ left: `${nowPos}%` }}
          >
            <span className="seco-planpreview__now-label">Now</span>
          </span>
        </div>
        <div className="seco-planpreview__ticks">
          {PLAN_TICKS.map((tick) => (
            <span
              key={tick.label}
              className="seco-planpreview__tick"
              style={{ left: `${tick.pos}%` }}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      <ul className="seco-planpreview__doses" aria-label={DEEPDOSE_PATIENT_PLAN_TIMING.dosingTitle}>
        {sorted.map(({ code, name, meta }) => {
          const status = dosePreviewStatus(meta.timing)
          const tone = dosePreviewTone(meta.timing)
          return (
            <li
              key={code}
              className={cn('seco-planpreview__dose', `seco-planpreview__dose--${status}`)}
            >
              <span className={cn('seco-planpreview__accent', `seco-planpreview__accent--${tone}`)} />
              <div className="seco-planpreview__dose-body">
                <div className="seco-planpreview__dose-top">
                  <span className="seco-planpreview__dose-label">{name}</span>
                  <span className={cn('seco-planpreview__pill', `seco-planpreview__pill--${status}`)}>
                    {status === 'now' && (
                      <span className="seco-hero-tabs__dot seco-hero-tabs__dot--live" />
                    )}
                    {DOSE_PREVIEW_STATUS_LABEL[status]}
                  </span>
                </div>
                <p className="seco-planpreview__dose-note">{meta.instruction}</p>
              </div>
              <span className="seco-planpreview__dose-time">
                {doseTimeForMed(code, meta, wake, takeTimes)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
