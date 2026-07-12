/**
 * Last-month SRI line chart — smooth curve + soft fill.
 * Deterministic proxy series until wearables sync real nights.
 */

type SriMonthLineChartProps = {
  score: number
  days?: number
}

const VB_W = 480
const VB_H = 148
const PAD_X = 12
const PAD_TOP = 16
const PAD_BOTTOM = 18

/** Deterministic ~30-day series ending on the current SRI. */
function buildMonthSeries(score: number, days: number): number[] {
  const end = Math.min(100, Math.max(0, Math.round(score)))
  const start = Math.min(92, Math.max(end + 8, 70))
  const out: number[] = []
  for (let i = 0; i < days; i++) {
    const t = days === 1 ? 1 : i / (days - 1)
    const trend = start + (end - start) * t
    const wobble =
      Math.sin(i * 0.85) * 3.2 +
      Math.cos(i * 0.37) * 2.1 -
      Math.sin(i * 1.7) * 1.4
    const midDip = t > 0.55 && t < 0.82 ? -2.5 : 0
    const value =
      i === days - 1
        ? end
        : Math.min(96, Math.max(28, Math.round(trend + wobble + midDip)))
    out.push(value)
  }
  return out
}

/** Catmull–Rom → cubic Bézier for a smooth Health-style curve. */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

export default function SriMonthLineChart({
  score,
  days = 30,
}: SriMonthLineChartProps) {
  const series = buildMonthSeries(score, days)
  const min = Math.min(...series) - 8
  const max = Math.max(...series) + 8
  const range = Math.max(1, max - min)
  const chartBottom = VB_H - PAD_BOTTOM
  const chartHeight = chartBottom - PAD_TOP

  const points = series.map((v, i) => {
    const x = PAD_X + (i / (series.length - 1)) * (VB_W - PAD_X * 2)
    const y = PAD_TOP + (1 - (v - min) / range) * chartHeight
    return { x, y, v }
  })

  const linePath = smoothPath(points)
  const last = points[points.length - 1]
  const areaPath = `${linePath} L ${last.x.toFixed(2)} ${chartBottom} L ${points[0].x.toFixed(2)} ${chartBottom} Z`
  const uid = 'sri-month'
  const gridYs = [0.2, 0.5, 0.8].map((t) => PAD_TOP + t * chartHeight)
  const monthLabels = ['30d', '15d', 'Today'] as const

  return (
    <div className="sri-month">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="sri-month__svg"
        role="img"
        aria-label={`Sleep Regularity Index over the last ${days} days, currently ${Math.round(score)}`}
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(15 23 42)" stopOpacity="0.16" />
            <stop offset="70%" stopColor="rgb(15 23 42)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="rgb(15 23 42)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-stroke`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(15 23 42)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(15 23 42)" stopOpacity="0.92" />
          </linearGradient>
        </defs>

        {gridYs.map((y) => (
          <line
            key={y}
            x1={PAD_X}
            y1={y}
            x2={VB_W - PAD_X}
            y2={y}
            className="sri-month__grid"
          />
        ))}

        <path d={areaPath} fill={`url(#${uid}-fill)`} className="sri-month__area" />
        <path
          d={linePath}
          className="sri-month__line"
          fill="none"
          stroke={`url(#${uid}-stroke)`}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx={last.x} cy={last.y} r="4.25" className="sri-month__now" />
      </svg>

      <div className="sri-month__axis" aria-hidden>
        {monthLabels.map((label) => (
          <span key={label} className="sri-month__tick">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
