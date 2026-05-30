'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  CONSULT_CTA,
  INSIGHT_CARD,
  MONO_DATA,
} from '@/components/dashboard/dashboard-styles'
import {
  buildPatientInstruction,
  formatConsultFinding,
  formatConsultRecommendation,
} from '@/lib/clinic/patient-instruction'
import type { DemoPatientInsight, DemoPatientTwin } from '@/lib/clinic/demo-patient-twin'
import { CLINIC_ROUTES } from '@/lib/auth/routes'

const CONSULT_DURATION_SECONDS = 15 * 60

type ConsultationModeProps = {
  patient: DemoPatientTwin
  insight: DemoPatientInsight
  clinicianDisplayName: string
}

export function ConsultationMode({ patient, insight, clinicianDisplayName }: ConsultationModeProps) {
  const [secondsLeft, setSecondsLeft] = useState(CONSULT_DURATION_SECONDS)
  const [instruction, setInstruction] = useState<string | null>(null)
  const [loggedAt, setLoggedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const timerLabel = formatTimer(secondsLeft)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setMessage(null)

    const text = buildPatientInstruction({
      patientName: patient.name,
      insight,
      clinicianName: clinicianDisplayName,
    })

    try {
      const response = await fetch('/api/consultation-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patient.id,
          drug_name: insight.drugName,
          recommendation: text,
          action_taken: 'instruction_generated',
        }),
      })

      const result = (await response.json()) as { loggedAt?: string; error?: string }

      if (!response.ok) {
        setError(result.error ?? 'Could not log consultation.')
        setLoading(false)
        return
      }

      setInstruction(text)
      setLoggedAt(result.loggedAt ?? new Date().toISOString())
    } catch {
      setError('Could not log consultation.')
    }

    setLoading(false)
  }

  async function handleSend() {
    if (!instruction) return

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/consultation-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patient.id,
          drug_name: insight.drugName,
          instruction,
        }),
      })

      const result = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) {
        setError(result.error ?? 'Could not send instruction.')
        setLoading(false)
        return
      }

      setMessage(result.message ?? 'Instruction sent to patient.')
    } catch {
      setError('Could not send instruction.')
    }

    setLoading(false)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-black/10 pb-4">
        <Link
          href={CLINIC_ROUTES.patient(patient.id)}
          className="text-sm text-black/60 transition-colors hover:text-black"
        >
          ← Exit consultation
        </Link>
        <p className="truncate text-center text-sm font-medium text-black">{patient.name}</p>
        <p className={`${MONO_DATA} text-right text-black/40`}>{timerLabel}</p>
      </header>

      <main className="flex flex-1 flex-col py-8">
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/45">
            {insight.drugName}
          </p>
          <p className="mt-3 text-xl font-medium leading-snug text-black">{formatConsultFinding(insight)}</p>
          <p className="mt-3 text-sm leading-relaxed text-black/70">{formatConsultRecommendation(insight)}</p>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <DiffCell label="Standard" value={insight.standardGuidance} />
          <DiffCell label="DIOS" value={insight.diosRecommendation} highlight />
        </div>

        {!instruction ? (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className={`${CONSULT_CTA} mt-8 disabled:cursor-not-allowed disabled:opacity-60 ${loading ? 'animate-pulse' : ''}`}
            >
              {loading ? 'Generating…' : 'Generate patient instruction →'}
            </button>
            <p className="mt-4 text-center font-mono text-[11px] text-black/45">
              You decide. DIOS informs.
              {loggedAt ? ` Logged ${formatLoggedTime(loggedAt)}.` : ''}
            </p>
          </>
        ) : (
          <div className="mt-8 print:block">
            <div className={`${INSIGHT_CARD} p-5 sm:p-6`}>
              <p className="whitespace-pre-line text-sm leading-relaxed text-black/80">{instruction}</p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row print:hidden">
              <button
                type="button"
                disabled={loading}
                onClick={handleSend}
                className={`${CONSULT_CTA} h-11 flex-1 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Send to patient
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="h-11 flex-1 rounded-full border border-black/10 bg-white text-sm font-medium text-black transition-transform duration-100 active:scale-[0.97] hover:bg-black/5"
              >
                Print
              </button>
            </div>

            {message ? <p className="mt-4 text-sm text-black/70">{message}</p> : null}
            <p className="mt-4 text-center font-mono text-[11px] text-black/45 print:hidden">
              You decide. DIOS informs. Logged {formatLoggedTime(loggedAt ?? new Date().toISOString())}.
            </p>
          </div>
        )}

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </main>
    </div>
  )
}

function DiffCell({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${highlight ? 'bg-teal-50' : 'bg-neutral-50'}`}>
      <p className="font-mono text-xs text-black/45">{label}</p>
      <p className="mt-1 font-mono text-xs font-medium text-black/80">{value}</p>
    </div>
  )
}

function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function formatLoggedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
