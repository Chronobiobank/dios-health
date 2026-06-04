import { formatAgeYears } from '@/components/patient-dashboard/snapshot-age-row'
import { cn } from '@/lib/utils'

function hibernationLossLabel(years: number): string {
  const n = formatAgeYears(years)
  const unit = n === 1 ? 'year' : 'years'
  return `(${n} ${unit} lost to hibernation)`
}

type SnapshotHeroRowProps = {
  dlmoEstimate: string
  clockDrift: number
  darkYears: number
  chronosomaticAge: number
  chronologicalAge: number
  lightAlignment: number
  darkCycleNote: string
  lightCycleNote: string
  chronopathicNote: string
  chronologicalNote: string
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
  darkYears,
  chronosomaticAge,
  chronologicalAge,
  lightAlignment,
  darkCycleNote,
  lightCycleNote,
  chronopathicNote,
  chronologicalNote,
}: SnapshotHeroRowProps) {
  const chronopathicYears = formatAgeYears(chronosomaticAge)
  const clockYears = formatAgeYears(chronologicalAge)
  const hibernationLoss = hibernationLossLabel(darkYears)

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
          value={chronopathicYears}
          title="Chronopathic age"
          sub={hibernationLoss}
          size="primary"
          ariaLabel={`Chronopathic age ${chronopathicYears}, ${hibernationLoss}`}
        />
        <hr className="snapshot-age-center__rule" aria-hidden />
        <AgeStack
          value={clockYears}
          title="Chronological age"
          sub="(clock years on your birth certificate)"
          size="secondary"
          ariaLabel={`${clockYears} clock years`}
        />
        <p className="sr-only">
          {chronopathicNote} {chronologicalNote}
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
