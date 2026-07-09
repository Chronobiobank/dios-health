/**
 * Sleep regularity history — Apple Health–style sparkline.
 * Smooth curve + soft fill. Proxy series until wearables sync.
 */

type SriHistorySparkProps = {
  score: number
  sleepLabel?: string
  wakeLabel?: string
}

const VB_W = 360
const VB_H = 128
const PAD_X = 20
const PAD_TOP = 22
const PAD_BOTTOM = 28

/** Deterministic 7-point series around the current SRI proxy. */
function buildSeries(score: number): number[] {
  const base = Math.min(100, Math.max(0, score))
  const wobble = [6, -4, 2, -8, 5, -1, 0]
  return wobble.map((w, i) => {
    const t = i / 6
    const drift = (base - 55) * 0.12 * (t - 0.5)
    return Math.min(100, Math.max(22, Math.round(base + w + drift)))
  })
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

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const

export default function SriHistorySpark({ score }: SriHistorySparkProps) {
  const series = buildSeries(score)
  const min = Math.min(...series) - 10
  const max = Math.max(...series) + 10
  const range = Math.max(1, max - min)
  const chartBottom = VB_H - PAD_BOTTOM
  const chartHeight = chartBottom - PAD_TOP

  const points = series.map((v, i) => {
    const x = PAD_X + (i / (series.length - 1)) * (VB_W - PAD_X * 2)
    const y = PAD_TOP + (1 - (v - min) / range) * chartHeight
    return { x, y, v }
  })

  const linePath = smoothPath(points)
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${chartBottom} L ${points[0].x.toFixed(2)} ${chartBottom} Z`
  const last = points[points.length - 1]
  const uid = 'sri-hist'
  const gridYs = [0.15, 0.5, 0.85].map((t) => PAD_TOP + t * chartHeight)

  return (
    <div className="sri-history">
      <div className="sri-history__meta">
        <div className="sri-history__now-block">
          <span className="sri-history__now-label">Today</span>
          <span className="sri-history__now-value tabular-nums">{Math.round(score)}</span>
        </div>
        <p className="sri-history__caption">Past 7 days</p>
      </div>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="sri-history__svg"
        role="img"
        aria-label={`Sleep regularity over the past week, currently ${Math.round(score)}`}
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(52 199 89)" stopOpacity="0.28" />
            <stop offset="55%" stopColor="rgb(52 199 89)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="rgb(52 199 89)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-stroke`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(120 220 170)" stopOpacity="0.55" />
            <stop offset="70%" stopColor="rgb(52 199 89)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="rgb(52 199 89)" stopOpacity="1" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridYs.map((y) => (
          <line
            key={y}
            x1={PAD_X}
            y1={y}
            x2={VB_W - PAD_X}
            y2={y}
            className="sri-history__grid"
          />
        ))}

        <path d={areaPath} fill={`url(#${uid}-fill)`} className="sri-history__area" />
        <path
          d={linePath}
          className="sri-history__line"
          fill="none"
          stroke={`url(#${uid}-stroke)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.slice(0, -1).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.25" className="sri-history__point" />
        ))}

        <g filter={`url(#${uid}-glow)`}>
          <circle cx={last.x} cy={last.y} r="7" className="sri-history__now-ring" />
          <circle cx={last.x} cy={last.y} r="3.75" className="sri-history__now-core" />
        </g>
      </svg>

      <div className="sri-history__days" aria-hidden>
        {DAY_LABELS.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className={
              i === DAY_LABELS.length - 1
                ? 'sri-history__day sri-history__day--today'
                : 'sri-history__day'
            }
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}
