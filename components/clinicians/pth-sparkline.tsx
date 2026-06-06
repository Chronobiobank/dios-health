import type { TriageLabPoint } from '@/lib/clinicians/triage-types'

type PthSparklineProps = {
  history: TriageLabPoint[]
  className?: string
}

export function PthSparkline({ history, className }: PthSparklineProps) {
  if (history.length < 2) return null

  const values = history.map((p) => p.pthPgMl)
  const min = Math.min(...values) - 2
  const max = Math.max(...values) + 2
  const range = max - min || 1
  const width = 80
  const height = 32
  const padding = 2

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (width - padding * 2)
      const y = height - padding - ((v - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  const last = values[values.length - 1]
  const trend = last < values[values.length - 2] ? '#1D9E75' : last > values[values.length - 2] ? '#A32D2D' : '#6b7280'

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      role="presentation"
    >
      <polyline
        fill="none"
        stroke={trend}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}
