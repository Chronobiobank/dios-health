'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { ChronoimmuneIndicationSpectrum } from '@/components/patient-dashboard/chronoimmune-indication-spectrum'
import { ChronoimmunePatientCard } from '@/components/patient-dashboard/chronoimmune-patient-card'
import { DashTileExpandCue, DashTileExpandRow } from '@/components/patient-dashboard/dash-tile-expand-row'
import {
  CHRONOIMMUNE_ZONES,
  ZONE_COLOUR_STYLES,
  getChronoimmuneZone,
  type ChronoimmuneZoneId,
} from '@/lib/chronoimmune/indication-zones'
import type { ChronoimmuneProfile } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type ChronoimmuneModuleTileProps = {
  profile: ChronoimmuneProfile
  onExplain?: () => void
  embedded?: boolean
}

export function ChronoimmuneModuleTile({
  profile,
  onExplain,
  embedded = false,
}: ChronoimmuneModuleTileProps) {
  const [openZoneId, setOpenZoneId] = useState<ChronoimmuneZoneId | null>(profile.zoneId)
  const [showProtocolCard, setShowProtocolCard] = useState(true)

  const activeZone = getChronoimmuneZone(profile.zoneId)
  const openZone = openZoneId ? getChronoimmuneZone(openZoneId) : null

  const handleSelectZone = (id: ChronoimmuneZoneId) => {
    setOpenZoneId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={embedded ? 'dash-tile-group' : 'dash-tile-group col-span-2'}>
      <div
        className={cn(
          'metabolic-risk-tile chronoimmune-module-tile w-full',
          embedded ? 'dios-glass-inner snapshot-metabolic-risk-tile' : 'glass-tile'
        )}
      >
        <p className="sr-only">Chronoimmune Indication Spectrum — Dose Intelligence OS</p>

        <ChronoimmuneIndicationSpectrum
          activeZoneId={profile.zoneId}
          openZoneId={openZoneId}
          onSelectZone={handleSelectZone}
        />

        <DashTileExpandRow
          leading={
            <div
              className="chronosomatic-spectrum__legend metabolic-risk-tile__legend chronoimmune-module-tile__legend"
              role="list"
              aria-label="Indication zone key"
            >
              {CHRONOIMMUNE_ZONES.map((zone) => {
                const style = ZONE_COLOUR_STYLES[zone.colour]
                return (
                  <span key={zone.id} className="chronosomatic-spectrum__legend-item">
                    <span
                      className="chronosomatic-spectrum__legend-dot"
                      style={{
                        width: style.size,
                        height: style.size,
                        minWidth: style.size,
                        backgroundColor: style.fill,
                        borderColor: style.border,
                        borderWidth: style.borderWidth,
                      }}
                    />
                    <span>Z{zone.id}</span>
                  </span>
                )
              })}
            </div>
          }
        >
          <DashTileExpandCue
            as="button"
            label={showProtocolCard ? 'Hide protocol card' : 'Show protocol card'}
            onClick={() => setShowProtocolCard((v) => !v)}
          />
          {onExplain ? (
            <DashTileExpandCue as="button" label="Explain indication" onClick={onExplain} />
          ) : null}
        </DashTileExpandRow>
      </div>

      <AnimatePresence initial={false}>
        {openZone ? (
          <motion.div
            key={`zone-${openZone.id}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel"
          >
            <p className="dash-panel-heading">
              Zone {openZone.id} — {openZone.title}
              {openZone.id === profile.zoneId ? (
                <span className="ml-2 font-normal text-[var(--text-muted)]">(assigned)</span>
              ) : null}
            </p>
            <p className="dash-panel-muted text-sm leading-relaxed">{openZone.indication}</p>
            <dl className="chronoimmune-zone-detail mt-3 grid gap-2 text-sm">
              <div>
                <dt className="dash-sub text-[10px] uppercase">D3 guidance</dt>
                <dd className="dash-panel-muted">{openZone.d3Guidance}</dd>
              </div>
              <div>
                <dt className="dash-sub text-[10px] uppercase">PTH expectation</dt>
                <dd className="dash-panel-muted">{openZone.pthExpectation}</dd>
              </div>
              <div>
                <dt className="dash-sub text-[10px] uppercase">Lab review</dt>
                <dd className="dash-panel-muted">{openZone.labReviewFrequency}</dd>
              </div>
            </dl>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showProtocolCard ? (
          <motion.div
            key="protocol-card"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ChronoimmunePatientCard
              profile={profile}
              patientId="sean-001"
              orderContext="patient"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="chronoimmune-zone-active-note dash-sub mt-2 text-[10px]">
        Active indication: Zone {activeZone.id} ({activeZone.shortLabel}) — cohort triage{' '}
        {profile.cohortTriageStatus} is separate from zone severity.
      </p>
    </div>
  )
}
