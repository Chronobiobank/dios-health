'use client'

import { useEffect, useMemo, useState } from 'react'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { BodyClockModel, DoseWindow } from '@/lib/dashboard/body-clock'
import { describeArc, minutesToAngle, polarToCartesian } from '@/lib/dashboard/time-utils'

type BodyClockVisualizationProps = {
  model: BodyClockModel
  nightsCount?: number
  confidenceScore?: number
  confidenceLabel?: string
}

const CX = 280
const CY = 268
const R = 96
const LABEL_BASE_R = R + 28
const LABEL_RADIUS_STEP = 20
const MIN_LABEL_ANGLE_SEP = 26
const LABEL_FONT_SIZE = 20
const LABEL_CHAR_WIDTH = 10.5
const LABEL_LINE_HEIGHT = 22
const VIEW_PAD = 10

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

  const labelRadii = useMemo(
    () => computeLabelRadii(model.doseWindows, LABEL_BASE_R),
    [model.doseWindows]
  )

  const viewBox = useMemo(
    () =>
      computeContentViewBox(model, labelRadii, {
        showConfidence: confidenceScore !== undefined,
        nowMinutes,
      }),
    [confidenceScore, labelRadii, model, nowMinutes]
  )

  const nowAngle = minutesToAngle(nowMinutes)
  const nowPoint = polarToCartesian(CX, CY, R, nowAngle)
  const sleepArc = describeArc(CX, CY, R, model.sleepStartMinutes, model.sleepEndMinutes)
  const lightArc = describeArc(CX, CY, R, model.lightStartMinutes, model.lightEndMinutes)
  const dlmoPoint = polarToCartesian(CX, CY, R, minutesToAngle(model.dlmoMinutes))

  return (
    <section className="mt-5">
      <h2 className={SECTION_LABEL}>Your body clock</h2>

      <div className="mt-1.5 flex w-full justify-center">
        <svg
          viewBox={viewBox}
          className="h-auto w-full max-w-[340px] overflow-visible"
          role="img"
          aria-label="24-hour body clock with medication timing windows"
        >
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />

          <path d={sleepArc} fill="none" stroke="#ccfbf1" strokeWidth="11" strokeLinecap="round" />
          <path d={lightArc} fill="none" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" opacity="0.85" />

          {model.doseWindows.map((window, index) => {
            const angle = minutesToAngle(window.minutes)
            const ringPoint = polarToCartesian(CX, CY, R, angle)
            const labelRadius = labelRadii[index] ?? LABEL_BASE_R
            const labelPoint = polarToCartesian(CX, CY, labelRadius, angle)
            const leaderEnd = polarToCartesian(CX, CY, labelRadius - 7, angle)
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
                  fontSize={LABEL_FONT_SIZE}
                  className="fill-teal-900 font-medium"
                  stroke="white"
                  strokeWidth={3.5}
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
            y={CY - 8}
            textAnchor="middle"
            fontSize={24}
            className="fill-black font-medium capitalize"
          >
            {model.chronotypeLabel}
          </text>
          <text
            x={CX}
            y={CY + 14}
            textAnchor="middle"
            fontSize={18}
            className="fill-black/50 font-mono"
          >
            {model.msfscLabel}
          </text>
          {confidenceScore !== undefined ? (
            <text
              x={CX}
              y={CY + 34}
              textAnchor="middle"
              fontSize={16}
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

type ViewBounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

function mergeBounds(target: ViewBounds, next: ViewBounds) {
  target.minX = Math.min(target.minX, next.minX)
  target.minY = Math.min(target.minY, next.minY)
  target.maxX = Math.max(target.maxX, next.maxX)
  target.maxY = Math.max(target.maxY, next.maxY)
}

function expandBounds(bounds: ViewBounds, pad: number): ViewBounds {
  return {
    minX: bounds.minX - pad,
    minY: bounds.minY - pad,
    maxX: bounds.maxX + pad,
    maxY: bounds.maxY + pad,
  }
}

function estimateLabelBounds(label: string, angle: number, radius: number): ViewBounds {
  const point = polarToCartesian(CX, CY, radius, angle)
  const textAnchor = getLabelTextAnchor(angle)
  const baseline = getLabelBaseline(angle)
  const width = label.length * LABEL_CHAR_WIDTH

  let minX = point.x
  let maxX = point.x
  if (textAnchor === 'start') {
    maxX = point.x + width
  } else if (textAnchor === 'end') {
    minX = point.x - width
  } else {
    minX = point.x - width / 2
    maxX = point.x + width / 2
  }

  let minY = point.y
  let maxY = point.y
  if (baseline === 'hanging') {
    maxY = point.y + LABEL_LINE_HEIGHT
  } else if (baseline === 'auto') {
    minY = point.y - LABEL_LINE_HEIGHT
  } else {
    minY = point.y - LABEL_LINE_HEIGHT / 2
    maxY = point.y + LABEL_LINE_HEIGHT / 2
  }

  return { minX, minY, maxX, maxY }
}

function computeContentViewBox(
  model: BodyClockModel,
  labelRadii: number[],
  options: { showConfidence: boolean; nowMinutes: number }
): string {
  const bounds: ViewBounds = {
    minX: CX - R - 14,
    minY: CY - R - 14,
    maxX: CX + R + 14,
    maxY: CY + R + 14,
  }

  mergeBounds(bounds, {
    minX: CX - 92,
    minY: CY - (options.showConfidence ? 36 : 28),
    maxX: CX + 92,
    maxY: CY + (options.showConfidence ? 42 : 24),
  })

  for (let index = 0; index < model.doseWindows.length; index++) {
    const window = model.doseWindows[index]
    const angle = minutesToAngle(window.minutes)
    const ringPoint = polarToCartesian(CX, CY, R, angle)
    mergeBounds(bounds, {
      minX: ringPoint.x - 6,
      minY: ringPoint.y - 6,
      maxX: ringPoint.x + 6,
      maxY: ringPoint.y + 6,
    })
    mergeBounds(bounds, estimateLabelBounds(window.label, angle, labelRadii[index] ?? LABEL_BASE_R))
  }

  const nowPoint = polarToCartesian(CX, CY, R, minutesToAngle(options.nowMinutes))
  mergeBounds(bounds, {
    minX: nowPoint.x - 8,
    minY: nowPoint.y - 8,
    maxX: nowPoint.x + 8,
    maxY: nowPoint.y + 8,
  })

  const padded = expandBounds(bounds, VIEW_PAD)
  const width = padded.maxX - padded.minX
  const height = padded.maxY - padded.minY
  const size = Math.max(width, height)
  const midX = (padded.minX + padded.maxX) / 2
  const midY = (padded.minY + padded.maxY) / 2

  return `${midX - size / 2} ${midY - size / 2} ${size} ${size}`
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
