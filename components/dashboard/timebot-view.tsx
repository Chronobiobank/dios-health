'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { TimebotPulse, type TimebotPulseState } from '@/components/dashboard/timebot-pulse'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import type { TimebotData, TimebotScheduleItem, ScheduleStatus } from '@/lib/dashboard/timebot-data'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

type TimebotViewProps = {
  data: TimebotData
}

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  upcoming: 'Upcoming',
  now: 'Now',
  done: 'Done',
}

const STATUS_STYLE: Record<ScheduleStatus, string> = {
  upcoming: 'bg-black/[0.04] text-black/50',
  now: 'bg-teal-600/10 text-teal-800',
  done: 'bg-black/[0.03] text-black/35',
}

function ScheduleRow({ item }: { item: TimebotScheduleItem }) {
  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      <div className="relative z-[1] flex w-[4.5rem] shrink-0 flex-col items-end pt-0.5">
        <span className="font-mono text-[11px] leading-tight text-black/45">{item.timeLabel}</span>
      </div>

      <div className="relative flex shrink-0 flex-col items-center">
        <span
          className={cn(
            'relative z-[1] mt-1 h-2.5 w-2.5 rounded-full border-2 border-white',
            item.status === 'now' ? 'bg-teal-600' : 'bg-black/15'
          )}
        />
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[15px] font-medium leading-snug text-black">{item.label}</p>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
              STATUS_STYLE[item.status]
            )}
          >
            {STATUS_LABEL[item.status]}
          </span>
        </div>
        {item.detail ? <p className="mt-1 text-[13px] leading-relaxed text-black/55">{item.detail}</p> : null}
      </div>
    </li>
  )
}

export function TimebotView({ data }: TimebotViewProps) {
  const [pulseState, setPulseState] = useState<TimebotPulseState>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
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

      const result = (await response.json()) as { answer?: string; error?: string }

      if (!response.ok) {
        setError(result.error ?? 'Timebot could not answer right now.')
        setPulseState('idle')
        return
      }

      setPulseState('responding')
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: result.answer ?? '' },
      ])

      if (respondTimer.current) window.clearTimeout(respondTimer.current)
      respondTimer.current = window.setTimeout(() => setPulseState('idle'), 3000)
    } catch {
      setError('Timebot could not answer right now.')
      setPulseState('idle')
    } finally {
      setLoading(false)
    }
  }

  if (!data.hasDlmoData) {
    return (
      <div className="flex flex-col items-center px-2 py-10 text-center">
        <TimebotPulse state="idle" />
        <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-black/60">
          Upload your first TipTraQ night to activate your Timebot.
        </p>
        <Link
          href={PATIENT_ROUTES.streams}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white"
        >
          Connect TipTraQ →
        </Link>
      </div>
    )
  }

  const medications = data.items.filter((item) => item.kind === 'medication')
  const cues = data.items.filter((item) => item.kind === 'cue')

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-36">
      <div className="flex flex-col items-center px-2 pt-2 text-center">
        <TimebotPulse state={pulseState} />
        <p className="mt-4 text-[15px] font-semibold text-black">{data.firstName}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
          Your DIʘS timebot is active
        </p>
      </div>

      <div className="relative mt-10 px-1">
        <div
          className="pointer-events-none absolute bottom-0 left-[calc(4.5rem+0.3125rem)] top-0 w-px bg-black/10"
          aria-hidden
        />

        <section className="mb-10">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.08em] text-black/40">
            Today&apos;s timing schedule
          </p>
          <ol>{medications.map((item) => <ScheduleRow key={item.id} item={item} />)}</ol>
        </section>

        <section>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.08em] text-black/40">
            Cue schedule
          </p>
          <ol>{cues.map((item) => <ScheduleRow key={item.id} item={item} />)}</ol>
        </section>
      </div>

      {messages.length > 0 ? (
        <div className="mt-8 space-y-3 border-t border-black/[0.06] pt-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed',
                message.role === 'user'
                  ? 'ml-auto bg-black text-white'
                  : 'mr-auto border border-black/[0.06] bg-[#F9F9F9] text-black/80'
              )}
            >
              {message.text}
            </div>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-black/10 bg-white/95 px-5 py-3 backdrop-blur-md sm:mx-auto sm:max-w-[640px]"
      >
        <label htmlFor="timebot-input" className="sr-only">
          Ask DIʘS anything about your timing
        </label>
        <div className="flex gap-2">
          <input
            id="timebot-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask DIʘS anything about your timing"
            disabled={loading}
            className="type-body min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[15px] outline-none placeholder:text-black/35 focus:border-teal-700/40 focus:ring-1 focus:ring-teal-700/20"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-black px-4 text-sm font-medium text-white disabled:opacity-40"
          >
            {loading ? '…' : 'Send'}
          </button>
        </div>
        {error ? (
          <p className="mt-2 text-center text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  )
}
