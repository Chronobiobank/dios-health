'use client'

import { useEffect, useState } from 'react'

import { polarToCartesian } from '@/lib/dashboard/time-utils'

type Adequacy = 'good' | 'low' | 'none'

export type MLuxDialProps = {
  mluxScore: number
  morningAdequacy: Adequacy
  eveningAdequacy: Adequacy
  nocturnalAdequacy: Adequacy
  chronotypeLabel: string
  confidenceScore?: number
  confidenceLabel?: string
}

const CX = 120
const CY = 120
const R = 88
const STROKE = 14
const MAX_SCORE = 500
const ARC_SWEEP = 270
const ARC_START = 135
const CIRC = 2 * Math.PI * R
const ARC_LEN = CIRC * (ARC_SWEEP / 360)

const ADEQUACY_STYLES: Record<Adequacy, string> = {
  good: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  low: 'border-amber-200 bg-amber-50 text-amber-700',
  none: 'border-red-200 bg-red-50 text-red-700',
}

const WINDOW_BADGES: Array<{
  key: 'morning' | 'evening' | 'nocturnal'
  label: string
  time: string
  adequacyKey: 'morningAdequacy' | 'eveningAdequacy' | 'nocturnalAdequacy'
}> = [
  { key: 'morning', label: 'Morning', time: '07:00–09:00', adequacyKey: 'morningAdequacy' },
  { key: 'evening', label: 'Evening', time: '19:00–sleep', adequacyKey: 'eveningAdequacy' },
  { key: 'nocturnal', label: 'Nocturnal', time: 'sleep–wake', adequacyKey: 'nocturnalAdequacy' },
]

function describeScoreArc(startScore: number, endScore: number): string {
  const startAngle = ARC_START + (startScore / MAX_SCORE) * ARC_SWEEP
  const endAngle = ARC_START + (endScore / MAX_SCORE) * ARC_SWEEP
  const start = polarToCartesian(CX, CY, R, startAngle)
  const end = polarToCartesian(CX, CY, R, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export function MLuxDial({
  mluxScore,
  morningAdequacy,
  eveningAdequacy,
  nocturnalAdequacy,
  chronotypeLabel,
}: MLuxDialProps) {
  // TODO: replace with real MLux reading from smartphone_circadian_observations
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDisplayScore(Math.min(MAX_SCORE, Math.max(0, mluxScore))))
    return () => cancelAnimationFrame(frame)
  }, [mluxScore])

  const adequacyByKey = {
    morningAdequacy,
    eveningAdequacy,
    nocturnalAdequacy,
  }

  const progress = displayScore / MAX_SCORE
  const progressOffset = ARC_LEN * (1 - progress)

  return (
    <section className="flex flex-col items-center">
      <svg
        viewBox="0 0 240 240"
        className="mx-auto w-full max-w-[240px]"
        role="img"
        aria-label={`Melanopic lux score ${Math.round(mluxScore)} m-EDI`}
      >
        <path
          d={describeScoreArc(0, MAX_SCORE)}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        <path
          d={describeScoreArc(0, 100)}
          fill="none"
          stroke="#ef4444"
          strokeWidth={STROKE}
          strokeLinecap="butt"
          opacity={0.35}
        />
        <path
          d={describeScoreArc(100, 250)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={STROKE}
          strokeLinecap="butt"
          opacity={0.35}
        />
        <path
          d={describeScoreArc(250, MAX_SCORE)}
          fill="none"
          stroke="#10b981"
          strokeWidth={STROKE}
          strokeLinecap="butt"
          opacity={0.35}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#0d0d0d"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${ARC_LEN} ${CIRC}`}
          strokeDashoffset={progressOffset}
          transform={`rotate(${ARC_START} ${CX} ${CY})`}
          style={{ transition: 'stroke-dashoffset 0.9s ease-out' }}
        />

        <text x={CX} y={CY - 6} textAnchor="middle" fontSize={48} fontWeight={700} fill="#0d0d0d">
          {Math.round(displayScore)}
        </text>
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          fontSize={11}
          fill="rgba(0,0,0,0.4)"
          style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', letterSpacing: '0.08em' }}
        >
          m-EDI lux
        </text>
        <text
          x={CX}
          y={CY + 36}
          textAnchor="middle"
          fontSize={13}
          fontWeight={500}
          fill="rgba(0,0,0,0.6)"
          style={{ textTransform: 'capitalize' }}
        >
          {chronotypeLabel}
        </text>
      </svg>

      <div className="mt-4 flex w-full max-w-md flex-wrap items-stretch justify-center gap-2">
        {WINDOW_BADGES.map((badge) => {
          const adequacy = adequacyByKey[badge.adequacyKey]
          return (
            <div
              key={badge.key}
              className={`rounded-full border px-3 py-1 text-center font-mono text-[11px] ${ADEQUACY_STYLES[adequacy]}`}
            >
              <span className="font-semibold">{badge.label}</span>
              <span className="mt-0.5 block opacity-70">{badge.time}</span>
            </div>
          )
        })}
      </div>

      <p
        className="mt-4 text-center font-mono text-[11px]"
        style={{ color: 'rgba(0,0,0,0.35)' }}
      >
        Target: 250 m-EDI lux by 09:00 · CIE S026
      </p>
    </section>
  )
}
