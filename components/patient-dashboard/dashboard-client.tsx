'use client'

import { useCallback, useState } from 'react'

import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { MeasureTile } from '@/components/patient-dashboard/measure-tile'
import { Section, TileGrid } from '@/components/patient-dashboard/section'
import { NextStepsTile } from '@/components/patient-dashboard/next-steps-tile'
import { SnapshotTile } from '@/components/patient-dashboard/snapshot-tile'
import { ToolTile } from '@/components/patient-dashboard/tool-tile'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import type { DashboardPanelId, PatientDashboardProps } from '@/lib/patient-dashboard/types'

type DashboardClientProps = PatientDashboardProps & {
  /** Reserve space for mobile patient bottom nav (authenticated dashboard). */
  reserveBottomNav?: boolean
}

/**
 * Single patient dashboard UI — used by /dashboard, /how-it-works, and /dev/dashboard.
 * Change behaviour here (or in child components under components/patient-dashboard/), not in route pages.
 */
export function DashboardClient({
  greeting,
  firstName,
  fullName,
  avatarUrl,
  snapshot,
  reserveBottomNav = true,
}: DashboardClientProps) {
  const [openPanel, setOpenPanel] = useState<DashboardPanelId | null>(null)
  const [coachDraft, setCoachDraft] = useState('')

  const togglePanel = useCallback((id: DashboardPanelId) => {
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
      <div className={reserveBottomNav ? 'relative z-10 pb-[var(--patient-nav-offset)] md:pb-0' : 'relative z-10 pb-8 md:pb-0'}>
          <DashboardNav greeting={greeting} fullName={fullName} avatarUrl={avatarUrl} />

          <main className="dash-dashboard-main">
          <Section label="Daily snapshot">
            <SnapshotTile
              snapshot={snapshot}
              openPanel={openPanel}
              onTogglePanel={togglePanel}
              onExplainRisk={() =>
                sendPrompt('Explain my Metabolic Risk across the Chronosomatic Spectrum.')
              }
            />
          </Section>

          <Section label="Your next steps">
            <NextStepsTile nextSteps={snapshot.nextSteps} onSendPrompt={sendPrompt} />
          </Section>

          <Section label="Your tools">
            <TileGrid>
              <ToolTile
                id="coach"
                snapshot={snapshot}
                firstName={firstName}
                isOpen={openPanel === 'coach'}
                onToggle={() => togglePanel('coach')}
                coachDraft={coachDraft}
                onCoachDraftChange={setCoachDraft}
                onSendPrompt={sendPrompt}
              />
              <ToolTile
                id="meds"
                snapshot={snapshot}
                firstName={firstName}
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
