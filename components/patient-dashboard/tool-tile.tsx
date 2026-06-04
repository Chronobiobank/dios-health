'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Pill } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Medication, PatientSnapshot } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type ToolTileProps = {
  id: 'coach' | 'meds'
  snapshot: PatientSnapshot
  isOpen: boolean
  onToggle: () => void
  coachDraft: string
  onCoachDraftChange: (value: string) => void
  onSendPrompt: (prompt: string) => void
}

const QUICK_PROMPTS = [
  'When should I take my meds tonight?',
  'Why is my circadian age higher?',
  'What shifts my body clock fastest?',
] as const

function MedStatusBadge({ status }: { status: Medication['status'] }) {
  const label = status === 'taken' ? 'Taken' : status === 'tonight' ? 'Tonight' : 'Upcoming'
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full dash-tile-badge',
        status === 'tonight' && 'border-[var(--gold)] text-[var(--gold)]',
        status === 'taken' && 'border-[var(--color-brand)] text-[var(--color-brand)]'
      )}
    >
      {label}
    </Badge>
  )
}

export function ToolTile({
  id,
  snapshot,
  isOpen,
  onToggle,
  coachDraft,
  onCoachDraftChange,
  onSendPrompt,
}: ToolTileProps) {
  const isCoach = id === 'coach'

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={cn('glass-tile dash-tile flex w-full flex-col p-5 text-left', isOpen && 'glass-tile--open')}
        aria-expanded={isOpen}
      >
        <div className={cn('tool-tile-icon', isCoach ? 'dash-tile-icon--coach' : 'dash-tile-icon--meds')}>
          {isCoach ? (
            <MessageCircle className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
          ) : (
            <Pill className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
          )}
        </div>

        <p className="dash-tile-metric dash-tile-metric--spacer" aria-hidden>
          &nbsp;
        </p>
        <p className="dash-tile-title">{isCoach ? 'DIOS Coach' : 'Medication timing'}</p>
        <p className="dash-tile-subtitle">
          {isCoach
            ? 'Ask about your body clock, results, and personalised plan.'
            : 'When to take each medicine for your body clock today.'}
        </p>

        <div className="dash-tile-footer">
          <div className="dash-tile-footer-meta">
            <span className={isCoach ? 'text-[var(--researcher-avatar-text)]' : 'text-[var(--gold)]'}>
              {isCoach ? 'Online now' : `${snapshot.medicationsDueTonight} due tonight`}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--researcher-avatar-text)]" aria-hidden />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key={`${id}-panel`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-5"
          >
            {isCoach ? (
              <CoachPanel
                draft={coachDraft}
                onDraftChange={onCoachDraftChange}
                onSendPrompt={onSendPrompt}
              />
            ) : (
              <MedsPanel medications={snapshot.medications} vdrUnresolved={snapshot.bloodPanel.vdrFlagUnresolved} />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function CoachPanel({
  draft,
  onDraftChange,
  onSendPrompt,
}: {
  draft: string
  onDraftChange: (value: string) => void
  onSendPrompt: (prompt: string) => void
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/70 bg-white/60 px-3 py-2.5 dash-panel-body">
        Kia ora — I&apos;m here to help with your body clock, results, and plan.
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSendPrompt(prompt)}
            className="rounded-full border border-white/75 bg-white/55 px-3 py-1.5 dash-panel-chip text-[var(--text-primary)] hover:bg-white/70"
          >
            {prompt}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          if (draft.trim()) onSendPrompt(draft.trim())
        }}
      >
        <input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Ask DIOS anything…"
          className="min-w-0 flex-1 rounded-xl border border-white/75 bg-white/60 px-3 py-2.5 dash-panel-body outline-none"
        />
        <Button type="submit" size="sm" className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand)]/90">
          Send
        </Button>
      </form>
    </div>
  )
}

function MedsPanel({
  medications,
  vdrUnresolved,
}: {
  medications: Medication[]
  vdrUnresolved: boolean
}) {
  return (
    <div className="space-y-3">
      {vdrUnresolved ? (
        <p className="dash-panel-muted">
          Moderate confidence — an unresolved VDR flag may shift tonight&apos;s vitamin D timing.
        </p>
      ) : null}

      {medications.length === 0 ? (
        <p className="dash-panel-muted">
          Add your medications during onboarding to see personalised timing windows.
        </p>
      ) : (
        <ul className="space-y-3">
          {medications.map((med) => (
            <li key={`${med.name}-${med.time}`} className="flex items-start justify-between gap-3 dash-panel-row">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: med.colour }}
                    aria-hidden
                  />
                  <span className="font-medium text-[var(--text-primary)]">
                    {med.name}
                    {med.dose ? ` · ${med.dose}` : ''}
                  </span>
                  <span className="text-[var(--text-muted)]">{med.time}</span>
                </div>
                <p className="mt-1 pl-[18px] dash-panel-muted">{med.reason}</p>
              </div>
              <MedStatusBadge status={med.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
