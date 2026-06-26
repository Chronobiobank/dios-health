'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import { PATIENT_SLEEP_WAKE_DASH } from '@/lib/deepdose-marketing/landing-content'
import { resolvePolyPlanMeds, syncStateForRisk, SYNC_LABEL } from '@/lib/medications/poly-plan-meds'
import { VERDICT_LABEL, worstRiskForMedCodes, type RiskLevel } from '@/lib/medications/polypharmacy-timing'
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

function verdictTone(risk: RiskLevel): 'good' | 'mid' | 'low' {
  if (risk === 'low') return 'good'
  if (risk === 'medium') return 'mid'
  return 'low'
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
  const takeTimes = useMemo(() => buildTakeTimeMap(medCodes, medTimes), [medCodes, medTimes])
  const verdictRisk = useMemo(() => worstRiskForMedCodes(medCodes), [medCodes])

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
  const vTone = verdictTone(verdictRisk)

  return (
    <div className="sw-dash">
      <header className="sw-dash__header">
        <p className="sw-dash__date">{todayLabel}</p>
        <h1 className="sw-dash__title">{PATIENT_SLEEP_WAKE_DASH.title}</h1>
        <p className="sw-dash__subtitle">{PATIENT_SLEEP_WAKE_DASH.subtitle}</p>
      </header>

      <p className={cn('sw-glass sw-dash__verdict', `sw-dash__verdict--${vTone}`)}>{VERDICT_LABEL[verdictRisk]}</p>

      <div className="sw-dash__anchors">
        <article className="sw-glass sw-dash__anchor">
          <span className="sw-dash__anchor-icon" aria-hidden>
            🌙
          </span>
          <p className="sw-dash__anchor-label">{PATIENT_SLEEP_WAKE_DASH.sleepLabel}</p>
          <p className="sw-dash__anchor-time font-mono tabular-nums">{bodyClock.sleepOnsetLabel}</p>
          <p className="sw-dash__anchor-hint">Target wind-down</p>
        </article>
        <article className="sw-glass sw-dash__anchor">
          <span className="sw-dash__anchor-icon" aria-hidden>
            ☀️
          </span>
          <p className="sw-dash__anchor-label">{PATIENT_SLEEP_WAKE_DASH.wakeLabel}</p>
          <p className="sw-dash__anchor-time font-mono tabular-nums">{bodyClock.wakeLabel}</p>
          <p className="sw-dash__anchor-hint">Morning anchor</p>
        </article>
      </div>

      <article className="sw-glass sw-dash__score" aria-label={`${PATIENT_SLEEP_WAKE_DASH.scoreLabel} ${regularityScore} out of 100`}>
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
          <p className="sw-dash__score-label">{PATIENT_SLEEP_WAKE_DASH.scoreLabel}</p>
          <p className={cn('sw-dash__score-status', `sw-dash__score-status--${regTone}`)}>
            {regularityLabel(regularityScore)}
          </p>
          <p className="sw-dash__score-note">{bodyClock.chronotypeHint}</p>
        </div>
      </article>

      <section className="sw-dash__meds" aria-labelledby="sw-dash-meds-title">
        <h2 id="sw-dash-meds-title" className="sw-dash__section-title">
          {PATIENT_SLEEP_WAKE_DASH.medsTitle}
        </h2>
        <ul className="sw-dash__med-list">
          {meds.map((med) => {
            const sync = syncStateForRisk(med.meta.risk)
            const takeTime = takeTimes[med.code] ?? '—'
            return (
              <li key={med.code} className={cn('sw-glass sw-dash__med', `sw-dash__med--${sync}`)}>
                <span className={cn('sw-dash__med-dot', `sw-dash__med-dot--${sync}`)} aria-hidden />
                <div className="sw-dash__med-body">
                  <div className="sw-dash__med-top">
                    <p className="sw-dash__med-name">{med.name}</p>
                    <span className={cn('sw-dash__med-pill', `sw-dash__med-pill--${sync}`)}>
                      {SYNC_LABEL[sync]}
                    </span>
                  </div>
                  <p className="sw-dash__med-time font-mono tabular-nums">
                    Now {takeTime}
                    <span aria-hidden> · </span>
                    Best {med.meta.window}
                  </p>
                  <p className="sw-dash__med-fix">{med.meta.instruction}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <div className={marketingCtaClass('sw-dash__cta')}>
        <Link href={signupHref} className="sw-dash__cta-btn">
          {PATIENT_SLEEP_WAKE_DASH.cta}
        </Link>
        <p className="sw-dash__cta-note">{PATIENT_SLEEP_WAKE_DASH.ctaNote}</p>
      </div>
    </div>
  )
}
