'use client'

import { DashboardNav } from '@/components/patient-dashboard/dashboard-nav'
import { MetabolicDosePanel } from '@/components/retinomic/panels/metabolic-dose-panel'
import { PhoticDosePanel } from '@/components/retinomic/panels/photic-dose-panel'
import { InterventionGuide } from '@/components/dashboard/intervention-guide'
import { TipTraqSleepPanel } from '@/components/retinomic/panels/tiptraq-sleep-panel'
import type { RetinomicDashboardProps } from '@/lib/retinomic/types'
import type { DailyIntervention } from '@/src/lib/engine/types'

type RetinomicDashboardClientProps = RetinomicDashboardProps & {
  fullName: string
  avatarUrl: string | null
  dailyIntervention: DailyIntervention
}

export function RetinomicDashboardClient({
  greeting,
  fullName,
  avatarUrl,
  tier,
  melanopicLuxToday,
  melanopicLuxCeiling,
  photicPhase,
  lightIrisDetected,
  vitaminD3NmolL,
  vitaminB5UmolL,
  remCycleEfficiency,
  autonomicStrain,
  dailyIntervention,
}: RetinomicDashboardClientProps) {
  return (
    <div className="patient-dashboard-shell relative min-h-screen" data-dashboard="retinomic">
      <div className="relative z-10 pb-[var(--patient-nav-offset)] md:pb-0">
        <DashboardNav greeting={greeting} fullName={fullName} avatarUrl={avatarUrl} />
        <main className="dash-dashboard-main" aria-label="Retinomic protocol control panels">
          <InterventionGuide intervention={dailyIntervention} />
          <PhoticDosePanel
            melanopicLuxToday={melanopicLuxToday}
            melanopicLuxCeiling={melanopicLuxCeiling}
            phase={photicPhase}
            lightIrisDetected={lightIrisDetected}
          />
          <MetabolicDosePanel
            tier={tier}
            vitaminD3NmolL={vitaminD3NmolL}
            vitaminB5UmolL={vitaminB5UmolL}
          />
          <TipTraqSleepPanel
            tier={tier}
            remCycleEfficiency={remCycleEfficiency}
            autonomicStrain={autonomicStrain}
          />
        </main>
      </div>
    </div>
  )
}
