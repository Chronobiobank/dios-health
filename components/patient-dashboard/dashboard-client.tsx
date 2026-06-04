'use client'

import { useCallback, useState } from 'react'

import { CalibrationStrip } from '@/components/dashboard/calibration-strip'
import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { MeasureTile } from '@/components/patient-dashboard/measure-tile'
import { MetabolicRiskTile } from '@/components/patient-dashboard/metabolic-risk-tile'
import { Section, TileGrid } from '@/components/patient-dashboard/section'
import { SnapshotTile } from '@/components/patient-dashboard/snapshot-tile'
import { ToolTile } from '@/components/patient-dashboard/tool-tile'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import type { DashboardPanelId, PatientDashboardProps } from '@/lib/patient-dashboard/types'

type DashboardClientProps = PatientDashboardProps & {
  /** Reserve space for mobile patient bottom nav (authenticated dashboard). */
  reserveBottomNav?: boolean
}

export function DashboardClient({
  firstName,
  fullName,
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
      <div className={reserveBottomNav ? 'relative z-10 pb-[var(--patient-nav-offset)]' : 'relative z-10 pb-8'}>
        <div className="patient-dashboard-content">
          <DashboardNav firstName={firstName} fullName={fullName} />

          <main className="space-y-7 py-5">
          <Section label="Daily snapshot">
            <SnapshotTile
              snapshot={snapshot}
              isOpen={openPanel === 'snapshot'}
              onToggle={() => togglePanel('snapshot')}
            />
          </Section>

          <CalibrationStrip
            fitzpatrickType={snapshot.fitzpatrickType}
            fitzpatrickLabel={snapshot.fitzpatrickLabel}
            latitude={snapshot.latitude}
            locationName={snapshot.locationName}
            season={snapshot.season}
            solarZenith={snapshot.solarZenith}
            chronotype={snapshot.chronotype}
            chronotypeSource={snapshot.chronotypeSource}
            openPanel={openPanel}
            togglePanel={togglePanel}
          />

          <Section label="Metabolic Risk">
            <MetabolicRiskTile
              nodes={snapshot.spectrumNodes}
              openPanel={openPanel}
              onTogglePanel={togglePanel}
              onExplainRisk={() =>
                sendPrompt('Explain my Metabolic Risk across the Chronosomatic Spectrum.')
              }
            />
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
        </div>

        <PitchFooter />
      </div>
    </div>
  )
}
