'use client'

import { ChronoimmuneModuleTile } from '@/components/patient-dashboard/chronoimmune-module-tile'
import { MetabolicRiskTile } from '@/components/patient-dashboard/metabolic-risk-tile'
import { SnapshotCalibrationGrid } from '@/components/patient-dashboard/snapshot-calibration-grid'
import { SnapshotHeroRow } from '@/components/patient-dashboard/snapshot-hero-row'
import type { DashboardPanelId, PatientSnapshot } from '@/lib/patient-dashboard/types'

type SnapshotTileProps = {
  snapshot: PatientSnapshot
  openPanel: DashboardPanelId | null
  onTogglePanel: (id: DashboardPanelId) => void
  onExplainRisk?: () => void
}

export function SnapshotTile({
  snapshot,
  openPanel,
  onTogglePanel,
  onExplainRisk,
}: SnapshotTileProps) {
  const {
    calendarAge,
    photonicAge,
    chronopenicBurdenYears,
    chronopenicBurdenScore,
    burdenTrendDirection,
    lightAlignment,
    clockDrift,
    dlmoEstimate,
    fitzpatrickType,
    fitzpatrickLabel,
    eyeColorLabel,
    latitude,
    locationName,
    season,
    solarZenith,
    chronotype,
    chronotypeSource,
    statNotes,
    spectrumNodes,
    retinomicBaseline,
    chronoimmuneProfile,
  } = snapshot

  return (
    <div className="glass-tile snapshot-tile w-full">
      <SnapshotHeroRow
        dlmoEstimate={dlmoEstimate}
        clockDrift={clockDrift}
        chronopenicBurdenYears={chronopenicBurdenYears}
        photonicAge={photonicAge}
        calendarAge={calendarAge}
        chronopenicBurdenScore={chronopenicBurdenScore}
        burdenTrendDirection={burdenTrendDirection}
        lightAlignment={lightAlignment}
        darkCycleNote={statNotes.clockDrift}
        lightCycleNote={statNotes.lightAlignment}
        photonicAgeNote={`Chronopathic Age is how old your circadian system is running — Calendar Age plus chronopenic burden from light, sleep, and rhythm drift. ${statNotes.darkYearsHours}`}
        calendarAgeNote="Calendar Age is years since birth — the baseline before photic drift."
      />

      <div className="snapshot-tile__risk-center">
        {chronoimmuneProfile ? (
          <ChronoimmuneModuleTile
            embedded
            profile={chronoimmuneProfile}
            onExplain={
              onExplainRisk
                ? () => onExplainRisk()
                : undefined
            }
          />
        ) : (
          <MetabolicRiskTile
            embedded
            nodes={spectrumNodes}
            openPanel={openPanel}
            onTogglePanel={onTogglePanel}
            onExplainRisk={onExplainRisk ?? (() => {})}
          />
        )}
      </div>

      <SnapshotCalibrationGrid
        fitzpatrickType={fitzpatrickType}
        fitzpatrickLabel={fitzpatrickLabel}
        eyeColorLabel={eyeColorLabel}
        latitude={latitude}
        locationName={locationName}
        season={season}
        solarZenith={solarZenith}
        chronotype={chronotype}
        chronotypeSource={chronotypeSource}
        retinomicBaseline={retinomicBaseline}
        openPanel={openPanel}
        onTogglePanel={onTogglePanel}
      />
    </div>
  )
}
