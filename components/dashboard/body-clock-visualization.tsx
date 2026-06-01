'use client'

import { useEffect, useMemo, useState } from 'react'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { BodyClockModel, DoseWindow } from '@/lib/dashboard/body-clock'
import { describeArc, formatMinutesLabel, minutesToAngle, polarToCartesian } from '@/lib/dashboard/time-utils'

type BodyClockVisualizationProps = {
  model: BodyClockModel
  nightsCount?: number
  confidenceScore?: number
  confidenceLabel?: string
}

const CX = 280
const CY = 280
const R = 96
const LABEL_BASE_R = R + 38
const LABEL_RADIUS_STEP = 28
const MIN_LABEL_ANGLE_SEP = 38
const LABEL_FONT_SIZE = 13
const LABEL_TIME_FONT_SIZE = 11
const LABEL_CHAR_WIDTH = 7.2
const LABEL_LINE_HEIGHT = 16
const LABEL_TIME_LINE_HEIGHT = 14
const VIEW_PAD = 16

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

  const labelLayout = useMemo(
    () => assignLabelPositions(model.doseWindows, LABEL_BASE_R),
    [model.doseWindows]
  )

  const viewBox = useMemo(
    () =>
      computeContentViewBox(model, labelLayout, {
        nowMinutes,
      }),
    [confidenceScore, labelLayout, model, nowMinutes]
  )

  const nowAngle = minutesToAngle(nowMinutes)
  const nowPoint = polarToCartesian(CX, CY, R, nowAngle)
  const sleepArc = describeArc(CX, CY, R, model.sleepStartMinutes, model.sleepEndMinutes)
  const lightArc = describeArc(CX, CY, R, model.lightStartMinutes, model.lightEndMinutes)
  const dlmoPoint = polarToCartesian(CX, CY, R, minutesToAngle(model.phaseMinutes))
  const phaseTime = parsePhaseLabelTime(model.phaseLabel)

  return (
    <section>
      <h2 className={`${SECTION_LABEL} tracking-[0.12em]`}>Your body clock</h2>

      <div className="mx-auto flex w-full items-center justify-center py-8">
        <svg
          viewBox={viewBox}
          className="aspect-square w-full max-w-[min(580px,calc(100vw-60px))] overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="24-hour body clock with medication timing windows"
        >
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />

          <path d={sleepArc} fill="none" stroke="#ccfbf1" strokeWidth="11" strokeLinecap="round" />
          <path d={lightArc} fill="none" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" opacity="0.85" />

          {model.doseWindows.map((window, index) => {
            const ringAngle = minutesToAngle(window.minutes)
            const layout = labelLayout[index]
            const ringPoint = polarToCartesian(CX, CY, R, ringAngle)
            const labelPoint = polarToCartesian(CX, CY, layout.radius, layout.displayAngle)
            const leaderEnd = polarToCartesian(CX, CY, layout.radius - 8, layout.displayAngle)
            const textAnchor = getLabelTextAnchor(layout.displayAngle)
            const timeLabel = formatMinutesLabel(window.minutes)

            return (
              <g key={`${window.label}-${window.minutes}-${index}`}>
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
                  fontSize={LABEL_FONT_SIZE}
                  fontWeight={500}
                  className="fill-teal-700"
                >
                  <tspan x={labelPoint.x} dy={textAnchor === 'middle' ? '-0.55em' : '-0.2em'}>
                    {window.label}
                  </tspan>
                  <tspan
                    x={labelPoint.x}
                    dy="1.25em"
                    fontSize={LABEL_TIME_FONT_SIZE}
                    fontWeight={400}
                    className="fill-teal-600/75 font-mono"
                  >
                    {timeLabel}
                  </tspan>
                </text>
              </g>
            )
          })}

          <circle cx={dlmoPoint.x} cy={dlmoPoint.y} r="5" fill="#0d9488" stroke="white" strokeWidth="2" />
          <circle cx={nowPoint.x} cy={nowPoint.y} r="6" fill="#0f172a" stroke="white" strokeWidth="2" />

          <text
            x={CX}
            y={CY - 26}
            textAnchor="middle"
            fontSize={10}
            letterSpacing="0.08em"
            className="fill-black/40 font-mono uppercase"
          >
            MLux phase
          </text>
          <text
            x={CX}
            y={CY + 2}
            textAnchor="middle"
            fontSize={28}
            fontWeight={700}
            className="fill-black"
          >
            {phaseTime}
          </text>
          <text
            x={CX}
            y={CY + 26}
            textAnchor="middle"
            fontSize={16}
            fontWeight={500}
            className="fill-black/60 capitalize"
          >
            {model.chronotypeLabel}
          </text>
          {confidenceScore !== undefined ? (
            <text
              x={CX}
              y={CY + 44}
              textAnchor="middle"
              fontSize={11}
              className="fill-black/40 font-mono"
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
  const width = label.length * LABEL_CHAR_WIDTH
  const blockHeight = LABEL_LINE_HEIGHT + LABEL_TIME_LINE_HEIGHT

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

  return {
    minX,
    minY: point.y - blockHeight / 2,
    maxX,
    maxY: point.y + blockHeight / 2,
  }
}

function computeContentViewBox(
  model: BodyClockModel,
  labelLayout: LabelLayout[],
  options: { nowMinutes: number }
): string {
  const bounds: ViewBounds = {
    minX: CX - R - 14,
    minY: CY - R - 14,
    maxX: CX + R + 14,
    maxY: CY + R + 14,
  }

  mergeBounds(bounds, {
    minX: CX - 100,
    minY: CY - 52,
    maxX: CX + 100,
    maxY: CY + 52,
  })

  for (let index = 0; index < model.doseWindows.length; index++) {
    const window = model.doseWindows[index]
    const layout = labelLayout[index]
    const ringAngle = minutesToAngle(window.minutes)
    const ringPoint = polarToCartesian(CX, CY, R, ringAngle)
    mergeBounds(bounds, {
      minX: ringPoint.x - 6,
      minY: ringPoint.y - 6,
      maxX: ringPoint.x + 6,
      maxY: ringPoint.y + 6,
    })
    mergeBounds(bounds, estimateLabelBounds(window.label, layout.displayAngle, layout.radius))
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

  return `${CX - size / 2} ${CY - size / 2} ${size} ${size}`
}

type LabelLayout = {
  displayAngle: number
  radius: number
}

function requiredAngleSeparation(labelA: string, labelB: string, radius: number): number {
  const maxLabelWidth = Math.max(labelA.length, labelB.length) * LABEL_CHAR_WIDTH
  const arcWidthDeg = ((maxLabelWidth / radius) * (180 / Math.PI)) * 1.35
  return Math.max(MIN_LABEL_ANGLE_SEP, arcWidthDeg)
}

function assignLabelPositions(windows: DoseWindow[], baseRadius: number): LabelLayout[] {
  if (windows.length === 0) return []

  const items = windows.map((window, index) => ({
    index,
    label: window.label,
    ringAngle: minutesToAngle(window.minutes),
    displayAngle: minutesToAngle(window.minutes),
    radius: baseRadius,
  }))

  const byMinute = new Map<number, typeof items>()
  for (const item of items) {
    const minuteKey = windows[item.index].minutes
    const group = byMinute.get(minuteKey) ?? []
    group.push(item)
    byMinute.set(minuteKey, group)
  }

  for (const group of byMinute.values()) {
    if (group.length <= 1) continue
    const spread = Math.max(MIN_LABEL_ANGLE_SEP, 18)
    const start = group[0].ringAngle - ((group.length - 1) * spread) / 2
    group.forEach((item, offset) => {
      item.displayAngle = start + offset * spread
      item.radius = baseRadius + (offset % 2) * LABEL_RADIUS_STEP
    })
  }

  const sorted = [...items].sort((a, b) => a.displayAngle - b.displayAngle)
  const passes = Math.max(4, sorted.length * 3)

  for (let pass = 0; pass < passes; pass++) {
    for (let i = 1; i < sorted.length; i++) {
      pushLabelsApart(sorted[i - 1], sorted[i], false)
    }
    if (sorted.length > 1) {
      pushLabelsApart(sorted[sorted.length - 1], sorted[0], true)
    }
  }

  const layoutByIndex = new Array<LabelLayout>(windows.length)
  for (const item of items) {
    layoutByIndex[item.index] = { displayAngle: item.displayAngle, radius: item.radius }
  }

  return layoutByIndex
}

function pushLabelsApart(
  earlier: { label: string; displayAngle: number; radius: number },
  later: { label: string; displayAngle: number; radius: number },
  wrap: boolean
) {
  let diff = later.displayAngle - earlier.displayAngle
  if (wrap) diff += 360
  if (diff <= 0) return

  const needed = requiredAngleSeparation(earlier.label, later.label, Math.max(earlier.radius, later.radius))
  if (diff >= needed) return

  later.radius = Math.max(later.radius, earlier.radius + LABEL_RADIUS_STEP)
  if (diff < needed * 0.75) {
    later.displayAngle = (earlier.displayAngle + needed) % 360
  }
}

function getLabelTextAnchor(angleDeg: number): 'start' | 'middle' | 'end' {
  const rad = (angleDeg * Math.PI) / 180
  if (Math.cos(rad) > 0.35) return 'start'
  if (Math.cos(rad) < -0.35) return 'end'
  return 'middle'
}

function getNowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function parsePhaseLabelTime(phaseLabel: string): string {
  const match = phaseLabel.match(/^MLux phase\s+(.+)$/i)
  if (match) return match[1]
  return phaseLabel.replace(/\s+estimated$/i, '').trim()
}
