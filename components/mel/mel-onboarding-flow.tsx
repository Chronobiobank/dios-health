'use client'

import { useCallback, useEffect, useState } from 'react'

const SCAN_SECONDS = 60
const MEL_ONBOARDING_MESSAGE =
  'Your biological clock is running about 90 minutes behind the wall clock. That is common. It means your medication windows are later than the label says. I will tell you when each window opens.'

type Step = 'permission' | 'scan' | 'result' | 'notification' | 'protocol'

export function MelOnboardingFlow() {
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
      <div className="mel-onboarding dios-nav-tone-paper dios-page-top-bleed">
        <div className="mel-onboarding__inner">
          <p className="mel-onboarding__step-label">Step 1 of 4</p>
          <h1 className="mel-onboarding__title">Camera access</h1>
          <p className="mel-onboarding__body">
            Mel needs your camera to measure your light exposure.
          </p>
          <div className="mel-onboarding__camera-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8h3l2-3h6l2 3h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
              <circle cx="12" cy="14" r="3.5" />
            </svg>
          </div>
          <button type="button" className="mel-onboarding__btn" onClick={() => setStep('scan')}>
            Allow camera
          </button>
        </div>
      </div>
    )
  }

  if (step === 'scan') {
    return (
      <div className="mel-onboarding dios-nav-tone-paper dios-page-top-bleed">
        <div className="mel-onboarding__inner">
          <p className="mel-onboarding__step-label">Step 2 of 4</p>
          <h1 className="mel-onboarding__title">Scan your clock</h1>
          <p className="mel-onboarding__body">Hold still. Look at your screen normally.</p>
          <div
            className="mel-onboarding__scan-stage"
            style={{ '--mo-progress': `${progress}%` } as React.CSSProperties}
          >
            <div className="mel-onboarding__scan-ring">
              <div className="mel-onboarding__scan-feed">
                <span>Camera preview</span>
              </div>
            </div>
            <p className="mel-onboarding__countdown">{secondsLeft}s</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    return (
      <div className="mel-onboarding dios-nav-tone-paper dios-page-top-bleed">
        <div className="mel-onboarding__inner">
          <p className="mel-onboarding__step-label">Step 3 of 4</p>
          <h1 className="mel-onboarding__title">Your BTI estimate</h1>
          <div className="mel-onboarding__bti-card">
            <p className="mel-onboarding__bti-value">22:57</p>
            <p className="mel-onboarding__bti-confidence">ESTIMATED (L1 only)</p>
          </div>
          <blockquote className="mel-onboarding__mel-quote">{MEL_ONBOARDING_MESSAGE}</blockquote>
          <button
            type="button"
            className="mel-onboarding__btn"
            onClick={() => setStep('notification')}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (step === 'notification') {
    return (
      <div className="mel-onboarding dios-nav-tone-paper dios-page-top-bleed">
        <div className="mel-onboarding__inner">
          <p className="mel-onboarding__step-label">Step 4 of 4</p>
          <h1 className="mel-onboarding__title">Your first window</h1>
          <div className="mel-onboarding__push-card" role="status">
            <p className="mel-onboarding__push-app">DIOS · Mel</p>
            <p className="mel-onboarding__push-text">
              Simvastatin 20mg — your window opens in 40 minutes. I will remind you then.
            </p>
          </div>
          <button
            type="button"
            className="mel-onboarding__btn"
            onClick={() => setStep('protocol')}
          >
            Set up my protocol
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mel-onboarding dios-nav-tone-paper dios-page-top-bleed">
      <div className="mel-onboarding__inner">
        <p className="mel-onboarding__step-label">Protocol</p>
        <h1 className="mel-onboarding__title">Add your first drug</h1>
        <p className="mel-onboarding__body">Enter one medication to map to your biological window.</p>
        <form className="mel-onboarding__protocol-form" onSubmit={handleSaveProtocol}>
          <input
            className="mel-onboarding__input"
            type="text"
            placeholder="e.g. Simvastatin 20mg"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            required
          />
          <button type="submit" className="mel-onboarding__btn" disabled={!drugName.trim()}>
            Save to protocol
          </button>
        </form>
        {saved ? (
          <p className="mel-onboarding__success">Saved locally for prototype. Clinician mapping comes next.</p>
        ) : null}
      </div>
    </div>
  )
}
