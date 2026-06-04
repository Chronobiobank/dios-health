'use client'

import { useCallback, useState } from 'react'

import { DashboardBackground } from '@/components/patient-dashboard/dashboard-background'
import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { MeasureTile } from '@/components/patient-dashboard/measure-tile'
import { Section, TileGrid } from '@/components/patient-dashboard/section'
import { SnapshotTile } from '@/components/patient-dashboard/snapshot-tile'
import { ToolTile } from '@/components/patient-dashboard/tool-tile'
import type { PatientDashboardProps } from '@/lib/patient-dashboard/types'

type PanelId =
  | 'snapshot'
  | 'coach'
  | 'meds'
  | 'sleep'
  | 'vitd'
  | 'tiptraq'
  | 'completeness'

export function DashboardClient({
  greeting,
  fullName,
  avatarUrl,
  snapshot,
}: PatientDashboardProps) {
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null)
  const [coachDraft, setCoachDraft] = useState('')

  const togglePanel = useCallback((id: PanelId) => {
    setOpenPanel((prev) => (prev === id ? null : id))
  }, [])

  const openCoach = useCallback(() => {
    setOpenPanel('coach')
  }, [])

  const sendPrompt = useCallback((prompt: string) => {
    setCoachDraft(prompt)
    setOpenPanel('coach')
  }, [])

  return (
    <div className="patient-dashboard-shell relative min-h-screen" data-dashboard="patient-v2">
      <DashboardBackground />

      <div className="relative z-10 pb-[var(--patient-nav-offset)]">
        <DashboardNav
          greeting={greeting}
          fullName={fullName}
          avatarUrl={avatarUrl}
          onOpenCoach={openCoach}
        />

        <main className="mx-auto w-full max-w-[480px] space-y-6 px-4 py-4 sm:max-w-[640px]">
          <Section label="Daily snapshot">
            <SnapshotTile
              snapshot={snapshot}
              isOpen={openPanel === 'snapshot'}
              onToggle={() => togglePanel('snapshot')}
            />
          </Section>

          <Section label="Your tools">
            <TileGrid>
              <ToolTile
                id="coach"
                snapshot={snapshot}
                isOpen={openPanel === 'coach'}
                onToggle={() => togglePanel('coach')}
                coachDraft={coachDraft}
                onCoachDraftChange={setCoachDraft}
                onSendPrompt={sendPrompt}
              />
              <ToolTile
                id="meds"
                snapshot={snapshot}
                isOpen={openPanel === 'meds'}
                onToggle={() => togglePanel('meds')}
                coachDraft={coachDraft}
                onCoachDraftChange={setCoachDraft}
                onSendPrompt={sendPrompt}
              />
            </TileGrid>
          </Section>

          <Section label="What we measured">
            <TileGrid>
              {snapshot.measureTiles.map((tile) => (
                <MeasureTile
                  key={tile.id}
                  tile={tile}
                  isOpen={openPanel === tile.id}
                  onToggle={() => togglePanel(tile.id)}
                  onSendPrompt={sendPrompt}
                  onOpenCoach={openCoach}
                />
              ))}
            </TileGrid>
          </Section>
        </main>
      </div>
    </div>
  )
}
