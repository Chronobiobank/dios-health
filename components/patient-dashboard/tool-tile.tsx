'use client'

import { MessageCircle, Pill } from 'lucide-react'

import { DashCompactTile } from '@/components/patient-dashboard/dash-compact-tile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { tileSubhead } from '@/lib/patient-dashboard/tile-copy'
import type { Medication, PatientSnapshot } from '@/lib/patient-dashboard/types'

type ToolTileProps = {
  id: 'coach' | 'meds'
  snapshot: PatientSnapshot
  firstName: string
  isOpen: boolean
  onToggle: () => void
  coachDraft: string
  onCoachDraftChange: (value: string) => void
  onSendPrompt: (prompt: string) => void
}

function coachQuickPrompts() {
  return [
    'Reduce my Dark Years ↗',
    'Vitamin D issue ↗',
    'Why my clock drifts ↗',
  ] as const
}

function MedStatusBadge({ status }: { status: Medication['status'] }) {
  const label = status === 'taken' ? 'Taken' : status === 'tonight' ? 'Tonight' : 'Upcoming'
  return (
    <Badge variant="outline" className="dash-tile-badge rounded-full border-[var(--color-border)]">
      {label}
    </Badge>
  )
}

export function ToolTile({
  id,
  snapshot,
  firstName,
  isOpen,
  onToggle,
  coachDraft,
  onCoachDraftChange,
  onSendPrompt,
}: ToolTileProps) {
  const isCoach = id === 'coach'

  return (
    <DashCompactTile
      icon={
        isCoach ? (
          <MessageCircle strokeWidth={1.75} aria-hidden />
        ) : (
          <Pill strokeWidth={1.75} aria-hidden />
        )
      }
      iconClassName={isCoach ? 'dash-tile-icon--coach' : 'dash-tile-icon--meds'}
      title={isCoach ? 'DIOS Coach' : 'Medication timing'}
      subtitle={tileSubhead(
        isCoach
          ? 'Ask about your body clock, results, and your care plan.'
          : `${snapshot.medicationsDueTonight} meds due tonight aligned to your body clock schedule.`
      )}
      isOpen={isOpen}
      onToggle={onToggle}
      panel={
        isCoach ? (
          <CoachPanel
            firstName={firstName}
            snapshot={snapshot}
            draft={coachDraft}
            onDraftChange={onCoachDraftChange}
            onSendPrompt={onSendPrompt}
          />
        ) : (
          <MedsPanel medications={snapshot.medications} vdrUnresolved={snapshot.bloodPanel.vdrFlagUnresolved} />
        )
      }
    />
  )
}

function CoachPanel({
  firstName,
  snapshot,
  draft,
  onDraftChange,
  onSendPrompt,
}: {
  firstName: string
  snapshot: PatientSnapshot
  draft: string
  onDraftChange: (value: string) => void
  onSendPrompt: (prompt: string) => void
}) {
  const prompts = coachQuickPrompts()

  return (
    <div className="dash-panel-stack">
      <div className="dash-panel-body rounded-2xl border border-white/70 bg-white/60 px-3 py-2.5">
        Hi {firstName}. Across your TipTraQ nights you fell asleep about {snapshot.clockDrift} minutes
        after your body-clock target ({snapshot.dlmoEstimate}) — that rhythm slip contributes{' '}
        {snapshot.darkYears} Dark Years to your metabolic age. Want to know how to turn that around?
      </div>
      <div className="dash-panel-actions">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSendPrompt(prompt)}
            className="dash-head rounded-full border border-white/75 bg-white/55 px-3 py-1.5 dash-panel-chip hover:bg-white/70"
          >
            {prompt}
          </button>
        ))}
      </div>
      <form
        className="dash-panel-inline"
        onSubmit={(event) => {
          event.preventDefault()
          if (draft.trim()) onSendPrompt(draft.trim())
        }}
      >
        <input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Ask anything about your body clock…"
          className="dash-head min-w-0 flex-1 rounded-xl border border-white/75 bg-white/60 px-3 py-2.5 dash-panel-body outline-none"
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
    <div className="dash-panel-stack">
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
        <ul className="dash-panel-stack list-none p-0">
          {medications.map((med) => (
            <li key={`${med.name}-${med.time}`} className="flex items-start justify-between dash-panel-row dash-panel-inline">
              <div className="min-w-0">
                <div className="flex items-center dash-panel-inline">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: med.colour }}
                    aria-hidden
                  />
                  <span className="dash-head font-medium">
                    {med.name}
                    {med.dose ? ` · ${med.dose}` : ''}
                  </span>
                  <span className="dash-sub">{med.time}</span>
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
