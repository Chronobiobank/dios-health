'use client'

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
    chronologicalAge,
    chronosomaticAge,
    darkYears,
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
  } = snapshot

  return (
    <div className="glass-tile snapshot-tile w-full">
      <SnapshotHeroRow
        dlmoEstimate={dlmoEstimate}
        clockDrift={clockDrift}
        darkYears={darkYears}
        chronosomaticAge={chronosomaticAge}
        chronologicalAge={chronologicalAge}
        lightAlignment={lightAlignment}
        darkCycleNote={statNotes.clockDrift}
        lightCycleNote={statNotes.lightAlignment}
        chronopathicNote={`Chronopathic age is chronological age plus years lost to hibernation from your dark and light cycles. ${statNotes.darkYearsHours}`}
        chronologicalNote="Years since birth — your clock age before circadian drift."
      />

      <div className="snapshot-tile__risk-center">
        <MetabolicRiskTile
          embedded
          nodes={spectrumNodes}
          openPanel={openPanel}
          onTogglePanel={onTogglePanel}
          onExplainRisk={onExplainRisk ?? (() => {})}
        />
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
        openPanel={openPanel}
        onTogglePanel={onTogglePanel}
      />
    </div>
  )
}
