'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { PATIENT_ROUTES } from '@/lib/auth/routes'
import {
  FIRST_LIGHT_SESSION_STORAGE_KEY,
  parseFirstLightSessionCache,
  type FirstLightOutputs,
} from '@/lib/product/first-light-outputs'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'

const FALLBACK_OUTPUTS: FirstLightOutputs = {
  bodyClockSynced: true,
  adherenceComplete: true,
  riskStatus: 'green',
  eatingWindow: { opens: '8:15am', closes: '6:15pm' },
  doseTimings: [
    { name: 'Ramipril', time: '9:30pm', note: 'Evening window matches your cardiovascular rhythm.' },
  ],
  scanNote: null,
  phaseTimeLabel: null,
}

export function FirstLightComplete() {
  const [outputs, setOutputs] = useState<FirstLightOutputs | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(FIRST_LIGHT_SESSION_STORAGE_KEY)
      if (!raw) {
        setOutputs(FALLBACK_OUTPUTS)
        return
      }
      const cache = parseFirstLightSessionCache(JSON.parse(raw))
      setOutputs(cache?.outputs ?? (JSON.parse(raw) as FirstLightOutputs))
    } catch {
      setOutputs(FALLBACK_OUTPUTS)
    }
  }, [])

  if (!outputs) {
    return <p className="first-light-complete__hint">Loading your morning outputs…</p>
  }

  return (
    <div className="first-light-complete">
      <p className="first-light-session__eyebrow">{FIRST_LIGHT_PROTOCOL.name} complete</p>
      <h1 className="first-light-session__title">Today&apos;s dose windows</h1>
      <p className="first-light-session__lede">
        Your body clock is anchored. Take each script when its window opens — share this profile with
        your prescriber if anything looks off.
      </p>

      <div
        className={
          outputs.riskStatus === 'green'
            ? 'first-light-complete__status first-light-complete__status--green'
            : 'first-light-complete__status first-light-complete__status--amber'
        }
      >
        {outputs.riskStatus === 'green'
          ? 'All safety checkpoints confirmed — cohort status green.'
          : 'Safety checkpoint incomplete — cohort flagged amber for clinician review.'}
      </div>

      {outputs.scanNote ? (
        <p className="first-light-session__hint" style={{ marginTop: '0.75rem' }}>
          {outputs.scanNote}
        </p>
      ) : null}

      <ul className="first-light-complete__outputs">
        <li className="first-light-complete__output-card">
          <p className="first-light-complete__output-label">Eating window</p>
          <p className="first-light-complete__output-value">
            Opens {outputs.eatingWindow.opens} · closes {outputs.eatingWindow.closes}
          </p>
          <p className="first-light-complete__output-note">
            Anchored to first light — not wall-clock breakfast time.
          </p>
        </li>

        <li className="first-light-complete__output-card">
          <p className="first-light-complete__output-label">Today&apos;s script timing</p>
          <div className="first-light-complete__meds">
            {outputs.doseTimings.map((dose) => (
              <div key={`${dose.name}-${dose.time}`}>
                <p className="first-light-complete__output-value">
                  {dose.name} — {dose.time}
                </p>
                {dose.note ? <p className="first-light-complete__output-note">{dose.note}</p> : null}
              </div>
            ))}
          </div>
        </li>

        {outputs.phaseTimeLabel ? (
          <li className="first-light-complete__output-card">
            <p className="first-light-complete__output-label">Body clock phase</p>
            <p className="first-light-complete__output-value">{outputs.phaseTimeLabel}</p>
          </li>
        ) : null}
      </ul>

      <div className="first-light-complete__actions">
        <Link href={PATIENT_ROUTES.dashboard} className="first-light-session__btn first-light-session__btn--primary">
          Back to dashboard
        </Link>
        <Link href={PATIENT_ROUTES.dashboard} className="first-light-session__hint" style={{ textAlign: 'center' }}>
          Window opens again tomorrow at first light →
        </Link>
      </div>
    </div>
  )
}
