/** Title + descriptor — shared by stat pills below the age row. */
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
    <div className="grid grid-cols-3 items-stretch gap-2.5">
      <div
        className="rounded-[14px] px-2 py-4 text-center"
        style={{
          background: 'rgba(255,255,255,0.38)',
          border: '0.5px solid rgba(255,255,255,0.72)',
        }}
      >
        <p className="snapshot-age-card-eyebrow text-[var(--text-muted)]">Chronological Age</p>
        <p className="snapshot-age-card-value text-[var(--text-primary)]">{chronologicalAge}</p>
        <p className="snapshot-age-card-note text-[var(--text-muted)]">
          (the age on your birth certificate)
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 bg-transparent px-1">
        <svg width="22" height="14" viewBox="0 0 22 14" style={{ opacity: 0.55 }} aria-hidden>
          <line x1="2" y1="7" x2="17" y2="7" stroke="#A32D2D" strokeWidth="1.8" />
          <polyline
            points="12,2 20,7 12,12"
            fill="none"
            stroke="#A32D2D"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <p
          className="snapshot-age-card-eyebrow"
          style={{ color: '#A32D2D' }}
        >
          Dark Years
        </p>
        <p className="snapshot-age-card-value" style={{ color: '#A32D2D' }}>
          {darkYears}
        </p>
        <p className="snapshot-age-card-note text-center" style={{ color: '#791F1F' }}>
          (time out of sync with your body clock)
        </p>
      </div>

      <div
        className="rounded-[14px] px-2 py-4 text-center"
        style={{
          background: 'rgba(250,175,70,0.16)',
          border: '0.5px solid rgba(250,175,70,0.35)',
        }}
      >
        <p className="snapshot-age-card-eyebrow" style={{ color: '#7a4a08' }}>
          Chronosomatic Age
        </p>
        <p className="snapshot-age-card-value" style={{ color: '#7a3810' }}>
          {chronosomaticAge}
        </p>
        <p className="snapshot-age-card-note" style={{ color: '#8a5a28' }}>
          (the age your body is actually living)
        </p>
      </div>
    </div>
  )
}
