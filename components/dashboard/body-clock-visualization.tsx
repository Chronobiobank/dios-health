'use client'

import { useEffect, useState } from 'react'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { BodyClockModel, DoseWindow } from '@/lib/dashboard/body-clock'
import { describeArc, minutesToAngle, polarToCartesian } from '@/lib/dashboard/time-utils'

type BodyClockVisualizationProps = {
  model: BodyClockModel
  nightsCount?: number
  confidenceScore?: number
  confidenceLabel?: string
}

/** Square viewBox — padding fits full medication names outside the ring without clipping. */
const VIEW = 560
const CX = VIEW / 2
const CY = VIEW / 2
const R = 100
const LABEL_BASE_R = R + 32
const LABEL_RADIUS_STEP = 22
const MIN_LABEL_ANGLE_SEP = 28

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
  const labelRadii = computeLabelRadii(model.doseWindows, LABEL_BASE_R)

  return (
    <section className="mt-8">
      <h2 className={SECTION_LABEL}>Your body clock</h2>

      <div className="mt-4 flex w-full justify-center">
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="h-auto w-full max-w-[340px]"
          role="img"
          aria-label="24-hour body clock with medication timing windows"
        >
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />

          <path d={sleepArc} fill="none" stroke="#ccfbf1" strokeWidth="12" strokeLinecap="round" />
          <path d={lightArc} fill="none" stroke="#fde68a" strokeWidth="9" strokeLinecap="round" opacity="0.85" />

          {model.doseWindows.map((window, index) => {
            const angle = minutesToAngle(window.minutes)
            const ringPoint = polarToCartesian(CX, CY, R, angle)
            const labelRadius = labelRadii[index] ?? LABEL_BASE_R
            const labelPoint = polarToCartesian(CX, CY, labelRadius, angle)
            const leaderEnd = polarToCartesian(CX, CY, labelRadius - 8, angle)
            const textAnchor = getLabelTextAnchor(angle)
            const dominantBaseline = getLabelBaseline(angle)

            return (
              <g key={`${window.label}-${window.minutes}`}>
                <line
                  x1={ringPoint.x}
                  y1={ringPoint.y}
                  x2={leaderEnd.x}
                  y2={leaderEnd.y}
                  stroke="#99f6e4"
                  strokeWidth="1"
                />
                <circle cx={ringPoint.x} cy={ringPoint.y} r="3.5" fill="#0d9488" />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor={textAnchor}
                  dominantBaseline={dominantBaseline}
                  fontSize={22}
                  className="fill-teal-900 font-medium"
                  stroke="white"
                  strokeWidth={4}
                  paintOrder="stroke"
                >
                  {window.label}
                </text>
              </g>
            )
          })}

          <circle cx={dlmoPoint.x} cy={dlmoPoint.y} r="5" fill="#0d9488" stroke="white" strokeWidth="2" />
          <circle cx={nowPoint.x} cy={nowPoint.y} r="6" fill="#0f172a" stroke="white" strokeWidth="2" />

          <text
            x={CX}
            y={CY - 10}
            textAnchor="middle"
            fontSize={26}
            className="fill-black font-medium capitalize"
          >
            {model.chronotypeLabel}
          </text>
          <text
            x={CX}
            y={CY + 18}
            textAnchor="middle"
            fontSize={20}
            className="fill-black/50 font-mono"
          >
            {model.msfscLabel}
          </text>
          {confidenceScore !== undefined ? (
            <text
              x={CX}
              y={CY + 42}
              textAnchor="middle"
              fontSize={18}
              className="fill-teal-700 font-mono"
            >
              {confidenceLabel} · {confidenceScore}%
              {nightsCount !== undefined ? ` · ${nightsCount} nights` : ''}
            </text>
          ) : null}
        </svg>
      </div>
    </section>
  )
}

function computeLabelRadii(windows: DoseWindow[], baseRadius: number): number[] {
  if (windows.length === 0) return []

  const sorted = windows
    .map((window, index) => ({ index, angle: minutesToAngle(window.minutes) }))
    .sort((a, b) => a.angle - b.angle)

  const radii = new Array<number>(windows.length).fill(baseRadius)
  const passes = Math.max(2, sorted.length)

  for (let pass = 0; pass < passes; pass++) {
    for (let i = 1; i < sorted.length; i++) {
      pushApart(sorted[i - 1], sorted[i], radii, false)
    }
    if (sorted.length > 1) {
      pushApart(sorted[sorted.length - 1], sorted[0], radii, true)
    }
  }

  return radii
}

function pushApart(
  earlier: { index: number; angle: number },
  later: { index: number; angle: number },
  radii: number[],
  wrap: boolean
) {
  let diff = later.angle - earlier.angle
  if (wrap) diff += 360
  if (diff <= 0 || diff >= MIN_LABEL_ANGLE_SEP) return

  radii[later.index] = Math.max(radii[later.index], radii[earlier.index] + LABEL_RADIUS_STEP)
}

function getLabelTextAnchor(angleDeg: number): 'start' | 'middle' | 'end' {
  const rad = (angleDeg * Math.PI) / 180
  if (Math.cos(rad) > 0.35) return 'start'
  if (Math.cos(rad) < -0.35) return 'end'
  return 'middle'
}

function getLabelBaseline(angleDeg: number): 'middle' | 'hanging' | 'auto' {
  const rad = (angleDeg * Math.PI) / 180
  if (Math.sin(rad) > 0.35) return 'hanging'
  if (Math.sin(rad) < -0.35) return 'auto'
  return 'middle'
}

function getNowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}
