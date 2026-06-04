import { cn } from '@/lib/utils'

/** Whole years only — avoids decimals in the age tiles. */
export function formatAgeYears(value: number): number {
  return Math.round(value)
}

/** Title + descriptor — shared by stat pills below the age row. */
export function SnapshotMetricLabel({ title, description }: { title: string; description: string }) {
  return (
    <p className="snapshot-age-label">
      <span className="snapshot-age-label-title">{title}</span>
      <span className="snapshot-age-label-desc">{description}</span>
    </p>
  )
}

type AgeValueCellProps = {
  years: number
  title: string
  note: string
  variant: 'chrono' | 'circadian'
}

function AgeValueCell({ years, title, note, variant }: AgeValueCellProps) {
  const displayYears = formatAgeYears(years)

  return (
    <div
      className={cn(
        'snapshot-age-value-cell',
        variant === 'chrono' && 'snapshot-age-value-cell--chrono',
        variant === 'circadian' && 'snapshot-age-value-cell--circadian'
      )}
    >
      <div className="snapshot-age-years-block">
        <p className="snapshot-age-years-old-number" aria-label={`${displayYears} years`}>
          {displayYears}
        </p>
        <p className="snapshot-age-card-title">{title}</p>
        <p className="snapshot-age-card-note">{note}</p>
      </div>
    </div>
  )
}

type SnapshotAgeRowProps = {
  chronologicalAge: number
  chronosomaticAge: number
  darkYears: number
}

export function SnapshotAgeRow({
  chronologicalAge,
  chronosomaticAge,
  darkYears,
}: SnapshotAgeRowProps) {
  const displayDarkYears = formatAgeYears(darkYears)

  return (
    <div className="snapshot-age-row">
      <AgeValueCell
        years={chronologicalAge}
        title="Chronological"
        note="(Age on your birth certificate)"
        variant="chrono"
      />

      <div className="snapshot-age-value-cell snapshot-age-value-cell--center">
        <div className="snapshot-age-years-block">
          <p className="snapshot-dark-years-value" aria-label={`${displayDarkYears} dark years`}>
            {displayDarkYears}
          </p>
          <p className="snapshot-dark-years-label">Dark years</p>
          <p className="snapshot-age-card-note snapshot-age-card-note--center">
            (time out of sync with your body clock)
          </p>
        </div>
      </div>

      <AgeValueCell
        years={chronosomaticAge}
        title="Chronosomatic"
        note="(Age on your cellular clocks)"
        variant="circadian"
      />
    </div>
  )
}
