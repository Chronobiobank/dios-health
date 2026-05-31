'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { TimebotPulse, type TimebotPulseState } from '@/components/dashboard/timebot-pulse'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import type {
  TimebotData,
  TimebotTimelineEvent,
  TimebotTimelineGroup,
} from '@/lib/dashboard/timebot-data'
import type { ScheduleStatus, TimebotEventCategory } from '@/lib/dashboard/timebot-timeline'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

type TimebotViewProps = {
  data: TimebotData
}

const PRECISION_HEADER: Record<TimebotData['precisionLabel'], string> = {
  ESTIMATED: 'ESTIMATED',
  PRECISION: 'PRECISION',
  CONFIRMED: 'CONFIRMED',
}

const PRECISION_STYLE: Record<TimebotData['precisionLabel'], string> = {
  ESTIMATED: 'bg-amber-500/10 text-amber-900',
  PRECISION: 'bg-teal-600/10 text-teal-900',
  CONFIRMED: 'bg-emerald-600/10 text-emerald-900',
}

const CATEGORY_STYLE: Record<TimebotEventCategory, string> = {
  Light: 'bg-amber-500/10 text-amber-900',
  Meal: 'bg-orange-500/10 text-orange-900',
  Movement: 'bg-sky-500/10 text-sky-900',
  Medication: 'bg-violet-500/10 text-violet-900',
  Supplement: 'bg-teal-600/10 text-teal-900',
  Darkness: 'bg-indigo-500/10 text-indigo-900',
}

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  upcoming: 'Upcoming',
  now: 'Now',
  done: 'Done',
}

function StatusPill({ status }: { status: ScheduleStatus }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-emerald-800">
        <Check className="h-3 w-3" aria-hidden />
        Done
      </span>
    )
  }

  if (status === 'now') {
    return (
      <span className="inline-flex items-center rounded-full bg-teal-600/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-teal-800">
        <span className="mr-1.5 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-teal-600" aria-hidden />
        Now
      </span>
    )
  }

  return (
    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-black/45">
      {STATUS_LABEL.upcoming}
    </span>
  )
}

function TimelineEventRow({ event }: { event: TimebotTimelineEvent }) {
  return (
    <li className="border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[15px] font-medium leading-snug text-black">{event.name}</p>
        <StatusPill status={event.status} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
            CATEGORY_STYLE[event.category]
          )}
        >
          {event.category}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-black/55">{event.instruction}</p>
    </li>
  )
}

function TimelineGroup({ group }: { group: TimebotTimelineGroup }) {
  return (
    <section className="relative pl-0">
      <p className="font-mono text-[15px] font-bold tabular-nums text-black">{group.timeDisplay}</p>
      <ul className="mt-2">
        {group.events.map((event) => (
          <TimelineEventRow key={event.id} event={event} />
        ))}
      </ul>
    </section>
  )
}

function VayaWelcome({ data }: { data: TimebotData }) {
  return (
    <div className="mt-6 px-2 text-center">
      <p className="font-mono text-[11px] uppercase tracking-widest text-black/40">Vaya session</p>
      <p className="mt-3 text-[15px] leading-relaxed text-black/60">
        Hi {data.firstName} — I&apos;m Vaya. Tell me what supplements and medications you take.
        I&apos;ll build today&apos;s light targets and dose timing around your body clock
        {data.precisionLabel === 'ESTIMATED' ? ' (estimated from your questionnaire)' : ''}.
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-black/45">
        Try: &ldquo;I take vitamin D, magnesium, and ramipril&rdquo;
      </p>
      {data.precisionLabel === 'ESTIMATED' ? (
        <Link
          href={PATIENT_ROUTES.streams}
          className="mt-4 inline-flex text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
        >
          Connect TipTraQ or add streams for sharper timing →
        </Link>
      ) : null}
    </div>
  )
}

export function TimebotView({ data }: TimebotViewProps) {
  const [pulseState, setPulseState] = useState<TimebotPulseState>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [trackedSupplements, setTrackedSupplements] = useState(data.currentSupplements)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const respondTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (respondTimer.current) window.clearTimeout(respondTimer.current)
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = input.trim()
    if (!question || loading || !data.hasDlmoData) return

    setInput('')
    setError(null)
    setLoading(true)
    setPulseState('thinking')
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: question }])

    try {
      const response = await fetch('/api/timebot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })

      const result = (await response.json()) as {
        answer?: string
        error?: string
        supplementsSaved?: string[]
      }

      if (!response.ok) {
        setError(result.error ?? 'Vaya could not answer right now.')
        setPulseState('idle')
        return
      }

      if (result.supplementsSaved?.length) {
        setTrackedSupplements(result.supplementsSaved)
      }

      setPulseState('responding')
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: result.answer ?? '' },
      ])

      if (respondTimer.current) window.clearTimeout(respondTimer.current)
      respondTimer.current = window.setTimeout(() => setPulseState('idle'), 3000)
    } catch {
      setError('Vaya could not answer right now.')
      setPulseState('idle')
    } finally {
      setLoading(false)
    }
  }

  const showWelcome = !data.hasTimeline
  const showChatInWelcome = showWelcome && messages.length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-36">
      <div className="flex flex-col items-center px-2 pt-2 text-center">
        <TimebotPulse state={pulseState} />
        <p className="mt-4 text-[15px] font-semibold text-black">{data.firstName}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]',
              PRECISION_STYLE[data.precisionLabel]
            )}
          >
            {PRECISION_HEADER[data.precisionLabel]}
          </span>
          <span className="font-mono text-[12px] text-black/50">DLMO {data.dlmoTimeLabel}</span>
        </div>
      </div>

      {showWelcome ? (
        <>
          <VayaWelcome data={data} />
          {showChatInWelcome ? (
            <div className="chat-thread mt-8 border-t border-black/[0.06] pt-6">
              <div className="chat-messages" role="log" aria-live="polite">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    data-role={message.role}
                    className={cn(
                      'message-bubble',
                      loading &&
                        message.role === 'assistant' &&
                        message.id === messages[messages.length - 1]?.id &&
                        'streaming-cursor'
                    )}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {trackedSupplements.length > 0 ? (
            <p className="mt-4 text-center text-[12px] leading-relaxed text-black/45">
              Supplements: {trackedSupplements.join(', ')}
            </p>
          ) : null}

          {messages.length > 0 ? (
            <div className="chat-thread mt-8 border-t border-black/[0.06] pt-6">
              <div className="chat-messages" role="log" aria-live="polite">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    data-role={message.role}
                    className={cn(
                      'message-bubble',
                      loading &&
                        message.role === 'assistant' &&
                        message.id === messages[messages.length - 1]?.id &&
                        'streaming-cursor'
                    )}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="input-sticky-dock fixed inset-x-0 bottom-[4.25rem] sm:bottom-[4.25rem]"
      >
        <label htmlFor="vaya-input" className="sr-only">
          Ask Vaya about your light and timing
        </label>
        <div className="input-sticky-dock__inner">
          <input
            id="vaya-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Vaya about your light and timing"
            disabled={loading}
            className="calmer-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="calmer-submit"
          >
            {loading ? '…' : 'Send'}
          </button>
        </div>
        {error ? (
          <p className="type-caption mt-2 text-center text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  )
}
