'use client'

import type { ReactElement, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { DEEPDOSE_LANDING_PLATFORM } from '@/lib/deepdose-marketing/landing-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import {
  BCA_EDUCATION_TIERS,
  BODY_CLOCK_ANCHOR_COMPARE,
  bodyClockResultStatement,
  bcaTierLabel,
  resolveBcaEducationTier,
  type BcaEducationTierId,
} from '@/lib/circadian/body-clock-measurement'
import { cn } from '@/lib/utils/cn'

type HeroPillar = (typeof DEEPDOSE_LANDING_PLATFORM.pillars)[number]
type HeroPanelItem = HeroPillar['panelItems'][number]

const HERO_TAB_ICONS: Record<HeroPillar['icon'], ReactElement> = {
  // Chrono test — clipboard with a check (a short validated assessment)
  test: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.12"
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.12"
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.12"
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
  // Medications — capsule (combination check)
  meds: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.12"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8.5 8.5 15.5 15.5" />
      <path d="M9.5 5.5a4.5 4.5 0 0 1 6.4 6.4L8.1 19.7a4.5 4.5 0 0 1-6.4-6.4z" />
    </svg>
  ),
}

const HERO_TAB_ICON_TONES: Record<HeroPillar['icon'], string> = {
  test: 'peach',
  plan: 'lilac',
  social: 'blue',
  meds: 'gold',
}

// Community signal for the Social feed — clusters of member faces plus a rough
// count of people sharing, so each card reads as "connecting with others".
const SOCIAL_PEERS = [
  { count: '2.4k', faces: ['ash', 'kai', 'river'] },
  { count: '860', faces: ['sage', 'rowan', 'sol'] },
  { count: '1.3k', faces: ['indie', 'ash', 'kai'] },
  { count: '5.1k', faces: ['river', 'sol', 'rowan'] },
] as const

// Chrono test — melatonin anchor readout (metric layer). Cues live on Dosing plan tab.
const CHRONO_PREVIEW_ANCHOR = '22:06'
const CHRONO_PREVIEW_BLACKOUT = '21:54'
const CHRONO_PREVIEW_GAP_MINUTES = 12
const CHRONO_PREVIEW_BCA = 82
const CHRONO_PREVIEW_AGE = 34
const CHRONO_PREVIEW_COORDS = '51.507° N, 0.128° W'
const CHRONO_PREVIEW_DATE = 'Thu 20 Jun 2026'
const CHRONO_PREVIEW_DRIFT = '+12m'

function bcaTierTone(score: number): BcaEducationTierId {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

const BCA_STATE_ICONS: Record<BcaEducationTierId, ReactElement> = {
  low: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12c2.5-4 5-4 7.5 0s5 4 7.5 0 5-4 7.5 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  medium: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9h11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M9 15h11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  high: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M4 14h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
}

const CHRONO_PREVIEW_STATS = [
  { label: 'TipTraQ validated', value: '3 / 3 nights' },
  { label: 'Blackout target', value: CHRONO_PREVIEW_BLACKOUT },
  { label: 'Drift', value: CHRONO_PREVIEW_DRIFT },
] as const

const CHRONO_PREVIEW_LADDER = [
  { id: 'chrono', label: 'Chrono test', done: true },
  { id: 'clinical', label: 'TipTraQ', done: true, current: true },
] as const

// Dosing plan — daily cue schedule timed to the melatonin anchor.
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
    note: 'Outside 10 min. Anchors your clock.',
    status: 'done',
    tone: 'peach',
  },
  {
    label: 'Metformin 500 mg',
    time: '08:30',
    note: 'Take now. Your window is open.',
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
    note: 'Dim light, no screens. Starts your blackout window.',
    status: 'upcoming',
    tone: 'blue',
  },
] as const

const PLAN_STATUS_LABEL: Record<(typeof PLAN_DOSES)[number]['status'], string> = {
  done: 'Done',
  now: 'Now',
  upcoming: 'Soon',
}

