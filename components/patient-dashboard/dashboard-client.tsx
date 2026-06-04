'use client'

import { motion } from 'framer-motion'
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
      <div
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{ background: '#dff0e8' }}
        aria-hidden
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            background: 'rgba(145,210,180,0.5)',
            filter: 'blur(52px)',
            top: -50,
            left: -70,
          }}
          animate={{ x: [0, 28, -14, 0], y: [0, -18, 22, 0] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 280,
            height: 280,
            background: 'rgba(155,200,230,0.42)',
            filter: 'blur(52px)',
            top: 60,
            right: -55,
          }}
          animate={{ x: [0, -22, 18, 0], y: [0, 14, -26, 0] }}
          transition={{ duration: 19, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 260,
            height: 260,
            background: 'rgba(185,225,190,0.38)',
            filter: 'blur(52px)',
            bottom: 220,
            left: 10,
          }}
          animate={{ x: [0, 14, 0], y: [0, 18, 0] }}
          transition={{ duration: 23, ease: 'easeInOut', repeat: Infinity, delay: 4 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 240,
            background: 'rgba(170,215,238,0.35)',
            filter: 'blur(52px)',
            bottom: 80,
            right: -35,
          }}
          animate={{ x: [0, -28, 14, 0], y: [0, 18, -22, 0] }}
          transition={{ duration: 17, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
        />
      </div>
      <div className={reserveBottomNav ? 'relative z-10 pb-[var(--patient-nav-offset)]' : 'relative z-10 pb-8'}>
        <div className="patient-dashboard-content">
          <DashboardNav firstName={firstName} fullName={fullName} onOpenCoach={openCoach} />

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
