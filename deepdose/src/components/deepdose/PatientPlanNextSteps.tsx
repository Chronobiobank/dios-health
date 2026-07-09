'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_PLAN_NEXT_STEPS } from '@/lib/deepdose-marketing/landing-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import {
  buildOnboardingDoseSchedule,
  inferLandingBodyClock,
  type OnboardingDoseItem,
} from '@/lib/patient/infer-landing-body-clock'
import { buildLandingRiskAnalysis } from '@/lib/patient/landing-risk-analysis'
import { cn } from '@/lib/utils/cn'

const DOSE_ICONS: Record<string, string> = {
  light: '☀️',
  meals: '🍽️',
  meds: '💊',
  exercise: '🏃',
  cognition: '🧠',
  sleep: '🌙',
}

export type PatientPlanFlowStep = 0 | 1 | 2 | 3

type FlowProps = {
  wake: string | null
  medTimes: string[]
  signupHref: string
}

type PanelProps = Pick<FlowProps, 'wake' | 'medTimes'>

function StepLadder({ current }: { current: PatientPlanFlowStep }) {
  const copy = DEEPDOSE_PLAN_NEXT_STEPS

  return (
    <div className="seco-dashpreview__ladder">
      <div className="seco-dashpreview__ladder-row">
        <p className="seco-dashpreview__ladder-title">Your path into {DEEPDOSE_NAME}</p>
        <ol className="seco-dashpreview__ladder-steps">
          {copy.steps.map((label, index) => {
            const stepNum = (index + 1) as PatientPlanFlowStep
            const done = current > stepNum
            const active = current === stepNum
            return (
              <li
                key={label}
                className={cn(
                  'seco-dashpreview__ladder-step',
                  done && 'seco-dashpreview__ladder-step--done',
                  active && 'seco-dashpreview__ladder-step--current'
                )}
              >
                <span className="seco-dashpreview__ladder-mark" aria-hidden>
                  {done ? '✓' : active ? '●' : '○'}
                </span>
                <span className="seco-dashpreview__ladder-label">{label}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function ClockRevealPanel({ wake, medTimes }: PanelProps) {
  const copy = DEEPDOSE_PLAN_NEXT_STEPS.clock
  const profile = useMemo(() => inferLandingBodyClock(wake, medTimes), [wake, medTimes])
  const risk = useMemo(
    () => buildLandingRiskAnalysis({ medCodes: [], medTimes, wake }),
    [medTimes, wake]
  )

  return (
    <div className="seco-landing__copy-stack">
      <p className="seco-page__eyebrow">{copy.eyebrow}</p>
      <h2 className="seco-landing__section-title">{copy.headline}</h2>
      <p className="seco-landing__support">{copy.support}</p>
      <p className="seco-landing__support seco-landing__personalise">{profile.profileLine}</p>

      <div className="seco-dashpreview seco-dashpreview--chrono">
        <div className="seco-dashpreview__main">
          <ul className="seco-dashpreview__stats">
            <li className="seco-dashpreview__stat">
              <span className="seco-dashpreview__stat-label">{copy.stats.sri}</span>
              <span className="seco-dashpreview__stat-value font-mono tabular-nums">
                {risk.sriProxy}/100
              </span>
            </li>
            <li className="seco-dashpreview__stat">
              <span className="seco-dashpreview__stat-label">{copy.stats.wake}</span>
              <span className="seco-dashpreview__stat-value font-mono tabular-nums">
                {profile.wakeLabel}
              </span>
            </li>
            <li className="seco-dashpreview__stat">
              <span className="seco-dashpreview__stat-label">{copy.stats.sleep}</span>
              <span className="seco-dashpreview__stat-value font-mono tabular-nums">
                {profile.sleepTargetLabel}
              </span>
            </li>
            <li className="seco-dashpreview__stat">
              <span className="seco-dashpreview__stat-label">{copy.stats.chronotype}</span>
              <span className="seco-dashpreview__stat-value">{profile.chronotypeHint}</span>
            </li>
          </ul>
        </div>
      </div>

      <p className="seco-planpreview__phase">{copy.note}</p>
    </div>
  )
}

function DoseRow({ item }: { item: OnboardingDoseItem }) {
  return (
    <li className="flex gap-4 p-5 md:p-6">
      <span className="dios-icon-chip h-10 w-10 shrink-0 text-lg" aria-hidden="true">
        {DOSE_ICONS[item.id] ?? '◦'}
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="font-medium text-ink">{item.label}</p>
        <p className="font-mono text-lg tracking-tight text-ink">{item.timeLabel}</p>
        <p className="text-sm text-ink-muted">{item.instruction}</p>
      </div>
    </li>
  )
}

function DoseProtocolPanel({ wake, medTimes }: PanelProps) {
  const copy = DEEPDOSE_PLAN_NEXT_STEPS.doses
  const doses = useMemo(() => {
    const profile = inferLandingBodyClock(wake, medTimes)
    return buildOnboardingDoseSchedule(profile.dlmoEstimateHours)
  }, [wake, medTimes])

  return (
    <div className="seco-landing__copy-stack">
      <p className="seco-page__eyebrow">{copy.eyebrow}</p>
      <h2 className="seco-landing__section-title">{copy.headline}</h2>
      <p className="seco-landing__support">{copy.support}</p>
      <p className="mt-2 text-sm text-ink-muted">{copy.education}</p>

      <div className="seco-app-card overflow-hidden !p-0">
        <ul className="divide-y divide-border">
          {doses.map((item) => (
            <DoseRow key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function JoinDeepdosePanel({ signupHref }: { signupHref: string }) {
  const copy = DEEPDOSE_PLAN_NEXT_STEPS.join

  return (
    <div className="seco-landing__copy-stack">
      <p className="seco-page__eyebrow">{copy.eyebrow}</p>
      <h2 className="seco-landing__section-title">{copy.headline}</h2>
      <p className="seco-landing__support">{copy.support}</p>

      <section className="seco-body-clock-compare" aria-labelledby="join-deepdose-title">
        <div className="seco-body-clock-compare__grid">
          <article className="seco-body-clock-compare__col">
            <p className="seco-body-clock-compare__col-badge seco-body-clock-compare__col-badge--free">
              {copy.commons.figure}
            </p>
            <h3 id="join-deepdose-title" className="seco-body-clock-compare__col-title">
              {copy.commons.title}
            </h3>
            <ul className="seco-body-clock-compare__points">
              {copy.commons.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link href={signupHref} className="seco-landing__btn seco-landing__btn--primary">
              {copy.commons.cta.label} →
            </Link>
          </article>

          <div className="seco-body-clock-compare__arrow" aria-hidden="true">
            <span className="seco-body-clock-compare__arrow-line" />
            <span className="seco-body-clock-compare__arrow-label">Optional</span>
          </div>

          <article className="seco-body-clock-compare__col seco-body-clock-compare__col--clinical">
            <p className="seco-body-clock-compare__col-badge seco-body-clock-compare__col-badge--clinical">
              {copy.paid.figure}
            </p>
            <h3 className="seco-body-clock-compare__col-title">{copy.paid.title}</h3>
            <ul className="seco-body-clock-compare__points">
              {copy.paid.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link href={copy.paid.cta.href} className="seco-landing__btn seco-landing__btn--ghost">
              {copy.paid.cta.label}
            </Link>
          </article>
        </div>
      </section>

      <p className="seco-planpreview__phase">{copy.skip}</p>
    </div>
  )
}

export function PatientPlanNextStepsEntry({ onStart }: { onStart: () => void }) {
  return (
    <div className={marketingCtaClass()}>
      <button type="button" className="seco-landing__btn seco-landing__btn--primary" onClick={onStart}>
        {DEEPDOSE_PLAN_NEXT_STEPS.entryCta}
      </button>
    </div>
  )
}

export function PatientPlanNextStepsFlow({
  step,
  setStep,
  wake,
  medTimes,
  signupHref,
}: FlowProps & {
  step: PatientPlanFlowStep
  setStep: (step: PatientPlanFlowStep) => void
}) {
  const copy = DEEPDOSE_PLAN_NEXT_STEPS

  return (
    <div className="seco-hero-tabs seco-hero-tabs--patient-plan">
      <div className="seco-hero-tabs__panel">
        <div className="seco-hero-tabs__panel-inner">
          <StepLadder current={step} />
          {step === 1 ? <ClockRevealPanel wake={wake} medTimes={medTimes} /> : null}
          {step === 2 ? <DoseProtocolPanel wake={wake} medTimes={medTimes} /> : null}
          {step === 3 ? <JoinDeepdosePanel signupHref={signupHref} /> : null}

          {step < 3 ? (
            <div className="seco-landing__actions">
              <button
                type="button"
                className="seco-landing__btn seco-landing__btn--ghost"
                onClick={() => setStep(step === 1 ? 0 : ((step - 1) as PatientPlanFlowStep))}
              >
                {copy.backCta}
              </button>
              <button
                type="button"
                className="seco-landing__btn seco-landing__btn--primary"
                onClick={() => setStep((step + 1) as PatientPlanFlowStep)}
              >
                {copy.continueCta}
              </button>
            </div>
          ) : (
            <div className="seco-landing__actions">
              <button
                type="button"
                className="seco-landing__btn seco-landing__btn--ghost"
                onClick={() => setStep(2)}
              >
                {copy.backCta}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
