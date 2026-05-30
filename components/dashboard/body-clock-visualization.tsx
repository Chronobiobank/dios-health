'use client'

import { useEffect, useState } from 'react'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { BodyClockModel } from '@/lib/dashboard/body-clock'
import { describeArc, minutesToAngle, polarToCartesian } from '@/lib/dashboard/time-utils'

type BodyClockVisualizationProps = {
  model: BodyClockModel
  nightsCount?: number
  confidenceScore?: number
  confidenceLabel?: string
}

const SIZE = 280
const CX = SIZE / 2
const CY = SIZE / 2
const R = 118
const LABEL_R = 92

export function BodyClockVisualization({
  model,
  nightsCount,
  confidenceScore,
  confidenceLabel,
}: BodyClockVisualizationProps) {
  const [nowMinutes, setNowMinutes] = useState(getNowMinutes())

  useEffect(() => {
    const interval = window.setInterval(() => setNowMinutes(getNowMinutes()), 30_000)
    return () => window.clearInterval(interval)
  }, [])

  const nowAngle = minutesToAngle(nowMinutes)
  const nowPoint = polarToCartesian(CX, CY, R, nowAngle)
  const sleepArc = describeArc(CX, CY, R, model.sleepStartMinutes, model.sleepEndMinutes)
  const lightArc = describeArc(CX, CY, R, model.lightStartMinutes, model.lightEndMinutes)
  const dlmoPoint = polarToCartesian(CX, CY, R, minutesToAngle(model.dlmoMinutes))

  return (
    <section className="mt-8">
      <h2 className={SECTION_LABEL}>Your body clock</h2>

      <div className="mt-4 flex justify-center">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-label="24-hour body clock">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />

          <path d={sleepArc} fill="none" stroke="#ccfbf1" strokeWidth="14" strokeLinecap="round" />
          <path d={lightArc} fill="none" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" opacity="0.85" />

          {model.doseWindows.map((window) => {
            const angle = minutesToAngle(window.minutes)
            const point = polarToCartesian(CX, CY, R, angle)
            const labelPoint = polarToCartesian(CX, CY, LABEL_R, angle)
            const pillWidth = window.label.length * 6 + 12
            return (
              <g key={window.label}>
                <circle cx={point.x} cy={point.y} r="4" fill="#0d9488" />
                <rect
                  x={labelPoint.x - pillWidth / 2}
                  y={labelPoint.y - 8}
                  width={pillWidth}
                  height={16}
                  rx={8}
                  fill="#f0fdfa"
                  stroke="#99f6e4"
                  strokeWidth="0.5"
                />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-teal-800 text-[9px] font-medium"
                >
                  {window.label}
                </text>
              </g>
            )
          })}

          <circle cx={dlmoPoint.x} cy={dlmoPoint.y} r="5" fill="#0d9488" stroke="white" strokeWidth="2" />

          <circle cx={nowPoint.x} cy={nowPoint.y} r="6" fill="#0f172a" stroke="white" strokeWidth="2" />

          <text x={CX} y={CY - 8} textAnchor="middle" className="fill-black text-sm font-medium capitalize">
            {model.chronotypeLabel}
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle" className="fill-black/50 font-mono text-[11px]">
            {model.msfscLabel}
          </text>
          {confidenceScore !== undefined ? (
            <text x={CX} y={CY + 28} textAnchor="middle" className="fill-teal-700 font-mono text-[10px]">
              {confidenceLabel} · {confidenceScore}%
              {nightsCount !== undefined ? ` · ${nightsCount} nights` : ''}
            </text>
          ) : null}
        </svg>
      </div>
    </section>
  )
}

function getNowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}
