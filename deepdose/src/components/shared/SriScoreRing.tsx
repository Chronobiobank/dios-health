/**
 * Apple Health–style score ring: continuous arc, large numeral.
 * Spectrum gradient on the progress arc — risk copy lives elsewhere.
 */

type SriScoreRingProps = {
  score: number
}

const SIZE = 220
const CX = 110
const CY = 110
const R = 86
const STROKE = 12
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
  const gradId = `sri-grad-${tone}`
  const glowId = `sri-glow-${tone}`

  return (
    <div className="sri-score-ring" data-tone={tone}>
      <div className="sri-score-ring__dial">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="sri-score-ring__svg"
          role="img"
          aria-label={`Sleep Regularity Index ${clamped} out of 100`}
        >
          <defs>
            <linearGradient id="sri-grad-good" x1="18%" y1="8%" x2="88%" y2="92%">
              <stop offset="0%" stopColor="#6ec4b4" />
              <stop offset="38%" stopColor="#8ec9d8" />
              <stop offset="72%" stopColor="#9aa8f0" />
              <stop offset="100%" stopColor="#b8a6f2" />
            </linearGradient>
            <linearGradient id="sri-grad-mid" x1="12%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#f0c14a" />
              <stop offset="48%" stopColor="#e8a86a" />
              <stop offset="100%" stopColor="#d98b8b" />
            </linearGradient>
            <linearGradient id="sri-grad-low" x1="14%" y1="12%" x2="86%" y2="88%">
              <stop offset="0%" stopColor="#f0786e" />
              <stop offset="55%" stopColor="#e06a8c" />
              <stop offset="100%" stopColor="#c97ab8" />
            </linearGradient>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

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
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            filter={`url(#${glowId})`}
            transform={`rotate(-90 ${CX} ${CY})`}
          />
        </svg>
        <div className="sri-score-ring__readout">
          <p className="sri-score-ring__value tabular-nums">{clamped}</p>
          <p className="sri-score-ring__label">
            Sleep Regularity
            <br />
            Index
          </p>
        </div>
      </div>
    </div>
  )
}