// Flips true one frame after mount so transition-based reveals animate from initial state.
function useMountReveal() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setActive(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return active
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
            style={{ backgroundImage: `url(${communityFaceUrl(face)})` }}
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
          <p className="seco-planpreview__day">Today · Tuesday</p>
          <p className="seco-planpreview__phase">
            Anchored to melatonin · <span className="font-mono">22:06</span>
          </p>
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
  const score = CHRONO_PREVIEW_BCA
  const activeTier = resolveBcaEducationTier(score)
  const tierTone = bcaTierTone(score)

  return (
    <div className="seco-dashpreview seco-dashpreview--chrono" aria-hidden="true">
      <div className="seco-dashpreview__main">
        <div className="seco-dashpreview__top">
          <div className="seco-dashpreview__id">
            <span className="seco-dashpreview__avatar" />
            <div className="seco-dashpreview__profile">
              <p className="seco-dashpreview__name-row">
                <span className="seco-dashpreview__name">Sean James</span>
                <span className="seco-dashpreview__profile-age">{CHRONO_PREVIEW_AGE}</span>
              </p>
              <div className="seco-dashpreview__profile-detail">
                <span className="seco-dashpreview__profile-location">{CHRONO_PREVIEW_COORDS}</span>
                <span className="seco-dashpreview__profile-date">{CHRONO_PREVIEW_DATE}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="seco-dashpreview__hero seco-dashpreview__hero--stack">
          <div className="seco-dashpreview__dial-block">
            <h3 className="seco-dashpreview__metric-title">Body clock alignment</h3>

            <div className="seco-dashpreview__metric-card seco-dashpreview__anchor-panel">
              <p className="seco-dashpreview__anchor-result">{bodyClockResultStatement(score)}</p>

              <div className="seco-dashpreview__anchor-compare">
                <div className="seco-dashpreview__anchor-node">
                  <span className="seco-dashpreview__anchor-icon seco-dashpreview__anchor-icon--moon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M8 2.25a5.75 5.75 0 1 0 5.75 8.55A4.75 4.75 0 0 1 8 2.25Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="seco-dashpreview__anchor-time">{CHRONO_PREVIEW_ANCHOR}</span>
                  <span className="seco-dashpreview__anchor-label">{BODY_CLOCK_ANCHOR_COMPARE.brainLabel}</span>
                  <span className="seco-dashpreview__anchor-hint">{BODY_CLOCK_ANCHOR_COMPARE.brainHint}</span>
                </div>

                <div className="seco-dashpreview__anchor-bridge">
                  <span className="seco-dashpreview__anchor-line" />
                  <span className="seco-dashpreview__anchor-gap">
                    {BODY_CLOCK_ANCHOR_COMPARE.gapLabel(CHRONO_PREVIEW_GAP_MINUTES)}
                  </span>
                  <span className="seco-dashpreview__anchor-line" />
                </div>

                <div className="seco-dashpreview__anchor-node seco-dashpreview__anchor-node--target">
                  <span className="seco-dashpreview__anchor-icon seco-dashpreview__anchor-icon--blackout">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="seco-dashpreview__anchor-time">{CHRONO_PREVIEW_BLACKOUT}</span>
                  <span className="seco-dashpreview__anchor-label">{BODY_CLOCK_ANCHOR_COMPARE.habitLabel}</span>
                  <span className="seco-dashpreview__anchor-hint">{BODY_CLOCK_ANCHOR_COMPARE.habitHint}</span>
                </div>
              </div>
            </div>

            <div className="seco-dashpreview__metric-card seco-dashpreview__bca-panel">
              <div className="seco-dashpreview__bca-intro">
                <div className="seco-dashpreview__bca-head">
                  <p className="seco-dashpreview__bca-score">
                    {score}
                    <span className="seco-dashpreview__bca-score-max">/100</span>
                  </p>
                  <span className={cn('seco-dashpreview__tier-pill', `seco-dashpreview__tier-pill--${tierTone}`)}>
                    {bcaTierLabel(score)}
                  </span>
                </div>
              </div>

              <div className="seco-dashpreview__bca-scale" aria-hidden="true">
                <span className="seco-dashpreview__bca-scale-track" />
                <span className="seco-dashpreview__bca-scale-thumb" style={{ left: `${score}%` }} />
              </div>

              <div className="seco-dashpreview__bca-states">
                {BCA_EDUCATION_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className={cn(
                      'seco-dashpreview__bca-state',
                      `seco-dashpreview__bca-state--${tier.id}`,
                      tier.id === activeTier.id && 'seco-dashpreview__bca-state--active'
                    )}
                  >
                    <span className="seco-dashpreview__bca-state-icon">{BCA_STATE_ICONS[tier.id]}</span>
                    <span className="seco-dashpreview__bca-state-label">{tier.shortLabel}</span>
                    <span className="seco-dashpreview__bca-state-range">{tier.rangeLabel}</span>
                    <span className="seco-dashpreview__bca-state-def">
                      <span>{tier.definitionLines[0]}</span>
                      <span>{tier.definitionLines[1]}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="seco-dashpreview__stats">
              {CHRONO_PREVIEW_STATS.map((stat) => (
                <li key={stat.label} className="seco-dashpreview__stat">
                  <span className="seco-dashpreview__stat-label">{stat.label}</span>
                  <span className="seco-dashpreview__stat-value">{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="seco-dashpreview__ladder">
        <div className="seco-dashpreview__ladder-row">
          <p className="seco-dashpreview__ladder-title">Estimate → validate</p>
          <ol className="seco-dashpreview__ladder-steps">
            <li className="seco-dashpreview__ladder-step seco-dashpreview__ladder-step--live">
              <span className="seco-hero-tabs__dot seco-hero-tabs__dot--live" aria-hidden />
              <span className="seco-dashpreview__ladder-label">Sensors live</span>
            </li>
            {CHRONO_PREVIEW_LADDER.map((step) => (
              <li
                key={step.id}
                className={cn(
                  'seco-dashpreview__ladder-step',
                  step.done && 'seco-dashpreview__ladder-step--done',
                  'current' in step && step.current && 'seco-dashpreview__ladder-step--current'
                )}
              >
                <span className="seco-dashpreview__ladder-mark" aria-hidden>
                  {step.done ? '✓' : '○'}
                </span>
                <span className="seco-dashpreview__ladder-label">{step.label}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="seco-dashpreview__ladder-note">
          Passive estimate from your phone · validated by TipTraQ.
        </p>
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
    <article
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
    </article>
  )
}

export function DeepDoseHeroTabs() {
  const pillars = DEEPDOSE_LANDING_PLATFORM.pillars
  const [activeId, setActiveId] = useState<HeroPillar['id']>('screen')

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
          {activePillar.id === 'screen' ? (
            <HeroDashPreview />
          ) : activePillar.id === 'score' ? (
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
                  activePillar.id === 'sync' ? <HeroPanelAvatars index={index} /> : null

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
        </div>
      </div>
    </div>
  )
}
