/**
 * Simple SRI → disease-risk scale.
 * One idea: lower SRI → higher disease risk; your score places you on that line.
 * Population evidence direction only — not a personal diagnosis.
 */

const VB_W = 400
const VB_H = 108
const AXIS_Y = 52
const AXIS_X0 = 28
const AXIS_X1 = 372
const TRACK_H = 10

type DiseaseRiskContinuumProps = {
  /** Sleep Regularity Index 0–100 (higher = lower disease risk) */
  score: number
  className?: string
  /** Hide SRI readout when the score lives in its own tile */
  showScore?: boolean
}

function statusForScore(score: number): string {
  if (score >= 75) return 'Toward lower disease risk'
  if (score >= 50) return 'Toward rising disease risk'
  return 'Toward higher disease risk'
}

function xForSri(score: number): number {
  // High SRI sits on the right (lower risk); low SRI on the left (higher risk)
  return AXIS_X0 + (score / 100) * (AXIS_X1 - AXIS_X0)
}

export default function DiseaseRiskContinuum({
  score,
  className,
  showScore = true,
}: DiseaseRiskContinuumProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)))
  const markerX = xForSri(clamped)
  const status = statusForScore(clamped)
  const uid = 'drc'

  return (
    <div className={className ? `disease-risk-continuum ${className}` : 'disease-risk-continuum'}>
      {showScore ? (
        <div className="disease-risk-continuum__head">
          <p className="disease-risk-continuum__score">
            <span className="disease-risk-continuum__value font-mono tabular-nums">{clamped}</span>
            <span className="disease-risk-continuum__max">SRI</span>
          </p>
          <p className="disease-risk-continuum__status">{status}</p>
        </div>
      ) : (
        <p className="disease-risk-continuum__status disease-risk-continuum__status--solo">{status}</p>
      )}

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="disease-risk-continuum__svg"
        role="img"
        aria-label={`Sleep Regularity Index ${clamped} out of 100. ${status}. Lower SRI sits toward higher disease risk; higher SRI toward lower risk.`}
      >
        <defs>
          <linearGradient id={`${uid}-track`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(255 120 110)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="rgb(240 200 120)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(120 220 170)" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <text
          x={AXIS_X0}
          y={22}
          textAnchor="start"
          className="disease-risk-continuum__pole disease-risk-continuum__pole--high"
        >
          Higher risk
        </text>
        <text
          x={AXIS_X1}
          y={22}
          textAnchor="end"
          className="disease-risk-continuum__pole disease-risk-continuum__pole--low"
        >
          Lower risk
        </text>

        <rect
          x={AXIS_X0}
          y={AXIS_Y - TRACK_H / 2}
          width={AXIS_X1 - AXIS_X0}
          height={TRACK_H}
          rx={TRACK_H / 2}
          fill={`url(#${uid}-track)`}
        />

        <g className="disease-risk-continuum__you">
          <line
            x1={markerX}
            y1={AXIS_Y - 22}
            x2={markerX}
            y2={AXIS_Y - TRACK_H / 2 - 2}
            stroke="rgb(255 255 255 / 0.7)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle
            cx={markerX}
            cy={AXIS_Y}
            r="8"
            fill="#fff"
            stroke="rgb(12 16 28)"
            strokeWidth="2.25"
          />
          <text
            x={markerX}
            y={AXIS_Y - 28}
            textAnchor="middle"
            className="disease-risk-continuum__you-label"
          >
            You
          </text>
        </g>

        <text x={AXIS_X0} y={96} textAnchor="start" className="disease-risk-continuum__scale">
          Lower SRI
        </text>
        <text x={AXIS_X1} y={96} textAnchor="end" className="disease-risk-continuum__scale">
          Higher SRI
        </text>
      </svg>
    </div>
  )
}
