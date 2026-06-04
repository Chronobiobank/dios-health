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

/** Two-line mono label — same structure on both sides so line counts always match. */
function AgeYearsLabel({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <p className="snapshot-age-label">
      <span>{line1}</span>
      <span>{line2}</span>
    </p>
  )
}

type SnapshotAgeRowProps = {
  chronologicalAge: number
  circadianAge: number
  yearsLost: number
}

export function SnapshotAgeRow({ chronologicalAge, circadianAge, yearsLost }: SnapshotAgeRowProps) {
  return (
    <div className="snapshot-age-row">
      <div className="snapshot-age-value-cell snapshot-age-value-cell--chrono">
        <p className="snapshot-metric-value">{Math.round(chronologicalAge)}</p>
        <AgeYearsLabel line1="Calendar" line2="years" />
      </div>
      <div className="snapshot-age-value-cell snapshot-age-value-cell--center">
        <div className="snapshot-center-arrow" aria-hidden>
          <ArrowGlyph />
        </div>
        <p className="snapshot-loss-value">{yearsLost}</p>
        <AgeYearsLabel line1="years lost" line2="to jetlag" />
      </div>
      <div className="snapshot-age-value-cell snapshot-age-value-cell--circadian">
        <p className="snapshot-metric-value">{Math.round(circadianAge)}</p>
        <AgeYearsLabel line1="Circadian" line2="years" />
      </div>
    </div>
  )
}
