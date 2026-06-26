'use client'

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import {
  resolvePolyPlanMeds,
  syncStateForRisk,
} from '@/lib/medications/poly-plan-meds'
import {
  DEEPDOSE_PATIENT_PLAN_PERSONAL_BRIDGE,
  DEEPDOSE_PATIENT_PLAN_SHARING,
  DEEPDOSE_PATIENT_PLAN_TABS,
} from '@/lib/deepdose-marketing/landing-content'
import { buildPersonalTimingPath } from '@/lib/medications/home-to-onboarding'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
import { buildTakeTimeMap } from '@/lib/patient/plan-dose-preview'
import {
  buildPatientMelatoninProfile,
  bodyClockScoreFromProfile,
  clockLabelToHour,
  hourToAxisPosition,
  recommendedTakeTime,
  type PatientMelatoninProfile,
} from '@/lib/patient/patient-landing-melatonin'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import {
  BCA_EDUCATION_TIERS,
  BODY_CLOCK_ANCHOR_COMPARE,
  bodyClockResultStatement,
  bcaTierLabel,
  resolveBcaEducationTier,
} from '@/lib/circadian/body-clock-measurement'
import { PATIENT_LANDING_DEMO } from '@/lib/patient/patient-landing-defaults'
import {
  DOSE_PREVIEW_STATUS_LABEL,
  PLAN_TICKS,
  clockToTimelinePos,
} from '@/lib/patient/plan-dose-preview'
import type { BcaEducationTierId } from '@/lib/circadian/body-clock-measurement'
import { buildSixDoseStrip, type SixDoseStripItem } from '@/lib/patient/six-dose-strip'
import { PatientPlanProfileHeader } from '@/components/deepdose/PatientPlanProfileHeader'
import { PatientPlanTimingPanel } from '@/components/deepdose/PatientPlanTimingPanel'
import { PatientPlanDosingPanel } from '@/components/deepdose/PatientPlanDosingPanel'
import {
  PatientPlanNextStepsEntry,
  PatientPlanNextStepsFlow,
  type PatientPlanFlowStep,
} from '@/components/deepdose/PatientPlanNextSteps'

const LANDING_TABS = DEEPDOSE_PATIENT_PLAN_TABS.landing

type PlanTab = (typeof LANDING_TABS)[number]['id']

function resolveSharingHref(href: string, signupHref?: string) {
  return href === '/login' && signupHref ? signupHref : href
}

