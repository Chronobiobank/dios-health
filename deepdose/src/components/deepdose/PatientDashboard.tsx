'use client'

import { useState } from 'react'
import Link from 'next/link'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { PatientTimingPlan } from '@/components/deepdose/PatientTimingPlan'
import { verdictForMedCodes } from '@/lib/medications/polypharmacy-timing'

interface PatientDashboardProps {
  medCodes: string[]
  wake: string
}

export function PatientDashboard({ medCodes, wake }: PatientDashboardProps) {
  const [gateOpen, setGateOpen] = useState(true)
  const verdict = verdictForMedCodes(medCodes)

  return (
    <>
      {gateOpen && (
        <div className="patient-dash__gate">
          <div className="patient-dash__gate-card">
            <h2 className="patient-dash__gate-title">Save your plan</h2>
            <p className="patient-dash__gate-body">
              Create a free account to keep your timing plan, get reminders, and share it with your GP.
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
        <Link href="/" aria-label="Deepdose home" className="patient-dash__nav-logo no-underline">
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

      <div className="patient-dash">
        <PatientTimingPlan
          variant="app"
          embedded
          medCodes={medCodes}
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
              Decision support only. Deepdose does not prescribe. Your GP makes every treatment
              decision.
            </p>
            <p className="patient-dash__legal">
              Deepdose Ltd · Registered in England and Wales · Company number 17294916
            </p>
          </div>
        </details>
      </div>
    </>
  )
}
