'use client'

import Link from 'next/link'
import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { DEEPDOSE_LANDING_PLATFORM } from '@/lib/secopeutic/landing-content'
import { cn } from '@/lib/utils/cn'

type HeroPillar = (typeof DEEPDOSE_LANDING_PLATFORM.pillars)[number]
type HeroPanelItem = HeroPillar['panelItems'][number]

const HERO_TAB_ICONS: Record<HeroPillar['icon'], ReactElement> = {
  // Chrono test — clipboard with a check (a short validated assessment)
  test: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 4h6v2.5H9z" />
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="m8.5 13.5 2 2 4-4.5" />
    </svg>
  ),
  // Dosing plan — clock (timing of daily cues)
  plan: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  // Social feed — share nodes (community / social proof)
  social: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.25 10.85 7.5-3.7" />
      <path d="m8.25 13.15 7.5 3.7" />
    </svg>
  ),
}

const HERO_TAB_ICON_TONES: Record<HeroPillar['icon'], string> = {
  test: 'peach',
  plan: 'lilac',
  social: 'blue',
}

// Community signal for the Social feed — clusters of member faces plus a rough
// count of people sharing, so each card reads as "connecting with others".
const SOCIAL_PEERS = [
  { count: '2.4k', faces: ['women/44', 'men/32', 'women/68'] },
  { count: '860', faces: ['men/75', 'women/12', 'men/41'] },
  { count: '1.3k', faces: ['women/90', 'men/9', 'women/29'] },
  { count: '5.1k', faces: ['men/54', 'women/57', 'men/86'] },
] as const

const FACE_BASE = 'https://randomuser.me/api/portraits'

// Chrono test — a glanceable preview of the real patient dose dash (Sean James demo),
// so visitors see the payoff of the test in one look.
const DASH_PREVIEW_SCORE = 82

const DASH_PREVIEW_STATS = [
  { label: 'Sleep', value: '6h 32m' },
  { label: 'Efficiency', value: '86%' },
  { label: 'Nights', value: '3 / 3' },
] as const

const DASH_PREVIEW_CUES: ReadonlyArray<{ label: string; time: string; now?: boolean }> = [
  { label: 'Morning light', time: '08:20' },
  { label: 'Metformin', time: '08:30', now: true },
  { label: 'Main meal', time: '13:00' },
  { label: 'Wind-down', time: '22:00' },
]

// Dosing plan — a high-fidelity preview of the daily dosing schedule: a 24h timeline
// with a live "now" marker, then dose cards that mirror the in-app cue cards.
const PLAN_TICKS = [
  { label: '6a', pos: 0 },
  { label: '12p', pos: 33.3 },
  { label: '6p', pos: 66.7 },
  { label: '12a', pos: 100 },
] as const

const PLAN_MARKERS = [
  { label: 'Light', pos: 10, tone: 'peach' },
  { label: 'Meds', pos: 16, tone: 'lilac', now: true },
  { label: 'Meal', pos: 40, tone: 'peach' },
  { label: 'Move', pos: 68, tone: 'blue' },
  { label: 'Sleep', pos: 95, tone: 'blue' },
] as const

const PLAN_NOW_POS = 16

const PLAN_DOSES = [
  {
    label: 'Morning light',
    time: '08:00',
    note: 'Outside 10 min — anchors your clock.',
    status: 'done',
    tone: 'peach',
  },
  {
    label: 'Metformin 500 mg',
    time: '08:30',
    note: 'Take now — your window is open.',
    status: 'now',
    tone: 'lilac',
  },
  {
    label: 'Main meal',
    time: '13:00',
    note: 'Largest meal at your metabolic peak.',
    status: 'upcoming',
    tone: 'peach',
  },
  {
    label: 'Wind-down',
    time: '22:00',
    note: 'Dim light, no screens — protect melatonin.',
    status: 'upcoming',
    tone: 'blue',
  },
] as const

