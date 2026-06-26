'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import { PATIENT_SLEEP_WAKE_DASH } from '@/lib/deepdose-marketing/landing-content'
import {
  resolvePolyPlanMeds,
  syncStateForRisk,
  SYNC_LABEL,
} from '@/lib/medications/poly-plan-meds'
import { RISK_RANK } from '@/lib/medications/polypharmacy-timing'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { buildTakeTimeMap } from '@/lib/patient/plan-dose-preview'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { bodyClockScoreFromProfile, buildPatientMelatoninProfile } from '@/lib/patient/patient-landing-melatonin'
import { PATIENT_LANDING_DEMO } from '@/lib/patient/patient-landing-defaults'
import { cn } from '@/lib/utils/cn'

type PatientSleepWakeDashboardProps = {
  medCodes: string[]
  medTimes?: string[]
  wake: string | null
  signupHref: string
}

const TRIAGE_CLASS: Record<'synced' | 'review' | 'conflict', string> = {
  synced: 'dose-dash-triage--on-track',
  review: 'dose-dash-triage--attention',
  conflict: 'dose-dash-triage--review',
}

function regularityLabel(score: number): string {
  if (score >= 70) return 'On track'
  if (score >= 45) return 'Room to improve'
  return 'At risk'
}

function regularityTone(score: number): 'good' | 'mid' | 'low' {
  if (score >= 70) return 'good'
  if (score >= 45) return 'mid'
  return 'low'
}

function profileInitials(firstName: string, familyName: string): string {
  const first = firstName.trim().charAt(0)
  const family = familyName.trim().charAt(0)
  return `${first}${family}`.toUpperCase() || '?'
}

function sleepWakeInsight(meds: ReturnType<typeof resolvePolyPlanMeds>): {
  text: string
  tone: 'good' | 'mid' | 'low'
} {
  const conflicts = meds.filter((med) => syncStateForRisk(med.meta.risk) === 'conflict').length
  const reviews = meds.filter((med) => syncStateForRisk(med.meta.risk) === 'review').length

  if (conflicts > 0) {
    return {
      text:
        conflicts === 1
          ? '1 medicine is taken at the wrong time for your nights.'
          : `${conflicts} medicines are taken at the wrong time for your nights.`,
      tone: 'low',
    }
  }
  if (reviews > 0) {
    return {
      text:
        reviews === 1
          ? '1 dose could better protect your sleep–wake cycle — see below.'
          : `${reviews} doses could better protect your sleep–wake cycle — see below.`,
      tone: 'mid',
    }
  }
  return {
    text: 'Your medicines align with your sleep and wake times.',
    tone: 'good',
  }
}

