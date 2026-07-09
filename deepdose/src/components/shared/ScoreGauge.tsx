interface ScoreComponents {
  phaseScore: number
  sjlScore: number
  vitaminDScore: number
  dataQualityScore: number
}

interface ScoreGaugeProps {
  score: number
  chronotypeLabel?: string
  components?: ScoreComponents
  /** CHI / BCA alignment, or SRI disease-risk continuum */
  variant?: 'chi' | 'bca' | 'sri'
}

const CX = 120
const CY = 110
const R = 88
const STROKE = 12

const COMPONENT_LABELS: { key: keyof ScoreComponents; label: string; max: number }[] = [
  { key: 'sjlScore', label: 'Social jet lag', max: 30 },
  { key: 'vitaminDScore', label: 'Vitamin D', max: 20 },
  { key: 'dataQualityScore', label: 'Data quality', max: 10 },
]

function formatComponentScore(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function scoreLabel(score: number, variant: 'chi' | 'bca' | 'sri'): string {
  if (variant === 'sri') {
    if (score >= 75) return 'Lower disease risk'
    if (score >= 50) return 'Rising disease risk'
    return 'Higher disease risk'
  }
  if (score >= 80) return 'Well aligned'
  if (score >= 60) return 'Moderately aligned'
  if (score >= 40) return 'Misaligned'
  return 'Significant drift'
}

function scoreTier(score: number, variant: 'chi' | 'bca' | 'sri'): 'excellent' | 'good' | 'fair' | 'poor' {
  if (variant === 'sri') {
    if (score >= 75) return 'excellent'
    if (score >= 50) return 'fair'
    return 'poor'
  }
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'fair'
  return 'poor'
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polar(cx, cy, r, startAngle)
  const end = polar(cx, cy, r, endAngle)
  const sweep = endAngle - startAngle
  const largeArc = Math.abs(sweep) > 180 ? 1 : 0
  const sweepFlag = sweep > 0 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${end.x} ${end.y}`
}

export default function ScoreGauge({ score, chronotypeLabel, components, variant = 'chi' }: ScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)))
  const tier = scoreTier(clamped, variant)
  const startAngle = -180
  const scoreAngle = startAngle + (clamped / 100) * 180
  const scoreName =
    variant === 'sri'
      ? 'Sleep Regularity Index'
      : variant === 'bca'
        ? 'Body clock alignment'
        : 'Circadian Health Index'
  const scoreAbbrev = variant === 'sri' ? 'SRI' : variant === 'bca' ? 'BCA' : 'CHI'
  const scaleLow = variant === 'sri' ? '0 · Higher risk' : '0 · Drift'
  const scaleHigh = variant === 'sri' ? 'Lower risk · 100' : 'Aligned · 100'

  return (
    <div className="score-gauge">
      <div className="score-gauge__stage">
        <svg
          viewBox="0 0 240 130"
          className="score-gauge__svg"
          role="img"
          aria-label={`${scoreName} ${clamped} out of 100, ${scoreLabel(clamped, variant)}${chronotypeLabel ? `, ${chronotypeLabel} chronotype` : ''}`}
        >
          <defs>
            <linearGradient
              id="score-gauge-spectrum"
              gradientUnits="userSpaceOnUse"
              x1={CX - R}
              y1={CY}
              x2={CX + R}
              y2={CY}
            >
              <stop offset="0%" className="score-gauge__stop score-gauge__stop--lilac" />
              <stop offset="48%" className="score-gauge__stop score-gauge__stop--mid" />
              <stop offset="100%" className="score-gauge__stop score-gauge__stop--cyan" />
            </linearGradient>
          </defs>
          <path
            d={describeArc(CX, CY, R, startAngle, 0)}
            fill="none"
            className="score-gauge__track"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {clamped > 0 && (
            <path
              d={describeArc(CX, CY, R, startAngle, scoreAngle)}
              fill="none"
              className="score-gauge__progress"
              stroke="url(#score-gauge-spectrum)"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          )}
        </svg>

        <div className="score-gauge__readout">
          <p className="score-gauge__score">
            {clamped}
            <span className="score-gauge__score-max">/ 100 {scoreAbbrev}</span>
          </p>
          <p className={`score-gauge__status score-gauge__status--${tier}`}>
            {scoreLabel(clamped, variant)}
          </p>
        </div>

        <div className="score-gauge__scale" aria-hidden>
          <span>{scaleLow}</span>
          <span>50</span>
          <span>{scaleHigh}</span>
        </div>
      </div>

      {chronotypeLabel && (
        <p className="score-gauge__chronotype">{chronotypeLabel} chronotype</p>
      )}

      {components && (
        <>
          <p className="score-gauge__breakdown-label">What&apos;s affecting your score</p>
          <ul className="score-gauge__breakdown">
          {COMPONENT_LABELS.map(({ key, label, max }) => {
            const pct = (components[key] / max) * 100
            return (
              <li key={key} className="score-gauge__breakdown-row">
                <div className="score-gauge__breakdown-head">
                  <span>{label}</span>
                  <span className="score-gauge__breakdown-val">
                    {formatComponentScore(components[key])}/{max}
                  </span>
                </div>
                <div className="score-gauge__breakdown-track">
                  <div className="score-gauge__breakdown-fill" style={{ width: `${pct}%` }} />
                </div>
              </li>
            )
          })}
          </ul>
        </>
      )}
    </div>
  )
}