const PLAN_STATUS_LABEL: Record<(typeof PLAN_DOSES)[number]['status'], string> = {
  done: 'Done',
  now: 'Now',
  upcoming: 'Soon',
}

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Flips true one frame after mount so transition-based reveals (ring sweep,
// now-line draw) animate from their initial state each time a tab is opened.
function useMountReveal() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setActive(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return active
}

function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(PREFERS_REDUCED_MOTION ? target : 0)
  const ref = useRef(target)
  ref.current = target

  useEffect(() => {
    if (PREFERS_REDUCED_MOTION) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * ref.current))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

function HeroPanelAvatars({ index }: { index: number }) {
  const peer = SOCIAL_PEERS[index % SOCIAL_PEERS.length]

  return (
    <span className="seco-hero-tabs__media seco-hero-tabs__peers" aria-hidden="true">
      <span className="seco-hero-tabs__avatars">
        {peer.faces.map((face) => (
          <span
            key={face}
            className="seco-hero-tabs__avatar"
            style={{ backgroundImage: `url(${FACE_BASE}/${face}.jpg)` }}
          />
        ))}
      </span>
      <span className="seco-hero-tabs__peers-count">{peer.count} sharing</span>
    </span>
  )
}

function HeroPlanPreview() {
  const active = useMountReveal()

  return (
    <div className="seco-planpreview" aria-hidden="true">
      <div className="seco-planpreview__head">
        <div>
          <p className="seco-planpreview__day">Today · Tue</p>
          <p className="seco-planpreview__phase">Body clock 22:30 · +38m drift</p>
        </div>
        <span className="seco-planpreview__window">
          <span className="seco-hero-tabs__dot seco-hero-tabs__dot--open" />
          Window open · 08:30
        </span>
      </div>

      <div className="seco-planpreview__timeline">
        <div className="seco-planpreview__rail">
          {PLAN_MARKERS.map((marker) => (
            <span
              key={marker.label}
              className={cn(
                'seco-planpreview__marker',
                `seco-planpreview__marker--${marker.tone}`,
                'now' in marker && marker.now && 'seco-planpreview__marker--now'
              )}
              style={{ left: `${marker.pos}%` }}
            />
          ))}
          <span
            className={cn('seco-planpreview__now', active && 'seco-planpreview__now--in')}
            style={{ left: `${PLAN_NOW_POS}%` }}
          >
            <span className="seco-planpreview__now-label">Now</span>
          </span>
        </div>
        <div className="seco-planpreview__ticks">
          {PLAN_TICKS.map((tick) => (
            <span
              key={tick.label}
              className="seco-planpreview__tick"
              style={{ left: `${tick.pos}%` }}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      <ul className="seco-planpreview__doses">
        {PLAN_DOSES.map((dose) => (
          <li
            key={dose.label}
            className={cn('seco-planpreview__dose', `seco-planpreview__dose--${dose.status}`)}
          >
            <span className={cn('seco-planpreview__accent', `seco-planpreview__accent--${dose.tone}`)} />
            <div className="seco-planpreview__dose-body">
              <div className="seco-planpreview__dose-top">
                <span className="seco-planpreview__dose-label">{dose.label}</span>
                <span className={cn('seco-planpreview__pill', `seco-planpreview__pill--${dose.status}`)}>
                  {dose.status === 'now' && <span className="seco-hero-tabs__dot seco-hero-tabs__dot--live" />}
                  {PLAN_STATUS_LABEL[dose.status]}
                </span>
              </div>
              <p className="seco-planpreview__dose-note">{dose.note}</p>
            </div>
            <span className="seco-planpreview__dose-time">{dose.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HeroDashPreview() {
  const active = useMountReveal()
  const score = useCountUp(DASH_PREVIEW_SCORE)
  const ringStyle = {
    '--seco-dial-p': active ? DASH_PREVIEW_SCORE : 0,
  } as CSSProperties

  return (
    <div className="seco-dashpreview" aria-hidden="true">
      <div className="seco-dashpreview__top">
        <div className="seco-dashpreview__id">
          <span className="seco-dashpreview__avatar" />
          <div>
            <p className="seco-dashpreview__name">Sean James</p>
            <p className="seco-dashpreview__sub">Moderate evening type · DLMO 22:30</p>
          </div>
        </div>
        <span className="seco-dashpreview__triage">On track</span>
      </div>

      <div className="seco-dashpreview__hero">
        <span className="seco-dashpreview__ring" style={ringStyle}>
          <span className="seco-dashpreview__ring-track" />
          <span className="seco-dashpreview__ring-arc" />
          <span className="seco-dashpreview__ring-cap seco-dashpreview__ring-cap--start" />
          <span className="seco-dashpreview__ring-cap seco-dashpreview__ring-cap--end" />
          <span className="seco-dashpreview__ring-num">
            <span className="seco-dashpreview__ring-figure">
              {score}
              <span className="seco-dashpreview__ring-denom">/100</span>
            </span>
          </span>
        </span>

        <div className="seco-dashpreview__hero-meta">
          <p className="seco-dashpreview__score-label">Alignment score</p>
          <p className="seco-dashpreview__status">
            <span className="seco-hero-tabs__dot seco-hero-tabs__dot--open" />
            Window open · dose now
          </p>
          <p className="seco-dashpreview__diagnostic">
            Your body clock is running a little late, but you&rsquo;re on track.
          </p>
          <div className="seco-dashpreview__stats">
            {DASH_PREVIEW_STATS.map((stat) => (
              <span key={stat.label} className="seco-dashpreview__stat">
                <span className="seco-dashpreview__stat-label">{stat.label}</span>
                <span className="seco-dashpreview__stat-value">{stat.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="seco-dashpreview__cues">
        <p className="seco-dashpreview__cues-title">Today&apos;s cues</p>
        <ul className="seco-dashpreview__cue-list">
          {DASH_PREVIEW_CUES.map((cue) => (
            <li key={cue.label} className="seco-dashpreview__cue">
              <span
                className={cn(
                  'seco-hero-tabs__dot',
                  cue.now && 'seco-hero-tabs__dot--live'
                )}
              />
              <span className="seco-dashpreview__cue-label">{cue.label}</span>
              {cue.now && <span className="seco-dashpreview__cue-now">Now</span>}
              <span className="seco-dashpreview__cue-time">{cue.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function HeroPanelCard({
  item,
  index,
  layout,
  media,
}: {
  item: HeroPanelItem
  index: number
  layout?: 'grid'
  media?: ReactNode
}) {
  return (
    <Link
      href={item.href}
      className={cn('seco-hero-tabs__panel-card', Boolean(media) && 'seco-hero-tabs__panel-card--media')}
    >
      {media}
      <p className="seco-hero-tabs__panel-card-title">{item.title}</p>
      <p className="seco-hero-tabs__panel-card-meta">{item.meta}</p>

      <span
        className={cn(
          'seco-hero-tabs__panel-rank',
          layout === 'grid' && 'seco-hero-tabs__panel-rank--grid'
        )}
        aria-hidden="true"
      >
        {index + 1}
      </span>
    </Link>
  )
}

export function SecopeuticHeroTabs() {
  const pillars = DEEPDOSE_LANDING_PLATFORM.pillars
  const [activeId, setActiveId] = useState<HeroPillar['id']>('test')

  const activePillar = pillars.find((pillar) => pillar.id === activeId) ?? pillars[0]
  const panelLayout =
    'panelLayout' in activePillar && activePillar.panelLayout === 'grid' ? 'grid' : undefined

  return (
    <div className="seco-hero-tabs">
      <div className="seco-hero-tabs__list" role="tablist" aria-label="Clinical pathway">
        {pillars.map((pillar) => {
          const isActive = pillar.id === activeId

          return (
            <button
              key={pillar.id}
              type="button"
              role="tab"
              id={`seco-hero-tab-${pillar.id}`}
              aria-selected={isActive}
              aria-controls="seco-hero-tabpanel"
              tabIndex={isActive ? 0 : -1}
              className={cn('seco-hero-tabs__tab', isActive && 'seco-hero-tabs__tab--active')}
              onClick={() => setActiveId(pillar.id)}
            >
              <span
                className={cn(
                  'seco-hero-tabs__icon',
                  `seco-hero-tabs__icon--${HERO_TAB_ICON_TONES[pillar.icon]}`
                )}
                aria-hidden="true"
              >
                {HERO_TAB_ICONS[pillar.icon]}
              </span>
              <span className="seco-hero-tabs__copy">
                <span className="seco-hero-tabs__label">{pillar.label}</span>
                <span className="seco-hero-tabs__body">{pillar.body}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="seco-hero-tabpanel"
        role="tabpanel"
        aria-labelledby={`seco-hero-tab-${activePillar.id}`}
        className="seco-hero-tabs__panel"
      >
        <div key={activePillar.id} className="seco-hero-tabs__panel-inner">
          <div className="seco-hero-tabs__panel-head">
            <h2 className="seco-hero-tabs__panel-title">{activePillar.panelTitle}</h2>
          </div>

          {activePillar.id === 'test' ? (
            <HeroDashPreview />
          ) : activePillar.id === 'plan' ? (
            <HeroPlanPreview />
          ) : (
            <div
              className={cn(
                'seco-hero-tabs__panel-rail',
                panelLayout === 'grid' && 'seco-hero-tabs__panel-rail--grid'
              )}
            >
              {activePillar.panelItems.map((item, index) => {
                const media =
                  activePillar.id === 'social' ? <HeroPanelAvatars index={index} /> : null

                return (
                  <HeroPanelCard
                    key={`${activePillar.id}-${item.href}-${index}`}
                    item={item}
                    index={index}
                    layout={panelLayout}
                    media={media}
                  />
                )
              })}
            </div>
          )}

          <Link
            href={activePillar.panelSeeAll.href}
            className="seco-hero-tabs__panel-link seco-hero-tabs__panel-link--footer"
          >
            {activePillar.panelSeeAll.label} →
          </Link>
        </div>
      </div>
    </div>
  )
}
