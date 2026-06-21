'use client'

import { useState } from 'react'
import type { MedicationRecommendation } from '@/lib/medications/recommendations'
import { Badge } from '@/components/ui/Layout'
import { NumberInput, TimeInput } from '@/components/ui/Form'
import { Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface MedicationCardProps {
  medication: MedicationRecommendation
  doseValue: string
  currentTiming: string
  onDoseChange: (value: string) => void
  onTimingChange: (value: string) => void
  onRemove: () => void
}

const GRADE_TONE: Record<string, 'accent' | 'warning' | 'neutral'> = {
  A: 'accent',
  B: 'warning',
  C: 'neutral',
}

const DOSE_LABEL: Record<string, string> = {
  mg: 'Dose (mg)',
  mcg: 'Dose (mcg)',
  iu: 'Dose (IU)',
  units: 'Dose (units)',
}

export default function MedicationCard({
  medication,
  doseValue,
  currentTiming,
  onDoseChange,
  onTimingChange,
  onRemove,
}: MedicationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isOptimised = medication.timingTier === 'optimised'
  const doseLabel = DOSE_LABEL[medication.doseUnit] ?? 'Dose'
  const summaryTiming = currentTiming || medication.recommendedStart

  return (
    <li className="dash-med-row dios-select-card dios-select-card--selected">
      <button
        type="button"
        className="dash-med-row__toggle"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls={`dash-med-detail-${medication.code}`}
      >
        <span className="dash-med-row__summary min-w-0 flex-1 text-left">
          <span className="dash-med-row__name">{medication.displayName}</span>
          {summaryTiming && (
            <span className="dash-med-row__meta">
              <span className="font-mono">{summaryTiming}</span>
            </span>
          )}
        </span>
        <span className="dose-dash-expand-icon" aria-hidden>
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div
          id={`dash-med-detail-${medication.code}`}
          className="dash-med-row__detail border-t border-border px-4 pb-4 pt-3 md:px-5 md:pb-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-ink-faint">{medication.drugClass}</span>
                {isOptimised ? (
                  <Badge tone="accent">Clock optimised</Badge>
                ) : (
                  <Badge tone="neutral">Tracked</Badge>
                )}
                {medication.evidenceGrade && (
                  <Badge tone={GRADE_TONE[medication.evidenceGrade] ?? 'neutral'}>
                    Grade {medication.evidenceGrade}
                  </Badge>
                )}
              </span>

              {medication.rationale && (
                <p className="text-sm leading-relaxed text-ink-muted">{medication.rationale}</p>
              )}

              {isOptimised && medication.recommendedStart && medication.recommendedEnd && (
                <p className="text-sm font-medium text-accent">
                  Recommended window: {medication.recommendedStart} – {medication.recommendedEnd}
                  {medication.phaseAdjusted && (
                    <span className="ml-1 font-normal text-ink-muted">
                      (adjusted to your body clock)
                    </span>
                  )}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 text-xs"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>

          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`dose-${medication.code}`}>{doseLabel}</Label>
              <NumberInput
                id={`dose-${medication.code}`}
                min={0}
                step={medication.doseUnit === 'iu' ? 100 : 0.1}
                placeholder={medication.doseUnit === 'iu' ? 'e.g. 1000' : 'e.g. 10'}
                value={doseValue}
                onChange={(e) => onDoseChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`timing-${medication.code}`}>
                {isOptimised ? 'Current timing' : 'Reminder time'}
              </Label>
              <TimeInput
                id={`timing-${medication.code}`}
                value={currentTiming}
                onChange={(e) => onTimingChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
