'use client'

import { MessageCircle, Pill } from 'lucide-react'

import { DashCompactTile } from '@/components/patient-dashboard/dash-compact-tile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'
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
    'Why is my statin timed tonight? ↗',
    'When should I take my next dose? ↗',
    'Explain my body clock drift ↗',
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
      title={isCoach ? COACH_DISPLAY_NAME : 'Medication timing'}
      subtitle={tileSubhead(
        isCoach
          ? 'Plain English — three sentences max. Ask about today’s dose windows.'
          : 'Full schedule with timing rationale for each script.'
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
        Hi {firstName}. Your body clock phase is {snapshot.dlmoEstimate}
        {snapshot.clockDrift > 0 ? ` — about ${snapshot.clockDrift} minutes drift from target` : ''}.{' '}
        {snapshot.medicationsDueTonight > 0
          ? `${snapshot.medicationsDueTonight} dose ${snapshot.medicationsDueTonight === 1 ? 'window is' : 'windows are'} open tonight.`
          : 'Your dose windows are on schedule today.'}{' '}
        Ask me to explain any timing change.
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
          placeholder="Ask about your dose windows…"
          className="dash-head min-w-0 flex-1 rounded-xl border border-white/75 bg-white/60 px-3 py-2.5 dash-panel-body outline-none"
        />
        <Button type="submit" size="sm" className="dios-btn-on-light h-10 min-h-0 px-4 hover:opacity-90">
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
        <ul className="dash-meds-table dash-panel-stack list-none p-0">
          {medications.map((med) => (
            <li
              key={`${med.name}-${med.time}`}
              className="dash-meds-row flex items-start justify-between dash-panel-row dash-panel-inline"
            >
              <div className="min-w-0">
                <div className="flex items-center dash-panel-inline">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: med.colour }}
                    aria-hidden
                  />
                  <span className="dash-head dash-meds-name font-medium">
                    {med.name}
                    {med.dose ? (
                      <>
                        {' · '}
                        <span className="kz-tabular">{med.dose}</span>
                      </>
                    ) : null}
                  </span>
                  <span className="dash-sub kz-tabular">{med.time}</span>
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
