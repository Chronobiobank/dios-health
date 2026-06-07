'use client'

import { useCallback, useMemo, useState } from 'react'

import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { COACH_ASK_LABEL } from '@/lib/coach/brand'
import { BodyClockDetailTile } from '@/components/patient-dashboard/body-clock-detail-tile'
import { DoseWindowsTile } from '@/components/patient-dashboard/dose-windows-tile'
import { MeasureTile } from '@/components/patient-dashboard/measure-tile'
import { Section, TileGrid } from '@/components/patient-dashboard/section'
import { NextStepsTile } from '@/components/patient-dashboard/next-steps-tile'
import { ToolTile } from '@/components/patient-dashboard/tool-tile'
import { FirstLightScanBanner } from '@/components/patient-dashboard/first-light-scan-banner'
import { useFirstLightDailyStatus } from '@/components/patient-dashboard/use-first-light-daily-status'
import { LightCheckIn } from '@/components/retinomic/light-check-in'
import { nextStepsFromSnapshotContext } from '@/lib/patient-dashboard/build-patient-next-steps'
import type { DashboardPanelId, PatientDashboardProps } from '@/lib/patient-dashboard/types'
import { resolvePhoticDayPhase } from '@/lib/retinomic/photic-dose'

type DashboardClientProps = PatientDashboardProps & {
  /** Reserve space for mobile patient bottom nav (authenticated dashboard). */
  reserveBottomNav?: boolean
}

/**
 * Single patient dashboard UI — used by /dashboard, /how-it-works, and /dev/dashboard.
 * Lead: dose windows + First Light. Drill-down: body clock detail (Chronopathic Age, spectrum).
 */
export function DashboardClient({
  greeting,
  fullName,
  avatarUrl,
  firstName,
  snapshot,
  feedFreshness = 'none',
  lightCheckIn = null,
  firstLightWindow = null,
  firstLightDailyStatus: serverFirstLightDailyStatus = null,
  confirmedDosesToday = [],
  reserveBottomNav = false,
}: DashboardClientProps) {
  const [openPanel, setOpenPanel] = useState<DashboardPanelId | null>(null)
  const [coachDraft, setCoachDraft] = useState('')

  const mergedFirstLightDaily = useFirstLightDailyStatus(serverFirstLightDailyStatus)
  const scanActionable =
    firstLightWindow?.scanDue === true || firstLightWindow?.outsideEntrainment === true

  const displayNextSteps = useMemo(() => {
    const serverAt = serverFirstLightDailyStatus?.completedAt ?? null
    const mergedAt = mergedFirstLightDaily?.completedAt ?? null
    if (!mergedFirstLightDaily || serverAt === mergedAt) {
      return snapshot.nextSteps
    }
    return nextStepsFromSnapshotContext(snapshot, {
      feedFreshness,
      firstLightDailyStatus: mergedFirstLightDaily,
      firstLightScanActionable: scanActionable,
    })
  }, [
    feedFreshness,
    mergedFirstLightDaily,
    scanActionable,
    serverFirstLightDailyStatus?.completedAt,
    snapshot,
  ])

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

  const explainRisk = useCallback(() => {
    sendPrompt(
      snapshot.chronoimmuneProfile
        ? 'Explain my Chronoimmune indication zone and what PTH lower-third target means for my protocol.'
        : 'Explain my metabolic risk across the body clock spectrum.'
    )
  }, [sendPrompt, snapshot.chronoimmuneProfile])

  return (
    <div className="patient-dashboard-shell relative min-h-screen" data-dashboard="patient-v2">
      <div className={reserveBottomNav ? 'relative z-10 pb-[var(--patient-nav-offset)] md:pb-0' : 'relative z-10'}>
        <main className="dash-dashboard-main">
          <DashboardNav greeting={greeting} fullName={fullName} avatarUrl={avatarUrl} />

          <Section label="Today's script">
            {firstLightWindow ? (
              <FirstLightScanBanner
                window={firstLightWindow}
                dailyStatus={mergedFirstLightDaily}
              />
            ) : null}
            <DoseWindowsTile
              snapshot={snapshot}
              dailyStatus={mergedFirstLightDaily}
              confirmedDosesToday={confirmedDosesToday}
            />
            {lightCheckIn &&
            (feedFreshness === 'stale' || feedFreshness === 'none' || feedFreshness === 'aging') ? (
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
            <NextStepsTile nextSteps={displayNextSteps} onSendPrompt={sendPrompt} />
          </Section>

          <Section label={COACH_ASK_LABEL}>
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

          <Section label="Body clock detail">
            <BodyClockDetailTile
              snapshot={snapshot}
              isOpen={openPanel === 'body-clock'}
              onToggle={() => togglePanel('body-clock')}
              openPanel={openPanel}
              onTogglePanel={togglePanel}
              onExplainRisk={explainRisk}
            />
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
