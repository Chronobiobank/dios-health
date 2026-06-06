'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import {
  FIRST_LIGHT_SESSION_STORAGE_KEY,
  type FirstLightOutputs,
} from '@/lib/product/first-light-outputs'
import type { FirstLightWindowStatus } from '@/lib/product/first-light-window'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

type SessionStep = 'intro' | 'scan' | 'questions' | 'safety' | 'submitting'

type FirstLightSessionProps = {
  windowStatus: FirstLightWindowStatus
  allowLateScan: boolean
  defaultWakeTime: string
  defaultSleepOnset: string
}

const SCAN_LABELS = [
  'Melanopsin light reflex…',
  'Autonomic index at wake…',
  'Circadian phase anchor…',
  'Mapping today’s dose window…',
] as const

function defaultWakeTimeLocal(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function FirstLightSession({
  windowStatus,
  allowLateScan,
  defaultWakeTime,
  defaultSleepOnset,
}: FirstLightSessionProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [step, setStep] = useState<SessionStep>('intro')
  const [scanSecondsLeft, setScanSecondsLeft] = useState<number>(
    FIRST_LIGHT_PROTOCOL.scanDurationSeconds
  )
  const [scanLabelIndex, setScanLabelIndex] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [wakeTime, setWakeTime] = useState(defaultWakeTime || defaultWakeTimeLocal())
  const [sleepOnset, setSleepOnset] = useState(defaultSleepOnset)
  const [outdoorLight, setOutdoorLight] = useState<boolean | null>(null)

  const [adherence, setAdherence] = useState({
    fluidIntake: false,
    lowCalciumDiet: false,
    physicalActivity: false,
  })

  useEffect(() => {
    if (step !== 'scan') return

    let stream: MediaStream | null = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setCameraError(null)
        setHasVideo(true)
      } catch {
        setCameraError('Camera unavailable — simulated scan active.')
        setHasVideo(false)
      }
    }

    void startCamera()
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
      setHasVideo(false)
    }
  }, [step])

  useEffect(() => {
    if (step !== 'scan') return
    if (scanSecondsLeft <= 0) {
      setStep('questions')
      return
    }
    const timer = window.setTimeout(() => setScanSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [step, scanSecondsLeft])

  useEffect(() => {
    if (step !== 'scan') return
    const interval = window.setInterval(() => {
      setScanLabelIndex((i) => (i + 1) % SCAN_LABELS.length)
    }, 4000)
    return () => window.clearInterval(interval)
  }, [step])

  const startScan = useCallback(() => {
    setScanSecondsLeft(FIRST_LIGHT_PROTOCOL.scanDurationSeconds)
    setScanLabelIndex(0)
    setStep('scan')
  }, [])

  const toggleAdherence = useCallback((key: keyof typeof adherence) => {
    setAdherence((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const submitSession = useCallback(async () => {
    if (outdoorLight === null) {
      setError('Confirm whether you were outside in morning light.')
      return
    }

    setStep('submitting')
    setError(null)

    const scanCompletedAt = new Date().toISOString()

    try {
      const res = await fetch('/api/first-light/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wakeTimeLocal: wakeTime,
          sleepOnsetLocal: sleepOnset,
          outdoorLight,
          scanWithinWindow: windowStatus.isOpen,
          scanCompletedAt,
          adherence,
        }),
      })

      const data = (await res.json()) as { error?: string; outputs?: FirstLightOutputs }

      if (!res.ok || !data.outputs) {
        setError(data.error ?? 'Could not complete morning session.')
        setStep('safety')
        return
      }

      sessionStorage.setItem(
        FIRST_LIGHT_SESSION_STORAGE_KEY,
        JSON.stringify({
          outputs: data.outputs,
          completedAt: scanCompletedAt,
          adherence,
          scanWithinWindow: windowStatus.isOpen,
          outdoorLight,
        })
      )
      router.push(`${PATIENT_ROUTES.dashboard}/first-light/complete`)
    } catch {
      setError('Network error — try again.')
      setStep('safety')
    }
  }, [adherence, outdoorLight, router, sleepOnset, wakeTime, windowStatus.isOpen])

  const progress =
    step === 'intro'
      ? 0
      : step === 'scan'
        ? 0.25 + (1 - scanSecondsLeft / FIRST_LIGHT_PROTOCOL.scanDurationSeconds) * 0.25
        : step === 'questions'
          ? 0.55
          : step === 'safety'
            ? 0.8
            : 1

  return (
    <div className="first-light-session">
      <header className="first-light-session__header">
        <p className="first-light-session__eyebrow">{FIRST_LIGHT_PROTOCOL.name}</p>
        <h1 className="first-light-session__title">Morning session</h1>
        <div className="first-light-session__progress" aria-hidden>
          <span className="first-light-session__progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      {step === 'intro' ? (
        <section className="first-light-session__panel">
          <p className="first-light-session__lede">
            {windowStatus.isOpen
              ? 'Go outside if you can. DIOS will measure your body clock and time today’s meds in under two minutes.'
              : windowStatus.message}
          </p>
          <ul className="first-light-session__steps-list">
            <li>{FIRST_LIGHT_PROTOCOL.scanDurationSeconds}s scan — light reflex and wake signal</li>
            <li>Three quick questions — sleep and schedule</li>
            <li>Three safety taps — yesterday’s adherence checkpoints</li>
          </ul>
          {windowStatus.isOpen || allowLateScan ? (
            <button type="button" className="first-light-session__btn first-light-session__btn--primary" onClick={startScan}>
              Begin {FIRST_LIGHT_PROTOCOL.scanDurationSeconds}s scan
            </button>
          ) : (
            <p className="first-light-session__hint">Window opens at civil dawn. Check back tomorrow morning.</p>
          )}
        </section>
      ) : null}

      {step === 'scan' ? (
        <section className="first-light-session__panel">
          <div className="first-light-session__scan-frame">
            <video ref={videoRef} className="first-light-session__video" playsInline muted />
            {!hasVideo && cameraError ? (
              <p className="first-light-session__scan-fallback">{cameraError}</p>
            ) : null}
            <div className="first-light-session__scan-overlay">
              <p className="first-light-session__scan-count">{scanSecondsLeft}s</p>
              <p className="first-light-session__scan-label">{SCAN_LABELS[scanLabelIndex]}</p>
            </div>
          </div>
          <p className="first-light-session__hint">Face the morning light. Hold steady until the countdown finishes.</p>
        </section>
      ) : null}

      {step === 'questions' ? (
        <section className="first-light-session__panel">
          <h2 className="first-light-session__step-title">Sleep & schedule</h2>
          <label className="first-light-session__field">
            <span>What time did you wake today?</span>
            <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
          </label>
          <label className="first-light-session__field">
            <span>What time did you fall asleep?</span>
            <input type="time" value={sleepOnset} onChange={(e) => setSleepOnset(e.target.value)} />
          </label>
          <fieldset className="first-light-session__fieldset">
            <legend>Were you outside in morning light for this scan?</legend>
            <div className="first-light-session__choice-row">
              <button
                type="button"
                className={cn('first-light-session__choice', outdoorLight === true && 'is-selected')}
                onClick={() => setOutdoorLight(true)}
              >
                Yes — outside
              </button>
              <button
                type="button"
                className={cn('first-light-session__choice', outdoorLight === false && 'is-selected')}
                onClick={() => setOutdoorLight(false)}
              >
                No — indoors
              </button>
            </div>
          </fieldset>
          <button
            type="button"
            className="first-light-session__btn first-light-session__btn--primary"
            onClick={() => setStep('safety')}
          >
            Continue to safety checks
          </button>
        </section>
      ) : null}

      {step === 'safety' || step === 'submitting' ? (
        <section className="first-light-session__panel">
          <h2 className="first-light-session__step-title">Safety checkpoints</h2>
          <p className="first-light-session__lede">
            Three taps — not a diary. Missing any checkpoint flags amber review for your clinician.
          </p>
          <ul className="first-light-session__checklist">
            {FIRST_LIGHT_PROTOCOL.adherenceCheckpoints.map((label, index) => {
              const key = (['fluidIntake', 'lowCalciumDiet', 'physicalActivity'] as const)[index]
              const checked = adherence[key]
              return (
                <li key={label}>
                  <button
                    type="button"
                    className={cn('first-light-session__check', checked && 'is-checked')}
                    onClick={() => toggleAdherence(key)}
                    disabled={step === 'submitting'}
                  >
                    <span className="first-light-session__check-mark" aria-hidden>
                      {checked ? '✓' : ''}
                    </span>
                    <span>{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {error ? <p className="first-light-session__error">{error}</p> : null}
          <button
            type="button"
            className="first-light-session__btn first-light-session__btn--primary"
            onClick={() => void submitSession()}
            disabled={step === 'submitting'}
          >
            {step === 'submitting' ? 'Anchoring your day…' : 'Finish session'}
          </button>
        </section>
      ) : null}
    </div>
  )
}
