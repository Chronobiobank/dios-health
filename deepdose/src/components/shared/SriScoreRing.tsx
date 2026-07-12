/**
 * Apple Health–style score ring: continuous arc, large numeral.
 * Risk wording lives in the summary tile, not here.
 */

type SriScoreRingProps = {
  score: number
}

const SIZE = 220
const CX = 110
const CY = 110
const R = 86
const STROKE = 11
const CIRC = 2 * Math.PI * R

function statusTone(score: number): 'good' | 'mid' | 'low' {
  if (score >= 75) return 'good'
  if (score >= 50) return 'mid'
  return 'low'
}

export default function SriScoreRing({ score }: SriScoreRingProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)))
  const tone = statusTone(clamped)
  const offset = CIRC * (1 - clamped / 100)

  return (
    <div className="sri-score-ring" data-tone={tone}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="sri-score-ring__svg"
        role="img"
        aria-label={`Phenotype score ${clamped} out of 100`}
      >
        <circle
          cx={CX}
          cy={CY}
          r={R}
          className="sri-score-ring__track"
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          className="sri-score-ring__progress"
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      </svg>
      <div className="sri-score-ring__readout">
        <p className="sri-score-ring__value tabular-nums">{clamped}</p>
      </div>
    </div>
  )
}
