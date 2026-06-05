'use client'

const STAGE_COLORS = {
  wake: '#4b5563',
  rem: '#818cf8',
  light: '#4338ca',
  deep: '#312e81',
} as const

/** Synthetic epoch hypnogram for REM efficiency visualization. */
export function SleepHypnogram() {
  const epochs = 48
  const stages: Array<keyof typeof STAGE_COLORS> = []
  for (let i = 0; i < epochs; i++) {
    if (i < 6) stages.push('wake')
    else if (i % 11 < 3) stages.push('rem')
    else if (i % 7 < 2) stages.push('deep')
    else stages.push('light')
  }

  const barW = 100 / epochs
  const height = 56

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      className="retinomic-hypnogram"
      preserveAspectRatio="none"
      role="img"
      aria-label="Sleep stage hypnogram"
    >
      {stages.map((stage, i) => {
        const y =
          stage === 'wake' ? 4 : stage === 'rem' ? 18 : stage === 'light' ? 32 : 46
        const h =
          stage === 'wake' ? 10 : stage === 'rem' ? 22 : stage === 'light' ? 18 : 12
        return (
          <rect
            key={i}
            x={i * barW}
            y={y}
            width={barW - 0.15}
            height={h}
            fill={STAGE_COLORS[stage]}
            rx={0.3}
          />
        )
      })}
    </svg>
  )
}
