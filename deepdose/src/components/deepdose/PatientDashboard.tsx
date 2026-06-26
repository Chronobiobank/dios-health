'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DEEPDOSE_REGISTRATION_LINE } from '@/lib/brand/deepdose-brand'
import { PatientTimingPlan } from '@/components/deepdose/PatientTimingPlan'
import { CommunityMatchesPanel } from '@/components/patient/CommunityMatchesPanel'
import { CommunityStoryFeed } from '@/components/patient/CommunityStoryFeed'
import { SixDoseStrip } from '@/components/patient/SixDoseStrip'
import { verdictForMedCodes } from '@/lib/medications/polypharmacy-timing'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'

interface PatientDashboardProps {
  medCodes: string[]
  medTimes?: string[]
  wake: string
}

export function PatientDashboard({ medCodes, medTimes = [], wake }: PatientDashboardProps) {
  const [gateOpen, setGateOpen] = useState(true)
  const verdict = verdictForMedCodes(medCodes)
  const bodyClock = useMemo(
    () => inferLandingBodyClock(wake, medTimes),
    [wake, medTimes]
  )

  return (
    <>
      {gateOpen && (
        <div className="patient-dash__gate">
          <div className="patient-dash__gate-card">
            <h2 className="patient-dash__gate-title">Join Commons — free</h2>
            <p className="patient-dash__gate-body">
              Save your six-dose protocol, find people on your rhythm, and keep your timing plan.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              className="patient-dash__gate-email"
              aria-label="Email address"
            />
            <button
              type="button"
              className="dios-btn-primary patient-dash__gate-submit"
              onClick={() => setGateOpen(false)}
            >
              Save my plan — it&apos;s free
            </button>
            <button
              type="button"
              className="patient-dash__gate-skip"
              onClick={() => setGateOpen(false)}
            >
              Skip for now — show my plan
            </button>
          </div>
        </div>
      )}

      <nav className="patient-dash__nav">
        <Link href="/" aria-label="Unmed home" className="patient-dash__nav-logo no-underline">
          <DeepdoseWordmark />
        </Link>
        <button
          type="button"
          className="dios-btn-secondary text-sm py-2 px-4"
          onClick={() => setGateOpen(true)}
        >
          Save my plan
        </button>
      </nav>

      <div className="patient-dash space-y-8">
        <div className="patient-dash__plan-surface">
          <SixDoseStrip dlmoEstimateHours={bodyClock.dlmoEstimateHours} variant="app" />
        </div>

        <CommunityMatchesPanel />
        <CommunityStoryFeed />

        <PatientTimingPlan
          variant="app"
          embedded
          medCodes={medCodes}
          medTimes={medTimes}
          wake={wake}
          verdict={verdict}
        />

        <details className="patient-dash__footnote">
          <summary>About your plan</summary>
          <div className="patient-dash__footnote-body">
            <p>
              Your timing plan is based on circadian medicine evidence including the Hygia Trial
              (19,084 patients), the TIME substudy (University of Dundee), and UK Biobank circadian
              data. Wake time: {wake}.
            </p>
            <p>
              Decision support only. Unmed does not prescribe. Your GP makes every treatment
              decision.
            </p>
            <p className="patient-dash__legal">{DEEPDOSE_REGISTRATION_LINE}</p>
          </div>
        </details>
      </div>
    </>
  )
}