function TabIcon({ variant }: { variant: PlanTab }) {
  if (variant === 'timing') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (variant === 'dosing') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
        <path d="M9 4h6v2.5H9z" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m8.5 13.5 2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.25 10.85 7.5-3.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.25 13.15 7.5 3.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type LandingAccordion = 'risk' | 'meds' | 'doses' | 'data'

const LANDING_ACCORDION: {
  id: LandingAccordion
  label: string
  body: string
  tone: 'peach' | 'lilac' | 'blue'
}[] = [
  {
    id: 'risk',
    label: 'My risk',
    body: 'What circadian misalignment is doing to your chemistry',
    tone: 'peach',
  },
  {
    id: 'meds',
    label: 'My meds',
    body: "What's working, what's mistimed, what to change",
    tone: 'lilac',
  },
  {
    id: 'doses',
    label: 'My doses',
    body: 'Your personal protocol to need less',
    tone: 'peach',
  },
  {
    id: 'data',
    label: 'My data',
    body: 'Your Chronobiobank contribution and sharing controls',
    tone: 'blue',
  },
]

function AccordionIcon({ section }: { section: LandingAccordion }) {
  if (section === 'risk') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
        <path
          d="M9 3h6v5.5L18.5 19a2 2 0 0 1-1.9 2.5h-9.2A2 2 0 0 1 5.5 19L9 8.5V3z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 3h6" strokeLinecap="round" />
        <circle cx="10" cy="14" r="1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="16" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (section === 'meds') {
    return <TabIcon variant="dosing" />
  }

  if (section === 'doses') {
    return <TabIcon variant="timing" />
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MED_DOT_FILL = {
  red: '#dc4e60',
  amber: '#d97706',
  green: '#16a34a',
} as const

function curveLevelAtHour(profile: PatientMelatoninProfile, hour: number): number {
  const normalized = ((hour % 24) + 24) % 24
  const match = profile.curvePoints.find((p) => {
    const h = p.hour >= 24 ? p.hour - 24 : p.hour
    return Math.abs(h - normalized) < 0.26
  })
  return match?.level ?? 0.1
}

function MelatoninCurveInline({ profile }: { profile: PatientMelatoninProfile }) {
  const width = 360
  const height = 100
  const padX = 12
  const padY = 14

  const toX = (hour: number) => padX + hourToAxisPosition(hour) * (width - padX * 2)
  const toY = (level: number) => height - padY - level * (height - padY * 2)

  const path = profile.curvePoints
    .map((p, i) => {
      const h = p.hour >= 24 ? p.hour - 24 : p.hour
      return `${i === 0 ? 'M' : 'L'} ${toX(h).toFixed(1)} ${toY(p.level).toFixed(1)}`
    })
    .join(' ')

  const dlmoX = toX(clockLabelToHour(profile.adjustedDlmoLabel))

  return (
    <div className="seco-dashpreview__metric-card" aria-label="Melatonin curve">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-hidden>
        <path d={path} fill="none" stroke="rgb(47 95 212 / 0.65)" strokeWidth="2.5" />
        <line
          x1={dlmoX}
          y1={padY}
          x2={dlmoX}
          y2={height - padY}
          stroke="rgb(15 23 42 / 0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        {profile.medDots.map((med) => (
          <circle
            key={med.code}
            cx={toX(med.dotHour)}
            cy={toY(curveLevelAtHour(profile, med.dotHour))}
            r="4.5"
            fill={MED_DOT_FILL[med.dotColor]}
          />
        ))}
      </svg>
      <div className="seco-planpreview__timeline">
        <div className="seco-planpreview__ticks">
          {[
            { label: '6am', hour: 6 },
            { label: '12pm', hour: 12 },
            { label: '6pm', hour: 18 },
            { label: '12am', hour: 0 },
          ].map(({ label, hour }) => (
            <span
              key={label}
              className="seco-planpreview__tick"
              style={{ left: `${hourToAxisPosition(hour) * 100}%` }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

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

function useMountReveal() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setActive(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return active
}

function primaryTimeFromLabel(timeLabel: string): string {
  const match = timeLabel.match(/(\d{1,2}):(\d{2})/)
  if (!match) return timeLabel
  return `${match[1].padStart(2, '0')}:${match[2]}`
}

function SixDosePlanPreview({
  doses,
  dlmoLabel,
}: {
  doses: SixDoseStripItem[]
  dlmoLabel: string
}) {
  const active = useMountReveal()
  const markers = doses.map((dose) => ({
    id: dose.id,
    label: dose.shortLabel,
    pos: clockToTimelinePos(primaryTimeFromLabel(dose.timeLabel)),
    tone: dose.tone,
    now: dose.status === 'now',
  }))
  const nowPos = markers.find((marker) => marker.now)?.pos ?? markers[1]?.pos ?? 16
  const liveDose = doses.find((dose) => dose.status === 'now')

  return (
    <div className="seco-planpreview">
      <div className="seco-planpreview__head">
        <div>
          <p className="seco-planpreview__day">Today · Six-dose protocol</p>
          <p className="seco-planpreview__phase">
            Anchored to melatonin · <span className="font-mono tabular-nums">{dlmoLabel}</span>
          </p>
        </div>
        {liveDose ? (
          <span className="seco-planpreview__window">
            <span className="seco-hero-tabs__dot seco-hero-tabs__dot--open" />
            Window open · {primaryTimeFromLabel(liveDose.timeLabel)}
          </span>
        ) : null}
      </div>

      <div className="seco-planpreview__timeline">
        <div className="seco-planpreview__rail">
          {markers.map((marker) => (
            <span
              key={marker.id}
              className={cn(
                'seco-planpreview__marker',
                `seco-planpreview__marker--${marker.tone}`,
                marker.now && 'seco-planpreview__marker--now'
              )}
              style={{ left: `${marker.pos}%` }}
              title={marker.label}
            />
          ))}
          <span
            className={cn('seco-planpreview__now', active && 'seco-planpreview__now--in')}
            style={{ left: `${nowPos}%` }}
          >
            <span className="seco-planpreview__now-label">Now</span>
          </span>
        </div>
        <div className="seco-planpreview__ticks">
          {PLAN_TICKS.map((tick) => (
            <span key={tick.label} className="seco-planpreview__tick" style={{ left: `${tick.pos}%` }}>
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      <ul className="seco-planpreview__doses" aria-label="Six-dose protocol">
        {doses.map((dose) => (
          <li
            key={dose.id}
            className={cn('seco-planpreview__dose', `seco-planpreview__dose--${dose.status}`)}
          >
            <span className={cn('seco-planpreview__accent', `seco-planpreview__accent--${dose.tone}`)} />
            <div className="seco-planpreview__dose-body">
              <div className="seco-planpreview__dose-top">
                <span className="seco-planpreview__dose-label">{dose.label}</span>
                <span className={cn('seco-planpreview__pill', `seco-planpreview__pill--${dose.status}`)}>
                  {dose.status === 'now' && (
                    <span className="seco-hero-tabs__dot seco-hero-tabs__dot--live" />
                  )}
                  {DOSE_PREVIEW_STATUS_LABEL[dose.status]}
                </span>
              </div>
              <p className="seco-planpreview__dose-note">{dose.note}</p>
            </div>
            <span className="seco-planpreview__dose-time">{dose.timeLabel}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function medSyncFromRisk(risk: 'high' | 'medium' | 'low'): 'synced' | 'review' | 'conflict' {
  if (risk === 'high') return 'conflict'
  if (risk === 'medium') return 'review'
  return 'synced'
}

const APP_TABS = DEEPDOSE_PATIENT_PLAN_TABS.app

type PatientTimingPlanProps = {
  medCodes: string[]
  medTimes?: string[]
  wake: string | null
  verdict: string
  signupHref?: string
  variant?: 'landing' | 'app'
  embedded?: boolean
  /** Landing only — open clock → six doses → join flow immediately (after Free my melatonin). */
  autoStartOnboarding?: boolean
}

export function PatientTimingPlan({
  medCodes,
  medTimes = [],
  wake,
  verdict,
  signupHref = '/login',
  variant = 'landing',
  embedded = false,
  autoStartOnboarding = false,
}: PatientTimingPlanProps) {
  const [tab, setTab] = useState<PlanTab>('timing')
  const [openSection, setOpenSection] = useState<LandingAccordion>('risk')
  const [biobankOn, setBiobankOn] = useState(false)
  const [phenotypeOn, setPhenotypeOn] = useState(true)
  const [timingPatternsOn, setTimingPatternsOn] = useState(true)
  const [scoreHistoryOn, setScoreHistoryOn] = useState(false)
  const [flowStep, setFlowStep] = useState<PatientPlanFlowStep>(
    autoStartOnboarding && variant === 'landing' ? 1 : 0
  )
  const profile = usePatientPlanProfile(wake)

  const meds = useMemo(() => resolvePolyPlanMeds(medCodes), [medCodes])
  const takeTimes = useMemo(
    () => buildTakeTimeMap(medCodes, medTimes),
    [medCodes, medTimes]
  )

  const wakeClock =
    (variant === 'landing' ? wake : profile.wake)?.slice(0, 5) ?? PATIENT_LANDING_DEMO.wake
  const melatoninProfile = useMemo(
    () => buildPatientMelatoninProfile(wakeClock, medCodes, medTimes),
    [wakeClock, medCodes, medTimes]
  )
  const bodyClockScore = useMemo(
    () => bodyClockScoreFromProfile(melatoninProfile),
    [melatoninProfile]
  )
  const bodyClock = useMemo(
    () => inferLandingBodyClock(variant === 'landing' ? wake : profile.wake, medTimes),
    [variant, wake, profile.wake, medTimes]
  )
  const doseSchedule = useMemo(
    () => buildSixDoseStrip(bodyClock.dlmoEstimateHours),
    [bodyClock.dlmoEstimateHours]
  )
  const activeBcaTier = useMemo(() => resolveBcaEducationTier(bodyClockScore), [bodyClockScore])
  const bcaTone = bcaTierTone(bodyClockScore)

  const syncedCount = meds.filter((m) => syncStateForRisk(m.meta.risk) === 'synced').length
  const reviewCount = meds.length - syncedCount
  const chronoTestHref = useMemo(
    () =>
      buildPersonalTimingPath({
        medCodes,
        medTimes: medTimes.length ? medTimes : undefined,
        wake: profile.wake ?? undefined,
      }),
    [medCodes, medTimes, profile.wake]
  )

  const timingPanelProps = {
    meds,
    takeTimes,
    verdict,
    syncedCount,
    reviewCount,
  }

  function PlanFooterCta({ className }: { className?: string }) {
    if (variant === 'landing') {
      return <PatientPlanNextStepsEntry onStart={() => setFlowStep(1)} />
    }

    return (
      <div className={marketingCtaClass(className)}>
        <Link href={chronoTestHref} className="seco-landing__btn seco-landing__btn--primary">
          {DEEPDOSE_PATIENT_PLAN_PERSONAL_BRIDGE.appCta.label}
        </Link>
      </div>
    )
  }

  const profileHeader = (
    <PatientPlanProfileHeader
      firstName={profile.firstName}
      onFirstNameChange={profile.setFirstName}
      familyName={profile.familyName}
      onFamilyNameChange={profile.setFamilyName}
      avatarUrl={profile.avatarUrl}
      onAvatarChange={profile.setAvatarUrl}
      wake={profile.wake}
      onWakeChange={profile.setWake}
      medCount={meds.length}
      variant={variant === 'app' ? 'app' : 'landing'}
    />
  )

  if (variant === 'app') {
    const content = (
      <div className="patient-dash__plan">
        <div className="patient-dash__plan-surface">
          {profileHeader}

          <div
            className="patient-dash__tabs patient-dash__tabs--three"
            role="tablist"
            aria-label="Plan views"
          >
          {APP_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={cn('patient-dash__tab', tab === item.id && 'patient-dash__tab--active')}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'timing' && (
          <PatientPlanTimingPanel {...timingPanelProps} variant="app" />
        )}

        {tab === 'dosing' && (
          <PatientPlanDosingPanel
            meds={meds}
            wake={profile.wake}
            takeTimes={takeTimes}
            variant="app"
          />
        )}

        {tab === 'sharing' && (
          <ul className="patient-dash__share-list">
            {DEEPDOSE_PATIENT_PLAN_SHARING.items.map((item) => (
              <li key={item.href + item.title} className="patient-dash__share-row">
                {item.href === '/chronobiobank' ? (
                  <button
                    type="button"
                    className="patient-dash__share-toggle"
                    onClick={() => setBiobankOn((prev) => !prev)}
                    aria-pressed={biobankOn}
                  >
                    <span
                      className={cn(
                        'patient-dash__share-switch',
                        biobankOn && 'patient-dash__share-switch--on'
                      )}
                      aria-hidden
                    >
                      <span className="patient-dash__share-switch-knob" />
                    </span>
                    <span>
                      <p className="patient-dash__share-title">{item.title}</p>
                      <p className="patient-dash__share-meta">{item.meta}</p>
                    </span>
                  </button>
                ) : (
                  <>
                    <p className="patient-dash__share-title">{item.title}</p>
                    <p className="patient-dash__share-meta">{item.meta}</p>
                    <Link
                      href={resolveSharingHref(item.href, signupHref)}
                      className="patient-dash__share-link"
                    >
                      {DEEPDOSE_PATIENT_PLAN_SHARING.linkLabel}
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        </div>
        <PlanFooterCta />
      </div>
    )

    if (embedded) {
      return content
    }

    return <div className="patient-dash">{content}</div>
  }


  if (flowStep > 0) {
    return (
      <PatientPlanNextStepsFlow
        step={flowStep}
        setStep={setFlowStep}
        wake={profile.wake}
        medTimes={medTimes}
        signupHref={signupHref}
      />
    )
  }

  const dataPointCount = Math.max(48, medCodes.length * 31 + 120)
  const anchorGapMin = Math.max(
    8,
    Math.abs(melatoninProfile.suppressionDeltaMin) > 0 ? 12 : 8
  )

  return (
    <div className="seco-hero-tabs seco-hero-tabs--patient-plan seco-hero-tabs--patient-accordion">
      {LANDING_ACCORDION.map((section, index) => {
        const isOpen = openSection === section.id
        return (
          <div
            key={section.id}
            className={cn('seco-hero-tabs__stack seco-reveal', `seco-reveal--${index + 1}`)}
          >
            <button
              type="button"
              className={cn('seco-hero-tabs__tab', isOpen && 'seco-hero-tabs__tab--active')}
              aria-expanded={isOpen}
              id={`patient-plan-tab-${section.id}`}
              aria-controls={`patient-plan-panel-${section.id}`}
              onClick={() => setOpenSection(section.id)}
            >
              <span
                className={cn('seco-hero-tabs__icon', `seco-hero-tabs__icon--${section.tone}`)}
                aria-hidden
              >
                <AccordionIcon section={section.id} />
              </span>
              <span className="seco-hero-tabs__copy">
                <span className="seco-hero-tabs__label">{section.label}</span>
                <span className="seco-hero-tabs__body">{section.body}</span>
              </span>
              <span
                className={cn('seco-hero-tabs__chevron', isOpen && 'seco-hero-tabs__chevron--open')}
                aria-hidden
              />
            </button>

            {isOpen && (
              <div
                id={`patient-plan-panel-${section.id}`}
                className="seco-hero-tabs__panel"
                role="region"
                aria-labelledby={`patient-plan-tab-${section.id}`}
              >
                <div className="seco-hero-tabs__panel-inner">
                  {section.id === 'risk' && (
                    <div className="seco-dashpreview seco-dashpreview--chrono">
                      <div className="seco-dashpreview__main">
                        <div className="seco-dashpreview__top">
                          <div className="seco-dashpreview__id">
                            <span className="seco-dashpreview__avatar" aria-hidden />
                            <div className="seco-dashpreview__profile">
                              <p className="seco-dashpreview__name-row">
                                <span className="seco-dashpreview__name">
                                  {PATIENT_LANDING_DEMO.firstName} {PATIENT_LANDING_DEMO.familyName}
                                </span>
                                <span className="seco-dashpreview__profile-age">34</span>
                              </p>
                              <div className="seco-dashpreview__profile-detail">
                                <span className="seco-dashpreview__profile-location">
                                  {PATIENT_LANDING_DEMO.patientId}
                                </span>
                                <span className="seco-dashpreview__profile-date">
                                  Wake {wakeClock}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="seco-dashpreview__hero seco-dashpreview__hero--stack">
                          <div className="seco-dashpreview__dial-block">
                            <h3 className="seco-dashpreview__metric-title">Body clock alignment</h3>

                            <div className="seco-dashpreview__metric-card seco-dashpreview__anchor-panel">
                              <p className="seco-dashpreview__anchor-result">
                                {bodyClockResultStatement(bodyClockScore)}
                              </p>
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
                                  <span className="seco-dashpreview__anchor-time">
                                    {melatoninProfile.adjustedDlmoLabel}
                                  </span>
                                  <span className="seco-dashpreview__anchor-label">
                                    {BODY_CLOCK_ANCHOR_COMPARE.brainLabel}
                                  </span>
                                  <span className="seco-dashpreview__anchor-hint">
                                    {BODY_CLOCK_ANCHOR_COMPARE.brainHint}
                                  </span>
                                </div>
                                <div className="seco-dashpreview__anchor-bridge">
                                  <span className="seco-dashpreview__anchor-line" />
                                  <span className="seco-dashpreview__anchor-gap">
                                    {BODY_CLOCK_ANCHOR_COMPARE.gapLabel(anchorGapMin)}
                                  </span>
                                  <span className="seco-dashpreview__anchor-line" />
                                </div>
                                <div className="seco-dashpreview__anchor-node seco-dashpreview__anchor-node--target">
                                  <span className="seco-dashpreview__anchor-icon seco-dashpreview__anchor-icon--blackout">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                      <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
                                    </svg>
                                  </span>
                                  <span className="seco-dashpreview__anchor-time">
                                    {bodyClock.sleepTargetLabel}
                                  </span>
                                  <span className="seco-dashpreview__anchor-label">
                                    {BODY_CLOCK_ANCHOR_COMPARE.habitLabel}
                                  </span>
                                  <span className="seco-dashpreview__anchor-hint">
                                    {BODY_CLOCK_ANCHOR_COMPARE.habitHint}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="seco-dashpreview__metric-card seco-dashpreview__bca-panel">
                              <div className="seco-dashpreview__bca-intro">
                                <div className="seco-dashpreview__bca-head">
                                  <p className="seco-dashpreview__bca-score">
                                    {bodyClockScore}
                                    <span className="seco-dashpreview__bca-score-max">/100</span>
                                  </p>
                                  <span
                                    className={cn(
                                      'seco-dashpreview__tier-pill',
                                      `seco-dashpreview__tier-pill--${bcaTone}`
                                    )}
                                  >
                                    {bcaTierLabel(bodyClockScore)}
                                  </span>
                                </div>
                                <p className="seco-plan-tile__sync-caption">
                                  L1 estimate · 40% confidence
                                </p>
                              </div>
                              <div className="seco-dashpreview__bca-scale" aria-hidden="true">
                                <span className="seco-dashpreview__bca-scale-track" />
                                <span
                                  className="seco-dashpreview__bca-scale-thumb"
                                  style={{ left: `${bodyClockScore}%` }}
                                />
                              </div>
                              <div className="seco-dashpreview__bca-states">
                                {BCA_EDUCATION_TIERS.map((tier) => (
                                  <div
                                    key={tier.id}
                                    className={cn(
                                      'seco-dashpreview__bca-state',
                                      `seco-dashpreview__bca-state--${tier.id}`,
                                      tier.id === activeBcaTier.id && 'seco-dashpreview__bca-state--active'
                                    )}
                                  >
                                    <span className="seco-dashpreview__bca-state-icon">
                                      {BCA_STATE_ICONS[tier.id]}
                                    </span>
                                    <span className="seco-dashpreview__bca-state-label">
                                      {tier.shortLabel}
                                    </span>
                                    <span className="seco-dashpreview__bca-state-range">
                                      {tier.rangeLabel}
                                    </span>
                                    <span className="seco-dashpreview__bca-state-def">
                                      <span>{tier.definitionLines[0]}</span>
                                      <span>{tier.definitionLines[1]}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <MelatoninCurveInline profile={melatoninProfile} />

                            <ul className="seco-dashpreview__stats">
                              <li className="seco-dashpreview__stat">
                                <span className="seco-dashpreview__stat-label">Melatonin onset</span>
                                <span className="seco-dashpreview__stat-value font-mono tabular-nums">
                                  {melatoninProfile.adjustedDlmoLabel}
                                </span>
                              </li>
                              <li className="seco-dashpreview__stat">
                                <span className="seco-dashpreview__stat-label">Suppression delta</span>
                                <span className="seco-dashpreview__stat-value font-mono tabular-nums seco-dashpreview__stat-value--danger">
                                  {melatoninProfile.suppressionDeltaMin} min
                                </span>
                              </li>
                            </ul>

                            {melatoninProfile.interferenceTags.length > 0 && (
                              <div className="seco-plan-tile__chips" role="list">
                                {melatoninProfile.interferenceTags.map((tag) => (
                                  <span
                                    key={tag.label}
                                    className={cn(
                                      'seco-plan-tile__chip',
                                      tag.tone === 'red'
                                        ? 'seco-plan-tile__chip--review'
                                        : 'seco-plan-tile__chip--review'
                                    )}
                                    role="listitem"
                                  >
                                    {tag.label}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="dios-callout dios-callout--info">
                              <p>
                                Improve your confidence —{' '}
                                <Link href="/home-test" className="seco-hero-tabs__panel-link">
                                  order your test kit
                                </Link>
                              </p>
                              <p className="seco-plan-tile__sync-caption">
                                L2 blood panel (65%) · L3 TipTraQ (90%)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'meds' && (
                    <ol className="seco-plan-tile-stack">
                      {melatoninProfile.medDots.map((med) => {
                        const sync = medSyncFromRisk(med.risk)
                        return (
                          <li
                            key={med.code}
                            className={cn(
                              'seco-plan-tile',
                              'seco-plan-tile--med',
                              `seco-plan-tile--med-${sync}`
                            )}
                          >
                            <span
                              className={cn(
                                'seco-plan-tile__accent',
                                sync === 'synced' && 'seco-plan-tile__accent--synced',
                                sync === 'review' && 'seco-plan-tile__accent--review',
                                sync === 'conflict' && 'seco-plan-tile__accent--conflict'
                              )}
                              aria-hidden
                            />
                            <div className="seco-plan-tile__med-body">
                              <div className="seco-plan-tile__med-top">
                                <p className="seco-plan-tile__med-name">{med.displayName}</p>
                                <span
                                  className={cn(
                                    'seco-plan-tile__pill',
                                    `seco-plan-tile__pill--${sync}`
                                  )}
                                >
                                  {med.riskLabel}
                                </span>
                              </div>
                              <p className="seco-plan-tile__med-window">
                                {med.takeTime}
                                <span aria-hidden> · </span>
                                optimal {med.optimalWindow}
                              </p>
                              <p className="seco-plan-tile__med-action">
                                Recommended{' '}
                                <span className="font-mono tabular-nums">
                                  {recommendedTakeTime(med.optimalWindow, wakeClock)}
                                </span>
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  )}

                  {section.id === 'doses' && (
                    <>
                      <SixDosePlanPreview
                        doses={doseSchedule}
                        dlmoLabel={melatoninProfile.adjustedDlmoLabel}
                      />
                      <div className={marketingCtaClass()}>
                        <Link href={signupHref} className="seco-landing__btn seco-landing__btn--primary">
                          Start my protocol
                        </Link>
                      </div>
                    </>
                  )}

                  {section.id === 'data' && (
                    <>
                      <ul className="seco-dashpreview__stats">
                        <li className="seco-dashpreview__stat">
                          <span className="seco-dashpreview__stat-label">Data points contributed</span>
                          <span className="seco-dashpreview__stat-value">
                            {dataPointCount.toLocaleString()}
                          </span>
                        </li>
                        <li className="seco-dashpreview__stat">
                          <span className="seco-dashpreview__stat-label">Days on platform</span>
                          <span className="seco-dashpreview__stat-value">14</span>
                        </li>
                        <li className="seco-dashpreview__stat">
                          <span className="seco-dashpreview__stat-label">Research requests received</span>
                          <span className="seco-dashpreview__stat-value">0</span>
                        </li>
                      </ul>

                      <ul className="seco-plan-tile-stack">
                        {[
                          {
                            title: 'Anonymous circadian phenotype data',
                            meta: 'Shared with Chronobiobank',
                            on: phenotypeOn,
                            toggle: () => setPhenotypeOn((v) => !v),
                          },
                          {
                            title: 'Medication timing patterns',
                            meta: 'Shared with researchers',
                            on: timingPatternsOn,
                            toggle: () => setTimingPatternsOn((v) => !v),
                          },
                          {
                            title: 'Body Clock Score history',
                            meta: 'Private',
                            on: scoreHistoryOn,
                            toggle: () => setScoreHistoryOn((v) => !v),
                          },
                        ].map((row) => (
                          <li key={row.title} className="seco-plan-tile">
                            <button
                              type="button"
                              className="seco-plan-tile__med-body w-full border-0 bg-transparent p-0 text-left"
                              onClick={row.toggle}
                              aria-pressed={row.on}
                            >
                              <div className="seco-plan-tile__med-top">
                                <p className="seco-plan-tile__med-name">{row.title}</p>
                                <span
                                  className={cn(
                                    'seco-plan-tile__pill',
                                    row.on ? 'seco-plan-tile__pill--synced' : 'seco-plan-tile__pill--review'
                                  )}
                                >
                                  {row.on ? 'On' : 'Off'}
                                </span>
                              </div>
                              <p className="seco-plan-tile__med-window">{row.meta}</p>
                            </button>
                          </li>
                        ))}
                      </ul>

                      <p className="seco-plan-tile__sync-caption">
                        You own your data. Researchers request access. You decide.
                      </p>
                      <Link href="/chronobiobank" className="seco-hero-tabs__panel-link">
                        Full data terms →
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
