'use client'

import { useEffect, useState } from 'react'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { formatMinutes24h } from '@/lib/dashboard/time-utils'

export type MedicationTimelineProps = {
  doseWindows: Array<{ label: string; minutes: number }>
  wakeMinutes: number
  sleepMinutes: number
  nowMinutes?: number
}

const TRACK_LEFT = 24
const TRACK_RIGHT = 576
const TRACK_WIDTH = TRACK_RIGHT - TRACK_LEFT
const TRACK_Y = 60

function getWakingSpan(wakeMinutes: number, sleepMinutes: number): number {
  return sleepMinutes > wakeMinutes
    ? sleepMinutes - wakeMinutes
    : 1440 - wakeMinutes + sleepMinutes
}

function minutesToTimelineX(
  minutes: number,
  wakeMinutes: number,
  sleepMinutes: number
): number {
  const span = getWakingSpan(wakeMinutes, sleepMinutes)
  const offset =
    minutes >= wakeMinutes ? minutes - wakeMinutes : 1440 - wakeMinutes + minutes
  return TRACK_LEFT + (offset / span) * TRACK_WIDTH
}

function getNowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

export function MedicationTimeline({
  doseWindows,
  wakeMinutes,
  sleepMinutes,
  nowMinutes: nowMinutesProp = 0,
}: MedicationTimelineProps) {
  const [nowMinutes, setNowMinutes] = useState(nowMinutesProp || getNowMinutes())

  useEffect(() => {
    setNowMinutes(getNowMinutes())
    const interval = window.setInterval(() => setNowMinutes(getNowMinutes()), 30_000)
    return () => window.clearInterval(interval)
  }, [])

  const nowX = minutesToTimelineX(nowMinutes, wakeMinutes, sleepMinutes)

  return (
    <section>
      <h2 className={SECTION_LABEL}>Medication timing</h2>

      <svg
        viewBox="0 0 600 120"
        className="mt-3 h-[120px] w-full"
        role="img"
        aria-label="Medication dose windows across waking hours"
      >
        <line
          x1={TRACK_LEFT}
          y1={TRACK_Y}
          x2={TRACK_RIGHT}
          y2={TRACK_Y}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={2}
        />

        <text
          x={TRACK_LEFT}
          y={80}
          fontSize={10}
          fill="rgba(0,0,0,0.4)"
          style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
        >
          {formatMinutes24h(wakeMinutes)}
        </text>
        <text
          x={TRACK_RIGHT}
          y={80}
          fontSize={10}
          textAnchor="end"
          fill="rgba(0,0,0,0.4)"
          style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
        >
          {formatMinutes24h(sleepMinutes)}
        </text>

        {doseWindows.map((doseWindow, index) => {
          const x = minutesToTimelineX(doseWindow.minutes, wakeMinutes, sleepMinutes)
          return (
            <g key={`${doseWindow.label}-${doseWindow.minutes}-${index}`}>
              <line x1={x} y1={40} x2={x} y2={60} stroke="#10b981" strokeWidth={2} />
              <circle cx={x} cy={40} r={5} fill="#10b981" stroke="white" strokeWidth={1.5} />
              <text
                x={x}
                y={32}
                textAnchor="middle"
                fontSize={11}
                fontWeight={500}
                fill="#0d9488"
              >
                {doseWindow.label}
              </text>
              <text
                x={x}
                y={76}
                textAnchor="middle"
                fontSize={9}
                fill="rgba(0,0,0,0.4)"
                style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
              >
                {formatMinutes24h(doseWindow.minutes)}
              </text>
            </g>
          )
        })}

        <line x1={nowX} y1={48} x2={nowX} y2={72} stroke="#0d0d0d" strokeWidth={1.5} />
        <text
          x={nowX}
          y={86}
          textAnchor="middle"
          fontSize={9}
          fill="rgba(0,0,0,0.4)"
          style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
        >
          now
        </text>
      </svg>
    </section>
  )
}
