'use client'

import { useCallback, useState } from 'react'

import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { MeasureTile } from '@/components/patient-dashboard/measure-tile'
import { Section, TileGrid } from '@/components/patient-dashboard/section'
import { SnapshotTile } from '@/components/patient-dashboard/snapshot-tile'
import { ToolTile } from '@/components/patient-dashboard/tool-tile'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import type { PatientDashboardProps } from '@/lib/patient-dashboard/types'

type PanelId =
  | 'snapshot'
  | 'coach'
  | 'meds'
  | 'sleep'
  | 'vitd'
  | 'tiptraq'
  | 'completeness'

type DashboardClientProps = PatientDashboardProps & {
  /** Reserve space for mobile patient bottom nav (authenticated dashboard). */
  reserveBottomNav?: boolean
}

export function DashboardClient({
  greeting,
  fullName,
  avatarUrl,
  snapshot,
  reserveBottomNav = true,
}: DashboardClientProps) {
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
      <div className={reserveBottomNav ? 'relative z-10 pb-[var(--patient-nav-offset)]' : 'relative z-10 pb-8'}>
        <DashboardNav greeting={greeting} fullName={fullName} avatarUrl={avatarUrl} />

        <main className="mx-auto w-full max-w-[480px] space-y-7 px-4 py-5 sm:max-w-[640px]">
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

        <PitchFooter />
      </div>
    </div>
  )
}