export function PatientSleepWakeDashboard({
  medCodes,
  medTimes = [],
  wake,
  signupHref,
}: PatientSleepWakeDashboardProps) {
  const wakeClock = wake?.slice(0, 5) ?? PATIENT_LANDING_DEMO.wake
  const bodyClock = useMemo(
    () => inferLandingBodyClock(wake, medTimes),
    [wake, medTimes]
  )
  const melatoninProfile = useMemo(
    () => buildPatientMelatoninProfile(wakeClock, medCodes, medTimes),
    [wakeClock, medCodes, medTimes]
  )
  const regularityScore = useMemo(
    () => bodyClockScoreFromProfile(melatoninProfile),
    [melatoninProfile]
  )
  const meds = useMemo(() => resolvePolyPlanMeds(medCodes), [medCodes])
  const sortedMeds = useMemo(
    () => [...meds].sort((a, b) => RISK_RANK[b.meta.risk] - RISK_RANK[a.meta.risk]),
    [meds]
  )
  const takeTimes = useMemo(() => buildTakeTimeMap(medCodes, medTimes), [medCodes, medTimes])
  const insight = useMemo(() => sleepWakeInsight(meds), [meds])

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      }).format(new Date()),
    []
  )

  const regTone = regularityTone(regularityScore)
  const displayName = `${PATIENT_LANDING_DEMO.firstName} ${PATIENT_LANDING_DEMO.familyName}`

  return (
    <div className="sw-dash">
      <article className="dios-glass-outer sw-dash__profile">
        <div className="sw-dash__profile-top">
          <div className="dios-glass-inner sw-dash__avatar" aria-hidden>
            {profileInitials(PATIENT_LANDING_DEMO.firstName, PATIENT_LANDING_DEMO.familyName)}
          </div>
          <div className="sw-dash__profile-id">
            <p className="sw-dash__profile-name">{displayName}</p>
            <p className="sw-dash__eyebrow sw-dash__profile-date">{todayLabel}</p>
          </div>
        </div>
        <div className="sw-dash__profile-body">
          <h1 className="sw-dash__title">{PATIENT_SLEEP_WAKE_DASH.title}</h1>
          <p className="sw-dash__subtitle">{PATIENT_SLEEP_WAKE_DASH.subtitle}</p>
        </div>
        <p className={cn('dios-glass-inner sw-dash__insight', `sw-dash__insight--${insight.tone}`)}>
          {insight.text}
        </p>
      </article>

      <div className="sw-dash__anchors">
        <article className="dios-glass-outer sw-dash__anchor">
          <span className="sw-dash__anchor-icon" aria-hidden>
            🌙
          </span>
          <p className="sw-dash__eyebrow sw-dash__anchor-label">{PATIENT_SLEEP_WAKE_DASH.sleepLabel}</p>
          <p className="sw-dash__anchor-time font-mono tabular-nums">{bodyClock.sleepOnsetLabel}</p>
          <p className="sw-dash__anchor-hint">Target wind-down</p>
        </article>
        <article className="dios-glass-outer sw-dash__anchor">
          <span className="sw-dash__anchor-icon" aria-hidden>
            ☀️
          </span>
          <p className="sw-dash__eyebrow sw-dash__anchor-label">{PATIENT_SLEEP_WAKE_DASH.wakeLabel}</p>
          <p className="sw-dash__anchor-time font-mono tabular-nums">{bodyClock.wakeLabel}</p>
          <p className="sw-dash__anchor-hint">Morning anchor</p>
        </article>
      </div>

      <article
        className="dios-glass-outer sw-dash__score"
        aria-label={`${PATIENT_SLEEP_WAKE_DASH.scoreLabel} ${regularityScore} out of 100`}
      >
        <div className="sw-dash__score-ring" data-tone={regTone}>
          <svg viewBox="0 0 120 120" className="sw-dash__score-svg" aria-hidden>
            <circle className="sw-dash__score-track" cx="60" cy="60" r="52" />
            <circle
              className="sw-dash__score-fill"
              cx="60"
              cy="60"
              r="52"
              strokeDasharray={`${(regularityScore / 100) * 327} 327`}
            />
          </svg>
          <div className="sw-dash__score-center">
            <span className="sw-dash__score-value">{regularityScore}</span>
            <span className="sw-dash__score-max">/100</span>
          </div>
        </div>
        <div className="sw-dash__score-copy">
          <p className="sw-dash__eyebrow">{PATIENT_SLEEP_WAKE_DASH.scoreLabel}</p>
          <p className={cn('sw-dash__score-status', `sw-dash__score-status--${regTone}`)}>
            {regularityLabel(regularityScore)}
          </p>
          <p className="sw-dash__score-note">{bodyClock.chronotypeHint}</p>
        </div>
      </article>

      <article className="dios-glass-outer sw-dash__panel" aria-labelledby="sw-dash-meds-title">
        <p id="sw-dash-meds-title" className="sw-dash__eyebrow">
          {PATIENT_SLEEP_WAKE_DASH.medsTitle}
        </p>
        <ol className="sw-dash__med-stack">
          {sortedMeds.map((med) => {
            const sync = syncStateForRisk(med.meta.risk)
            const takeTime = takeTimes[med.code]
            return (
              <li
                key={med.code}
                className={cn('dios-glass-inner sw-dash__med-row', `sw-dash__med-row--${sync}`)}
              >
                <div className="sw-dash__med-head">
                  <p className="dash-med-row__name">{med.name}</p>
                  <span className={cn('dose-dash-triage', TRIAGE_CLASS[sync])}>
                    {SYNC_LABEL[sync]}
                  </span>
                </div>
                <p className="dash-med-row__meta">
                  {takeTime ? (
                    <>
                      You take at{' '}
                      <span className="font-mono tabular-nums">{takeTime}</span>
                      <span aria-hidden> · </span>
                    </>
                  ) : null}
                  {med.meta.timing}
                  <span aria-hidden> · </span>
                  {med.meta.window}
                </p>
                <p className="sw-dash__med-action">{med.meta.instruction}</p>
              </li>
            )
          })}
        </ol>
      </article>

      <div className={marketingCtaClass('sw-dash__cta')}>
        <Link href={signupHref} className="sw-dash__cta-btn">
          {PATIENT_SLEEP_WAKE_DASH.cta}
        </Link>
        <p className="sw-dash__cta-note">{PATIENT_SLEEP_WAKE_DASH.ctaNote}</p>
      </div>
    </div>
  )
}
