'use client'

import { useMemo } from 'react'

import { PATIENT_SIX_DOSE_PROTOCOL } from '@/lib/deepdose-marketing/landing-content'
import { DOSE_PREVIEW_STATUS_LABEL } from '@/lib/patient/plan-dose-preview'
import { buildSixDoseStrip } from '@/lib/patient/six-dose-strip'
import { cn } from '@/lib/utils/cn'

type SixDoseStripProps = {
  /** Internal phase anchor hours (from sleep/wake). Not shown as DLMO to users. */
  phaseAnchorHours: number
  variant?: 'landing' | 'app'
}

export function SixDoseStrip({ phaseAnchorHours, variant = 'app' }: SixDoseStripProps) {
  const doses = useMemo(() => buildSixDoseStrip(phaseAnchorHours), [phaseAnchorHours])
  const doneCount = doses.filter((d) => d.status === 'done').length
  const copy = PATIENT_SIX_DOSE_PROTOCOL

  const nested = variant === 'landing'

  return (
    <section
      className={cn(
        'seco-planpreview',
        variant === 'app' && 'seco-planpreview--app',
        nested && 'seco-planpreview--nested'
      )}
    >
      {!nested ? (
        <div className="seco-planpreview__head">
          <div>
            <p className="seco-page__eyebrow">{copy.eyebrow}</p>
            <p className="seco-planpreview__day">{copy.title}</p>
            <p className="seco-planpreview__phase">{copy.support}</p>
            {variant === 'app' ? (
              <p className="seco-planpreview__phase">
                {doneCount} of {doses.length} done · timed to raise your SRI
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="seco-planpreview__phase seco-planpreview__phase--nested">{copy.support}</p>
      )}

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
              <p className="seco-planpreview__dose-note">{dose.note}</p>
            </div>
            <span className="seco-planpreview__dose-time font-mono tabular-nums">{dose.timeLabel}</span>
          </li>
        ))}
      </ul>
      <p className="seco-planpreview__phase">{copy.education}</p>
    </section>
  )
}
