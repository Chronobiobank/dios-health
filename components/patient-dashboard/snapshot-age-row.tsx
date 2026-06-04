function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 16" className="h-3 w-5 text-[var(--dash-metric-loss)]" aria-hidden>
      <path
        d="M2 8h16M14 3l7 5-7 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Title + descriptor — shared by age columns and stat pills. */
export function SnapshotMetricLabel({ title, description }: { title: string; description: string }) {
  return (
    <p className="snapshot-age-label">
      <span className="snapshot-age-label-title">{title}</span>
      <span className="snapshot-age-label-desc">{description}</span>
    </p>
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
  return (
    <div className="snapshot-age-row">
      <div className="snapshot-age-value-cell snapshot-age-value-cell--chrono">
        <p className="snapshot-metric-value">{Math.round(chronologicalAge)}</p>
        <SnapshotMetricLabel
          title="Chronological age"
          description="(the age on your birth certificate)"
        />
      </div>
      <div className="snapshot-age-value-cell snapshot-age-value-cell--center">
        <div className="snapshot-center-arrow" aria-hidden>
          <ArrowGlyph />
        </div>
        <p className="snapshot-loss-value">{darkYears}</p>
        <SnapshotMetricLabel
          title="Dark years"
          description="(time living out of sync with your body clock)"
        />
      </div>
      <div className="snapshot-age-value-cell snapshot-age-value-cell--circadian">
        <p className="snapshot-metric-value">{Math.round(chronosomaticAge)}</p>
        <SnapshotMetricLabel
          title="Chronosomatic age"
          description="(the age your body is actually living)"
        />
      </div>
    </div>
  )
}
