'use client'

import { useState } from 'react'

import { CoachOrb, type CoachOrbState } from '@/components/dashboard/coach-orb'
import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'
import {
  DINA_SCENARIOS,
  type DinaScenario,
  type DinaScenarioAction,
} from '@/lib/coach/dina-scenarios'
import { cn } from '@/lib/utils'

type ChatLine = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

type DinaScenariosGalleryProps = {
  /** Authenticated coach uses /api/timebot; public /dina uses /api/coach/demo */
  apiEndpoint?: '/api/timebot' | '/api/coach/demo'
  compact?: boolean
}

export function DinaScenariosGallery({
  apiEndpoint = '/api/coach/demo',
  compact = false,
}: DinaScenariosGalleryProps) {
  const [activeId, setActiveId] = useState<DinaScenario['id']>(DINA_SCENARIOS[0].id)
  const [chat, setChat] = useState<ChatLine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orbState, setOrbState] = useState<CoachOrbState>('idle')

  const active = DINA_SCENARIOS.find((s) => s.id === activeId) ?? DINA_SCENARIOS[0]

  async function askDina(question: string) {
    if (!question.trim() || loading) return

    setError(null)
    setLoading(true)
    setOrbState('thinking')
    setChat((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: question }])

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })

      const result = (await response.json()) as { answer?: string; error?: string }

      if (!response.ok) {
        setError(result.error ?? `${COACH_DISPLAY_NAME} could not answer right now.`)
        setOrbState('idle')
        return
      }

      const answer = result.answer?.trim()
      if (answer) {
        setChat((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', text: answer },
        ])
        setOrbState('responding')
        window.setTimeout(() => setOrbState('idle'), 2500)
      }
    } catch {
      setError(`${COACH_DISPLAY_NAME} could not answer right now.`)
      setOrbState('idle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('dina-scenarios', compact && 'dina-scenarios--compact')}>
      <div className="dina-scenarios__tabs" role="tablist" aria-label="DINA scenarios">
        {DINA_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            role="tab"
            aria-selected={scenario.id === activeId}
            className={cn(
              'dina-scenarios__tab',
              scenario.id === activeId && 'dina-scenarios__tab--active'
            )}
            onClick={() => setActiveId(scenario.id)}
          >
            {scenario.title}
          </button>
        ))}
      </div>

      <article className="dina-scenarios__panel" role="tabpanel" aria-label={active.title}>
        <p className="dina-scenarios__job">{active.job}</p>
        <p className="dina-scenarios__context">
          <span className="dina-scenarios__patient">{active.patientLabel}</span>
          {active.context}
        </p>

        <div className="dina-scenarios__showcase">
          <p className="dina-scenarios__speaker">{COACH_DISPLAY_NAME}</p>
          <p className="dina-scenarios__bubble">{active.dinaResponse}</p>
        </div>

        <div className="dina-scenarios__actions">
          {active.actions.map((action: DinaScenarioAction) => (
            <button
              key={action.question}
              type="button"
              className="dina-scenarios__action"
              disabled={loading}
              onClick={() => void askDina(action.question)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </article>

      {(chat.length > 0 || loading || error) && (
        <section className="dina-scenarios__live" aria-label="Live DINA responses">
          <div className="dina-scenarios__orb-wrap">
            <CoachOrb state={orbState} volume={0} />
          </div>

          <div className="dina-scenarios__thread">
            {chat.map((line) => (
              <div
                key={line.id}
                className={cn(
                  'dina-scenarios__line',
                  line.role === 'user' ? 'dina-scenarios__line--user' : 'dina-scenarios__line--dina'
                )}
              >
                <p className="dina-scenarios__line-label">
                  {line.role === 'user' ? 'You' : COACH_DISPLAY_NAME}
                </p>
                <p className="dina-scenarios__line-text">{line.text}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <p className="dina-scenarios__status">{COACH_DISPLAY_NAME} is thinking…</p>
          ) : null}
          {error ? (
            <p className="dina-scenarios__error" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      )}
    </div>
  )
}
