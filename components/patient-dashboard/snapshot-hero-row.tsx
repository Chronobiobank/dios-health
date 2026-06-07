import { formatAgeYears } from '@/components/patient-dashboard/snapshot-age-row'
import { AGE_LABELS } from '@/lib/product/dose-intelligence-model'
import {
  burdenTrendLabel,
  chronopenicBurdenLabel,
} from '@/lib/product/chronopenic-burden'
import type { BurdenTrendDirection } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type SnapshotHeroRowProps = {
  dlmoEstimate: string
  clockDrift: number
  chronopenicBurdenYears: number
  photonicAge: number
  calendarAge: number
  chronopenicBurdenScore: number
  burdenTrendDirection: BurdenTrendDirection | null
  lightAlignment: number
  darkCycleNote: string
  lightCycleNote: string
  photonicAgeNote: string
  calendarAgeNote: string
}

function CycleCell({
  label,
  value,
  unit,
  footnote,
  note,
}: {
  label: string
  value: string
  unit?: string
  footnote?: string
  note: string
}) {
  return (
    <div className="snapshot-cycle-cell">
      <p className="snapshot-hero-age-stack__value snapshot-hero-age-stack__value--cycle">
        {value}
        {unit ? <span className="snapshot-cycle-cell__unit">{unit}</span> : null}
      </p>
      <p className="snapshot-age-card-title">{label}</p>
      {footnote ? <p className="snapshot-age-card-note">{footnote}</p> : null}
      <p className="sr-only">{note}</p>
    </div>
  )
}

function AgeStack({
  value,
  title,
  sub,
  size,
  ariaLabel,
}: {
  value: number
  title: string
  sub: string
  size: 'primary' | 'secondary'
  ariaLabel: string
}) {
  return (
    <div className="snapshot-hero-age-stack">
      <p
        className={cn(
          'snapshot-hero-age-stack__value',
          size === 'primary' && 'snapshot-hero-age-stack__value--primary',
          size === 'secondary' && 'snapshot-hero-age-stack__value--secondary'
        )}
        aria-label={ariaLabel}
      >
        {value}
      </p>
      <p className="snapshot-age-card-title">{title}</p>
      <p className="snapshot-age-card-note">{sub}</p>
    </div>
  )
}

export function SnapshotHeroRow({
  dlmoEstimate,
  clockDrift,
  chronopenicBurdenYears,
  photonicAge,
  calendarAge,
  chronopenicBurdenScore,
  burdenTrendDirection,
  lightAlignment,
  darkCycleNote,
  lightCycleNote,
  photonicAgeNote,
  calendarAgeNote,
}: SnapshotHeroRowProps) {
  const photonicYears = formatAgeYears(photonicAge)
  const calendarYears = formatAgeYears(calendarAge)
  const burdenSub = `(${chronopenicBurdenLabel(chronopenicBurdenYears)})`
  const trendSub = burdenTrendLabel(burdenTrendDirection)

  return (
    <div className="snapshot-hero-row">
      <CycleCell
        label="Dark cycles"
        value={dlmoEstimate}
        footnote={`+${clockDrift}m drift · DLMO`}
        note={darkCycleNote}
      />

      <div className="snapshot-age-center">
        <AgeStack
          value={photonicYears}
          title={AGE_LABELS.chronopathic}
          sub={burdenSub}
          size="primary"
          ariaLabel={`${AGE_LABELS.chronopathic} ${photonicYears}, ${burdenSub}`}
        />
        <p className="snapshot-burden-score font-mono text-[10px] uppercase tracking-widest text-[var(--photic-muted)]">
          Chronopenic Burden {chronopenicBurdenScore}/100 · {trendSub}
        </p>
        <hr className="snapshot-age-center__rule" aria-hidden />
        <AgeStack
          value={calendarYears}
          title={AGE_LABELS.calendar}
          sub="(years on your birth certificate)"
          size="secondary"
          ariaLabel={`${AGE_LABELS.calendar} ${calendarYears}`}
        />
        <p className="sr-only">
          {photonicAgeNote} {calendarAgeNote}
        </p>
      </div>

      <CycleCell
        label="Light cycles"
        value={String(lightAlignment)}
        unit="/100"
        footnote="(mLux alignment)"
        note={lightCycleNote}
      />
    </div>
  )
}
