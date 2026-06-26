'use client'

import { useMemo } from 'react'

import { DOSE_PREVIEW_STATUS_LABEL } from '@/lib/patient/plan-dose-preview'
import { buildSixDoseStrip } from '@/lib/patient/six-dose-strip'
import { cn } from '@/lib/utils/cn'

type SixDoseStripProps = {
  dlmoEstimateHours: number
  variant?: 'landing' | 'app'
}

export function SixDoseStrip({ dlmoEstimateHours, variant = 'app' }: SixDoseStripProps) {
  const doses = useMemo(
    () => buildSixDoseStrip(dlmoEstimateHours),
    [dlmoEstimateHours]
  )

  const doneCount = doses.filter((d) => d.status === 'done').length

  return (
    <section className={cn('seco-planpreview', variant === 'app' && 'seco-planpreview--app')}>
      <div className="seco-planpreview__head">
        <div>
          <p className="seco-page__eyebrow">Today&apos;s six doses</p>
          <p className="seco-planpreview__day">Your dose protocol</p>
          <p className="seco-planpreview__phase">
            {doneCount} of {doses.length} done · timed to your body clock
          </p>
        </div>
      </div>

      <ul className="seco-planpreview__doses" aria-label="Today's six doses">
        {doses.map((dose) => (
          <li
            key={dose.id}
            className={cn('seco-planpreview__dose', `seco-planpreview__dose--${dose.status}`)}
          >
            <span className={cn('seco-planpreview__accent', `seco-planpreview__accent--${dose.tone}`)} />
            <div className="seco-planpreview__dose-body">
              <div className="seco-planpreview__dose-top">
                <span className="seco-planpreview__dose-label">{dose.shortLabel}</span>
                <span className={cn('seco-planpreview__pill', `seco-planpreview__pill--${dose.status}`)}>
                  {dose.status === 'now' && (
                    <span className="seco-hero-tabs__dot seco-hero-tabs__dot--live" />
                  )}
                  {DOSE_PREVIEW_STATUS_LABEL[dose.status]}
                </span>
              </div>
              <p className="seco-planpreview__dose-note">{dose.note}</p>
            </div>
            <span className="seco-planpreview__dose-time font-mono tabular-nums">{dose.timeLabel}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
