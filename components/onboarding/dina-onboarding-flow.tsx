'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { OnboardingAudienceBanner } from '@/components/onboarding/onboarding-audience-banner'
import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'
function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <div className="dina-onboarding dios-nav-tone-paper dios-page-top-bleed">
      <div className="dina-onboarding__inner">
        <OnboardingAudienceBanner />
        {children}
      </div>
    </div>
  )
}

const SCAN_SECONDS = 60
const DINA_ONBOARDING_MESSAGE =
  'Your biological clock is running about 90 minutes behind the wall clock. That is common. It means your medication windows are later than the label says. I will tell you when each window opens.'

type Step = 'permission' | 'scan' | 'result' | 'notification' | 'protocol'

export function DinaOnboardingFlow() {
  const [step, setStep] = useState<Step>('permission')
  const [secondsLeft, setSecondsLeft] = useState(SCAN_SECONDS)
  const [drugName, setDrugName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (step !== 'scan') return

    setSecondsLeft(SCAN_SECONDS)
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          setStep('result')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [step])

  const progress = ((SCAN_SECONDS - secondsLeft) / SCAN_SECONDS) * 100

  const handleSaveProtocol = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (!drugName.trim()) return
      const existing = JSON.parse(localStorage.getItem('dios-prototype-protocol') ?? '[]') as string[]
      localStorage.setItem(
        'dios-prototype-protocol',
        JSON.stringify([...existing, drugName.trim()])
      )
      setSaved(true)
    },
    [drugName]
  )

  if (step === 'permission') {
    return (
      <OnboardingShell>
          <p className="dina-onboarding__step-label">Step 1 of 4</p>
          <h1 className="dina-onboarding__title">Camera access</h1>
          <p className="dina-onboarding__body">
            {COACH_DISPLAY_NAME} needs your camera to measure your light exposure.
          </p>
          <div className="dina-onboarding__camera-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8h3l2-3h6l2 3h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
              <circle cx="12" cy="14" r="3.5" />
            </svg>
          </div>
          <button type="button" className="dina-onboarding__btn" onClick={() => setStep('scan')}>
            Allow camera
          </button>
      </OnboardingShell>
    )
  }

  if (step === 'scan') {
    return (
      <OnboardingShell>
          <p className="dina-onboarding__step-label">Step 2 of 4</p>
          <h1 className="dina-onboarding__title">Scan your clock</h1>
          <p className="dina-onboarding__body">Hold still. Look at your screen normally.</p>
          <div
            className="dina-onboarding__scan-stage"
            style={{ '--mo-progress': `${progress}%` } as React.CSSProperties}
          >
            <div className="dina-onboarding__scan-ring">
              <div className="dina-onboarding__scan-feed">
                <span>Camera preview</span>
              </div>
            </div>
            <p className="dina-onboarding__countdown">{secondsLeft}s</p>
          </div>
      </OnboardingShell>
    )
  }

  if (step === 'result') {
    return (
      <OnboardingShell>
          <p className="dina-onboarding__step-label">Step 3 of 4</p>
          <h1 className="dina-onboarding__title">Your BTI estimate</h1>
          <div className="dina-onboarding__bti-card">
            <p className="dina-onboarding__bti-value">22:57</p>
            <p className="dina-onboarding__bti-confidence">ESTIMATED (L1 only)</p>
          </div>
          <blockquote className="dina-onboarding__dina-quote">{DINA_ONBOARDING_MESSAGE}</blockquote>
          <button
            type="button"
            className="dina-onboarding__btn"
            onClick={() => setStep('notification')}
          >
            Continue
          </button>
      </OnboardingShell>
    )
  }

  if (step === 'notification') {
    return (
      <OnboardingShell>
          <p className="dina-onboarding__step-label">Step 4 of 4</p>
          <h1 className="dina-onboarding__title">Your first window</h1>
          <div className="dina-onboarding__push-card" role="status">
            <p className="dina-onboarding__push-app">DIOS · {COACH_DISPLAY_NAME}</p>
            <p className="dina-onboarding__push-text">
              Simvastatin 20mg — your window opens in 40 minutes. I will remind you then.
            </p>
          </div>
          <button
            type="button"
            className="dina-onboarding__btn"
            onClick={() => setStep('protocol')}
          >
            Set up my protocol
          </button>
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell>
        <p className="dina-onboarding__step-label">Protocol</p>
        <h1 className="dina-onboarding__title">Add your first drug</h1>
        <p className="dina-onboarding__body">Enter one medication to map to your biological window.</p>
        <form className="dina-onboarding__protocol-form" onSubmit={handleSaveProtocol}>
          <input
            className="dina-onboarding__input"
            type="text"
            placeholder="e.g. Simvastatin 20mg"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            required
          />
          <button type="submit" className="dina-onboarding__btn" disabled={!drugName.trim()}>
            Save to protocol
          </button>
        </form>
        {saved ? (
          <p className="dina-onboarding__success">
            Saved on this device only. Protocol mapping happens after your clinician enrols your cohort.
          </p>
        ) : null}
    </OnboardingShell>
  )
}
