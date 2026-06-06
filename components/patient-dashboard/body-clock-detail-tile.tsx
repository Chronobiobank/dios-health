'use client'

import { ChevronDown } from 'lucide-react'

import { ChronoimmuneModuleTile } from '@/components/patient-dashboard/chronoimmune-module-tile'
import { MetabolicRiskTile } from '@/components/patient-dashboard/metabolic-risk-tile'
import { SnapshotCalibrationGrid } from '@/components/patient-dashboard/snapshot-calibration-grid'
import { SnapshotHeroRow } from '@/components/patient-dashboard/snapshot-hero-row'
import type { DashboardPanelId, PatientSnapshot } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type BodyClockDetailTileProps = {
  snapshot: PatientSnapshot
  isOpen: boolean
  onToggle: () => void
  openPanel: DashboardPanelId | null
  onTogglePanel: (id: DashboardPanelId) => void
  onExplainRisk?: () => void
}

export function BodyClockDetailTile({
  snapshot,
  isOpen,
  onToggle,
  openPanel,
  onTogglePanel,
  onExplainRisk,
}: BodyClockDetailTileProps) {
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
    <div className="glass-tile body-clock-detail-tile w-full">
      <button
        type="button"
        className="body-clock-detail-tile__toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="body-clock-detail-tile__toggle-copy">
          <p className="body-clock-detail-tile__eyebrow">Drill-down</p>
          <p className="body-clock-detail-tile__title">Body clock detail</p>
          <p className="body-clock-detail-tile__summary">
            Photonic Age {photonicAge} vs Calendar {calendarAge} ·{' '}
            {chronoimmuneProfile ? 'Chronoimmune zone' : 'metabolic spectrum'} · calibration
          </p>
        </div>
        <ChevronDown
          className={cn('body-clock-detail-tile__chevron', isOpen && 'is-open')}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div className="body-clock-detail-tile__panel">
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
            photonicAgeNote={`Photonic Age is how old your circadian system is running — Calendar Age plus chronopenic burden from light, sleep, and rhythm drift. ${statNotes.darkYearsHours}`}
            calendarAgeNote="Calendar Age is years since birth — the baseline before photic drift."
          />

          <div className="snapshot-tile__risk-center">
            {chronoimmuneProfile ? (
              <ChronoimmuneModuleTile
                embedded
                profile={chronoimmuneProfile}
                onExplain={onExplainRisk ? () => onExplainRisk() : undefined}
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
      ) : null}
    </div>
  )
}
