'use client'

import { CalibrationStrip } from '@/components/dashboard/calibration-strip'
import {
  SnapshotAgeRow,
  SnapshotMetricLabel,
} from '@/components/patient-dashboard/snapshot-age-row'
import type { DashboardPanelId, PatientSnapshot } from '@/lib/patient-dashboard/types'

type SnapshotTileProps = {
  snapshot: PatientSnapshot
  openPanel: DashboardPanelId | null
  onTogglePanel: (id: DashboardPanelId) => void
}

export function SnapshotTile({ snapshot, openPanel, onTogglePanel }: SnapshotTileProps) {
  const {
    chronologicalAge,
    chronosomaticAge,
    darkYears,
    darkYearsHours,
    lightAlignment,
    clockDrift,
    fitzpatrickType,
    fitzpatrickLabel,
    latitude,
    locationName,
    season,
    solarZenith,
    chronotype,
    chronotypeSource,
    statNotes,
  } = snapshot

  return (
    <div className="glass-tile snapshot-tile w-full">
      <SnapshotAgeRow
        chronologicalAge={chronologicalAge}
        chronosomaticAge={chronosomaticAge}
        darkYears={darkYears}
      />

      <div className="snapshot-calibration">
        <CalibrationStrip
          fitzpatrickType={fitzpatrickType}
          fitzpatrickLabel={fitzpatrickLabel}
          latitude={latitude}
          locationName={locationName}
          season={season}
          solarZenith={solarZenith}
          chronotype={chronotype}
          chronotypeSource={chronotypeSource}
          openPanel={openPanel}
          togglePanel={onTogglePanel}
        />
      </div>

      <div className="snapshot-stat-row">
        <div className="snapshot-stat">
          <p className="snapshot-stat-value">{darkYearsHours}h</p>
          <SnapshotMetricLabel title="Dark years" description={statNotes.darkYearsHours} />
        </div>
        <div className="snapshot-stat">
          <p className="snapshot-stat-value">
            {lightAlignment}
            <span className="snapshot-stat-value__of">/100</span>
          </p>
          <SnapshotMetricLabel title="Light alignment" description={statNotes.lightAlignment} />
        </div>
        <div className="snapshot-stat">
          <p className="snapshot-stat-value">+{clockDrift}m</p>
          <SnapshotMetricLabel title="Clock drift" description={statNotes.clockDrift} />
        </div>
      </div>
    </div>
  )
}
