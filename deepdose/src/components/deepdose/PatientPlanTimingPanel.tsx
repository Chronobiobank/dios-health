'use client'

import { cn } from '@/lib/utils/cn'
import { DEEPDOSE_PATIENT_PLAN_TIMING } from '@/lib/deepdose-marketing/landing-content'
import { RISK_RANK } from '@/lib/medications/polypharmacy-timing'
import {
  syncStateForRisk,
  SYNC_LABEL,
  type PolyPlanMed,
} from '@/lib/medications/poly-plan-meds'

type PatientPlanTimingPanelProps = {
  meds: PolyPlanMed[]
  takeTimes?: Record<string, string>
  verdict?: string
  syncedCount?: number
  reviewCount?: number
  variant?: 'landing' | 'app'
  /** Med stack only — for nesting inside a parent glass tile on sleep–wake dash. */
  layout?: 'full' | 'meds-in-panel'
  sectionTitle?: string
  headingId?: string
}

const SYNC_ACCENT: Record<'synced' | 'review' | 'conflict', string> = {
  synced: 'synced',
  review: 'review',
  conflict: 'conflict',
}

function MedTileStack({
  meds,
  takeTimes,
  prefix,
}: {
  meds: PolyPlanMed[]
  takeTimes?: Record<string, string>
  prefix: 'seco-plan-tile' | 'patient-dash-tile'
}) {
  const sorted = [...meds].sort((a, b) => RISK_RANK[b.meta.risk] - RISK_RANK[a.meta.risk])

  return (
    <ol className={`${prefix}-stack`}>
      {sorted.map(({ code, name, meta }) => {
        const sync = syncStateForRisk(meta.risk)
        return (
          <li
            key={code}
            className={cn(prefix, `${prefix}--med`, `${prefix}--med-${sync}`)}
          >
            <span
              className={cn(`${prefix}__accent`, `${prefix}__accent--${SYNC_ACCENT[sync]}`)}
              aria-hidden
            />
            <div className={`${prefix}__med-body`}>
              <div className={`${prefix}__med-top`}>
                <p className={`${prefix}__med-name`}>{name}</p>
                <span className={cn(`${prefix}__pill`, `${prefix}__pill--${sync}`)}>
                  {SYNC_LABEL[sync]}
                </span>
              </div>
              <p className={`${prefix}__med-window`}>
                {takeTimes?.[code] ? (
                  <>
                    You take at{' '}
                    <span className="font-mono tabular-nums">{takeTimes[code]}</span>
                    <span aria-hidden> · </span>
                  </>
                ) : null}
                {meta.timing}
                <span aria-hidden> · </span>
                {meta.window}
              </p>
              <p className={`${prefix}__med-action`}>{meta.instruction}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function PatientPlanTimingPanel({
  meds,
  takeTimes,
  verdict = '',
  syncedCount = 0,
  reviewCount = 0,
  variant = 'landing',
  layout = 'full',
  sectionTitle,
  headingId,
}: PatientPlanTimingPanelProps) {
  const prefix = variant === 'landing' ? 'seco-plan-tile' : 'patient-dash-tile'
  const allClear = reviewCount === 0
  const syncPct = meds.length > 0 ? Math.round((syncedCount / meds.length) * 100) : 0
  const copy = DEEPDOSE_PATIENT_PLAN_TIMING

  if (layout === 'meds-in-panel') {
    return (
      <>
        {sectionTitle ? (
          <p id={headingId} className={`${prefix}__eyebrow`}>
            {sectionTitle}
          </p>
        ) : null}
        <MedTileStack meds={meds} takeTimes={takeTimes} prefix={prefix} />
      </>
    )
  }

  return (
    <div className={cn(variant === 'landing' ? 'seco-plan-tiles' : 'patient-dash-tiles')}>
      <article className={cn(prefix, `${prefix}--sync`)}>
        <div className={`${prefix}__sync-grid`}>
          <div className={`${prefix}__sync-primary`}>
            <p className={`${prefix}__eyebrow`}>{copy.syncEyebrow}</p>
            <p
              className={`${prefix}__sync-score`}
              aria-label={copy.syncScoreAria(syncedCount, meds.length)}
            >
              <span className={`${prefix}__sync-num`}>{syncedCount}</span>
              <span className={`${prefix}__sync-of`}>of {meds.length}</span>
            </p>
            <p className={`${prefix}__sync-caption`}>{copy.syncCaption}</p>
          </div>

          <div className={`${prefix}__sync-meter`} aria-hidden>
            <div className={`${prefix}__sync-meter-track`}>
              <span
                className={`${prefix}__sync-meter-fill`}
                style={{ width: `${syncPct}%` }}
              />
            </div>
            <span className={`${prefix}__sync-meter-label`}>{copy.syncMeter(syncPct)}</span>
          </div>
        </div>

        <div className={`${prefix}__chips`} role="list">
          <span className={cn(`${prefix}__chip`, `${prefix}__chip--synced`)} role="listitem">
            {copy.syncedChip(syncedCount)}
          </span>
          {!allClear && (
            <span className={cn(`${prefix}__chip`, `${prefix}__chip--review`)} role="listitem">
              {copy.reviewChip(reviewCount)}
            </span>
          )}
        </div>

        <p className={`${prefix}__verdict`}>{verdict}</p>
      </article>

      <MedTileStack meds={meds} takeTimes={takeTimes} prefix={prefix} />
    </div>
  )
}
