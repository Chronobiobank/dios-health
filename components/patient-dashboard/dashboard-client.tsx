'use client'

import { useCallback, useState } from 'react'

import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { MeasureTile } from '@/components/patient-dashboard/measure-tile'
import { Section, TileGrid } from '@/components/patient-dashboard/section'
import { NextStepsTile } from '@/components/patient-dashboard/next-steps-tile'
import { SnapshotTile } from '@/components/patient-dashboard/snapshot-tile'
import { ToolTile } from '@/components/patient-dashboard/tool-tile'
import { FirstLightScanBanner } from '@/components/patient-dashboard/first-light-scan-banner'
import { LightCheckIn } from '@/components/retinomic/light-check-in'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import type { DashboardPanelId, PatientDashboardProps } from '@/lib/patient-dashboard/types'
import { resolvePhoticDayPhase } from '@/lib/retinomic/photic-dose'

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
  feedFreshness = 'none',
  lightCheckIn = null,
  firstLightWindow = null,
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
            {firstLightWindow ? <FirstLightScanBanner window={firstLightWindow} /> : null}
            <SnapshotTile
              snapshot={snapshot}
              openPanel={openPanel}
              onTogglePanel={togglePanel}
              onExplainRisk={() =>
                sendPrompt(
                  snapshot.chronoimmuneProfile
                    ? 'Explain my Chronoimmune indication zone and what PTH lower-third target means for my protocol.'
                    : 'Explain my Metabolic Risk across the Chronosomatic Spectrum.'
                )
              }
            />
            {lightCheckIn &&
            (feedFreshness === 'stale' ||
              feedFreshness === 'none' ||
              feedFreshness === 'aging') ? (
              <div className="mt-3">
                <LightCheckIn
                  phase={resolvePhoticDayPhase()}
                  config={lightCheckIn}
                  feedFreshness={feedFreshness}
                  emphasize
                  onLogged={() => {
                    window.location.reload()
                  }}
                />
              </div>
            ) : null}
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
