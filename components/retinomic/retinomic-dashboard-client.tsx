'use client'

import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { DemoDashboardNav } from '@/components/retinomic/demo-dashboard-nav'
import { BaselineScanPanel } from '@/components/retinomic/panels/baseline-scan-panel'
import { MetabolicDosePanel } from '@/components/retinomic/panels/metabolic-dose-panel'
import { PhoticDosePanel } from '@/components/retinomic/panels/photic-dose-panel'
import { InterventionGuide } from '@/components/dashboard/intervention-guide'
import { MedicationTimingPanel } from '@/components/retinomic/panels/medication-timing-panel'
import { TipTraqSleepPanel } from '@/components/retinomic/panels/tiptraq-sleep-panel'
import type { RetinomicDashboardProps } from '@/lib/retinomic/types'
import type { DailyIntervention } from '@/src/lib/engine/types'

type RetinomicDashboardClientProps = RetinomicDashboardProps & {
  fullName: string
  avatarUrl: string | null
  dailyIntervention: DailyIntervention
  /** Public /how-it-works — sample nav, no profile links */
  publicDemo?: boolean
}

export function RetinomicDashboardClient({
  greeting,
  firstName,
  fullName,
  avatarUrl,
  tier,
  baselineScan,
  dayOneIntro,
  bloodLockedCopy,
  sleepLockedCopy,
  liveMluxFeedInput,
  lightIrisDetected,
  vitaminD3NmolL,
  vitaminB5UmolL,
  remCycleEfficiency,
  autonomicStrain,
  dailyIntervention,
  medicationTiming,
  publicDemo = false,
}: RetinomicDashboardClientProps) {
  return (
    <div
      className="patient-dashboard-shell relative min-h-screen"
      data-dashboard="retinomic"
      data-public-demo={publicDemo ? 'true' : undefined}
    >
      <div className="relative z-10 pb-[var(--patient-nav-offset)] md:pb-0">
        {publicDemo ? (
          <DemoDashboardNav />
        ) : (
          <DashboardNav greeting={greeting} fullName={fullName} avatarUrl={avatarUrl} />
        )}
        <main className="dash-dashboard-main" aria-label="Dose intelligence control panels">
          {baselineScan ? <BaselineScanPanel baseline={baselineScan} firstName={firstName} /> : null}
          <InterventionGuide intervention={dailyIntervention} dayOneIntro={dayOneIntro} />
          {medicationTiming ? <MedicationTimingPanel plan={medicationTiming} publicDemo={publicDemo} /> : null}
          <PhoticDosePanel feedInput={liveMluxFeedInput} lightIrisDetected={lightIrisDetected} />
          <MetabolicDosePanel
            tier={tier}
            vitaminD3NmolL={vitaminD3NmolL}
            vitaminB5UmolL={vitaminB5UmolL}
            lockedTitle={bloodLockedCopy?.title}
            lockedBody={bloodLockedCopy?.body}
          />
          <TipTraqSleepPanel
            tier={tier}
            remCycleEfficiency={remCycleEfficiency}
            autonomicStrain={autonomicStrain}
            lockedTitle={sleepLockedCopy?.title}
            lockedBody={sleepLockedCopy?.body}
            lockedHref={sleepLockedCopy?.href}
            lockedCta={sleepLockedCopy?.cta}
          />
        </main>
      </div>
    </div>
  )
}
