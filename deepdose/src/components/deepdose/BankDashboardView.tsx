'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import SriScoreRing from '@/components/shared/SriScoreRing'
import { SLEEP_SCORE } from '@/lib/brand/sleep-score'
import { computeScheduleSri } from '@/lib/circadian/sri-engine'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { DOSE_TAG_META, DOSE_TAGS } from '@/lib/patient/dose-uploads'
import { usePatientDoses } from '@/lib/patient/use-patient-doses'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
import { usePlanDraftContext } from '@/lib/patient/use-plan-draft-context'

export function BankDashboardView() {
  const { planContext, ready: draftReady } = usePlanDraftContext({
    signupHrefFromUrl: '/bank',
  })
  const profile = usePatientPlanProfile(planContext.wake)
  const { pillars, bankOptIn, setBankOptIn, todaySelf, ready } = usePatientDoses()

  const bodyClock = useMemo(
    () => inferLandingBodyClock(profile.wake, planContext.medTimes ?? []),
    [profile.wake, planContext.medTimes]
  )
  const sriResult = useMemo(
    () => computeScheduleSri(bodyClock.sleepOnsetLabel, bodyClock.wakeLabel),
    [bodyClock.sleepOnsetLabel, bodyClock.wakeLabel]
  )

  const tokens = bankOptIn ? 12 + todaySelf.length * 3 : 0

  if (!draftReady || !ready || !profile.ready) return null

  return (
    <div className="dd-bank">
      <div className="dd-bank__gauge">
        <SriScoreRing score={sriResult.score} />
        <p className="dd-bank__gauge-label">{SLEEP_SCORE.label}</p>
        <p className="dd-bank__gauge-hint">{SLEEP_SCORE.hint}</p>
      </div>

      <section className="dd-bank__pillars" aria-label="Today’s stack">
        <h2 className="dd-bank__section-title">Today</h2>
        <div className="dd-bank__timeline">
          {DOSE_TAGS.map((tag) => {
            const meta = DOSE_TAG_META[tag]
            const done = pillars?.[tag]
            return (
              <div
                key={tag}
                className={done ? 'dd-bank__slot dd-bank__slot--on' : 'dd-bank__slot'}
              >
                <span className="dd-bank__slot-hash" style={{ color: meta.cue }}>
                  {meta.hash}
                </span>
                <span className="dd-bank__slot-state">{done ? 'Done' : 'Open'}</span>
              </div>
            )
          })}
        </div>
        <Link href="/dose" className="dd-bank__log-link">
          Log dose
        </Link>
      </section>

      <section className="dd-bank__research">
        <div className="dd-bank__research-row">
          <div>
            <p className="dd-bank__section-title">Research Engine</p>
            <p className="dd-bank__research-copy">
              Stream anonymized packets to Chronobiobank.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={bankOptIn}
            className={
              bankOptIn ? 'dd-bank__toggle dd-bank__toggle--on' : 'dd-bank__toggle'
            }
            onClick={() => setBankOptIn(!bankOptIn)}
          >
            {bankOptIn ? 'On' : 'Off'}
          </button>
        </div>
        {bankOptIn ? (
          <p className="dd-bank__tokens tabular-nums">Tokens · {tokens}</p>
        ) : null}
      </section>

      <section className="dd-bank__clinical" aria-label="Clinical tools">
        <h2 className="dd-bank__section-title">Clinical</h2>
        <Link href="/dosage" className="dd-bank__clinical-link">
          <span className="dd-bank__clinical-title">Chemistry</span>
          <span className="dd-bank__clinical-meta">Stack timing & dosing windows</span>
        </Link>
        <Link href="/testkit" className="dd-bank__clinical-link">
          <span className="dd-bank__clinical-title">TipTraQ testkit</span>
          <span className="dd-bank__clinical-meta">3-night home sleep · apnea risk</span>
        </Link>
      </section>

      <Link href="/dosage" className="dd-bank__chem">
        All Chemistry tools
      </Link>
    </div>
  )
}
