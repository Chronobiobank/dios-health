'use client'

import { useMemo } from 'react'

import { DOSE_PREVIEW_STATUS_LABEL } from '@/lib/patient/plan-dose-preview'
import { buildSixDoseStrip } from '@/lib/patient/six-dose-strip'
import { cn } from '@/lib/utils/cn'

type SixDoseStripProps = {
  /** Internal phase anchor hours (from sleep/wake). Not shown as DLMO to users. */
  phaseAnchorHours: number
  variant?: 'landing' | 'app'
}

/** Six timed doses — list only. No eyebrows, education, or progress waffle. */
export function SixDoseStrip({ phaseAnchorHours, variant = 'app' }: SixDoseStripProps) {
  const doses = useMemo(() => buildSixDoseStrip(phaseAnchorHours), [phaseAnchorHours])

  return (
    <section
      className={cn(
        'seco-planpreview',
        variant === 'app' && 'seco-planpreview--app',
        variant === 'landing' && 'seco-planpreview--nested'
      )}
    >
      <ul className="seco-planpreview__doses" aria-label="Your six doses">
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
            </div>
            <span className="seco-planpreview__dose-time font-mono tabular-nums">{dose.timeLabel}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
