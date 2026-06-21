'use client'

import { useEffect, useId, useState } from 'react'
import {
  describeDonutArc,
  isNowInAnyWindow,
  polarToCartesian,
  timeToAngle,
  timeWindowToArc,
} from '@/lib/utils/time'

export interface ClockWindow {
  id: string
  label: string
  start: string
  end: string
  color: string
}

interface CircadianClockProps {
  dlmoTime: string
  windows: ClockWindow[]
  chronotypeLabel?: string
}

const CX = 200
const CY = 200
const OUTER_R = 158
const INNER_R = 108
const LABEL_R = OUTER_R + 22
const TICK_OUTER = OUTER_R - 2
const TICK_INNER_MAJOR = OUTER_R - 14
const TICK_INNER_MINOR = OUTER_R - 8
const HAND_INNER = 58
const HAND_OUTER = OUTER_R - 14

const HOUR_LABELS = [
  { hour: 0, label: '00:00' },
  { hour: 6, label: '06:00' },
  { hour: 12, label: '12:00' },
  { hour: 18, label: '18:00' },
]

function nowHHMM(): string {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function nowAngleWithSeconds(): number {
  const d = new Date()
  const mins = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60
  return (mins / 1440) * 360 - 90
}

export default function CircadianClock({
  dlmoTime,
  windows,
  chronotypeLabel,
}: CircadianClockProps) {
  const uid = useId().replace(/:/g, '')
  const [now, setNow] = useState<string | null>(null)
  const [handAngle, setHandAngle] = useState(-90)

  useEffect(() => {
    const tick = () => {
      setNow(nowHHMM())
      setHandAngle(nowAngleWithSeconds())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const liveNow = now ?? '00:00'
  const showLiveHand = now !== null
  const inWindow = showLiveHand && windows.length > 0 && isNowInAnyWindow(liveNow, windows)
  const dlmoAngle = timeToAngle(dlmoTime)
  const dlmoInner = polarToCartesian(CX, CY, INNER_R + 4, dlmoAngle)
  const dlmoOuter = polarToCartesian(CX, CY, OUTER_R - 4, dlmoAngle)
  const statusClass = !showLiveHand
    ? 'dial-readout__status--idle'
    : inWindow
      ? 'dial-readout__status--active'
      : 'dial-readout__status--outside'

  const statusText =
    windows.length === 0
      ? 'No windows'
      : !showLiveHand
        ? 'Syncing…'
        : inWindow
          ? 'Window open'
          : 'Outside window'

  return (
    <div className="circadian-clock">
      <div className="circadian-clock__stage">
        <svg
          viewBox="0 0 400 400"
          className="circadian-clock__svg"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-track`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="circadian-clock__stop circadian-clock__stop--track-from" />
              <stop offset="100%" className="circadian-clock__stop circadian-clock__stop--track-to" />
            </linearGradient>
            <linearGradient id={`${uid}-window`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="circadian-clock__stop circadian-clock__stop--spectrum-cyan" />
              <stop offset="48%" className="circadian-clock__stop circadian-clock__stop--spectrum-mid" />
              <stop offset="100%" className="circadian-clock__stop circadian-clock__stop--spectrum-lilac" />
            </linearGradient>
            <linearGradient id={`${uid}-window-glow`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className="circadian-clock__stop circadian-clock__stop--window-glow-from" />
              <stop offset="100%" className="circadian-clock__stop circadian-clock__stop--window-glow-to" />
            </linearGradient>
            <radialGradient id={`${uid}-face`} cx="50%" cy="42%" r="58%">
              <stop offset="0%" className="circadian-clock__stop circadian-clock__stop--face-from" />
              <stop offset="55%" className="circadian-clock__stop circadian-clock__stop--face-mid" />
              <stop offset="100%" className="circadian-clock__stop circadian-clock__stop--face-to" />
            </radialGradient>
            <filter id={`${uid}-window-glow-filter`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`${uid}-hand-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="circadian-clock__layer circadian-clock__layer--bg">
            <circle cx={CX} cy={CY} r={OUTER_R + 6} className="circadian-clock__bezel" fill="none" />
            <path
              d={describeDonutArc(CX, CY, OUTER_R, INNER_R, -90, 270)}
              fill={`url(#${uid}-track)`}
              className="circadian-clock__track"
            />
            {windows.map((w) => {
              const arc = timeWindowToArc(w.start, w.end)
              return (
                <g key={w.id} filter={`url(#${uid}-window-glow-filter)`}>
                  <path
                    d={describeDonutArc(CX, CY, OUTER_R - 1, INNER_R + 1, arc.startAngle, arc.endAngle)}
                    fill={`url(#${uid}-window)`}
                    className="circadian-clock__window"
                  />
                  <path
                    d={describeDonutArc(CX, CY, OUTER_R - 1, INNER_R + 1, arc.startAngle, arc.endAngle)}
                    fill={`url(#${uid}-window-glow)`}
                    className="circadian-clock__window-shine"
                  />
                </g>
              )
            })}
            <circle cx={CX} cy={CY} r={INNER_R - 1} fill={`url(#${uid}-face)`} className="circadian-clock__face" />
          </g>

          <g className="circadian-clock__layer circadian-clock__layer--ticks">
            {Array.from({ length: 24 }, (_, i) => {
              const isMajor = i % 6 === 0
              const angle = (i / 24) * 360 - 90
              const innerR = isMajor ? TICK_INNER_MAJOR : TICK_INNER_MINOR
              const a = polarToCartesian(CX, CY, TICK_OUTER, angle)
              const b = polarToCartesian(CX, CY, innerR, angle)
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  className={isMajor ? 'circadian-clock__tick circadian-clock__tick--major' : 'circadian-clock__tick'}
                />
              )
            })}
          </g>

          <g className="circadian-clock__layer circadian-clock__layer--markers">
            <line
              x1={dlmoInner.x}
              y1={dlmoInner.y}
              x2={dlmoOuter.x}
              y2={dlmoOuter.y}
              className="circadian-clock__dlmo-line"
            />
            <circle
              cx={dlmoOuter.x}
              cy={dlmoOuter.y}
              r={4.5}
              className="circadian-clock__dlmo-dot"
            />
            {showLiveHand && (
              <g
                className={`circadian-clock__hand ${inWindow ? 'circadian-clock__hand--active' : 'circadian-clock__hand--outside'}`}
                style={{ transform: `rotate(${handAngle + 90}deg)` }}
                filter={`url(#${uid}-hand-glow)`}
              >
                <line
                  x1={CX}
                  y1={CY - HAND_INNER}
                  x2={CX}
                  y2={CY - HAND_OUTER}
                  className="circadian-clock__hand-line"
                />
                <circle cx={CX} cy={CY - HAND_OUTER} r={6} className="circadian-clock__hand-cap" />
              </g>
            )}
            <circle cx={CX} cy={CY} r={7} className="circadian-clock__hub" />
            <circle cx={CX} cy={CY} r={3} className="circadian-clock__hub-core" />
          </g>

          <g className="circadian-clock__layer circadian-clock__layer--labels">
            {HOUR_LABELS.map(({ hour, label }) => {
              const time = `${hour.toString().padStart(2, '0')}:00`
              const angle = timeToAngle(time)
              const pos = polarToCartesian(CX, CY, LABEL_R, angle)
              return (
                <text
                  key={hour}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="circadian-clock__hour-label"
                >
                  {label}
                </text>
              )
            })}
          </g>
        </svg>

        <div
          className="dial-readout circadian-clock__readout"
          role="img"
          aria-label={`Circadian clock, ${statusText}, ${showLiveHand ? liveNow : 'loading'}, DLMO ${dlmoTime}`}
        >
          <p className="dial-readout__primary">
            <span className="dial-readout__value dial-readout__value--time">
              {showLiveHand ? liveNow : '--:--'}
            </span>
          </p>
          {chronotypeLabel && (
            <p className="dial-readout__meta">{chronotypeLabel}</p>
          )}
          <p className={`dial-readout__status ${statusClass}`}>{statusText}</p>
          <p className="dial-readout__meta dial-readout__meta--dlmo">DLMO {dlmoTime}</p>
        </div>
      </div>

      <ul className="circadian-clock__legend">
        <li>
          <span className="circadian-clock__swatch circadian-clock__swatch--window" />
          Recommended window
        </li>
        <li>
          <span className="circadian-clock__swatch circadian-clock__swatch--track" />
          Outside window
        </li>
        <li>
          <span className="circadian-clock__swatch circadian-clock__swatch--dlmo" />
          DLMO
        </li>
        {showLiveHand && (
          <li>
            <span
              className={`circadian-clock__swatch circadian-clock__swatch--now ${inWindow ? 'circadian-clock__swatch--now-active' : ''}`}
            />
            Now
          </li>
        )}
      </ul>

      {windows.length > 0 && (
        <p className="circadian-clock__windows-detail">
          {windows.map((w) => `${w.label}: ${w.start}–${w.end}`).join(' · ')}
        </p>
      )}
    </div>
  )
}
