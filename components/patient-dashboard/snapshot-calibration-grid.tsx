'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

import type { DashboardPanelId, RetinomicBaselineSummary } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type SnapshotCalibrationGridProps = {
  fitzpatrickType: string
  fitzpatrickLabel: string
  eyeColorLabel: string
  latitude: number
  locationName: string
  season: string
  solarZenith: number
  chronotype: string
  chronotypeSource: string
  retinomicBaseline?: RetinomicBaselineSummary | null
  openPanel: DashboardPanelId | null
  onTogglePanel: (id: DashboardPanelId) => void
}

function MiniTile({
  value,
  label,
  onClick,
  isOpen,
}: {
  value: string
  label: string
  onClick: () => void
  isOpen: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('snapshot-calibration-tile', isOpen && 'snapshot-calibration-tile--open')}
      aria-expanded={isOpen}
    >
      <span className="snapshot-calibration-tile__value">{value}</span>
      <span className="snapshot-calibration-tile__label">{label}</span>
    </button>
  )
}

export function SnapshotCalibrationGrid({
  fitzpatrickType,
  fitzpatrickLabel,
  eyeColorLabel,
  latitude,
  locationName,
  season,
  solarZenith,
  chronotype,
  chronotypeSource,
  retinomicBaseline = null,
  openPanel,
  onTogglePanel,
}: SnapshotCalibrationGridProps) {
  const isOpen = openPanel === 'calibration'
  const hemisphere = latitude < 0 ? 'S' : 'N'
  const latDisplay = `${Math.abs(latitude).toFixed(1)}°${hemisphere}`
  const toggle = () => onTogglePanel('calibration')

  return (
    <div className="snapshot-calibration-block">
      <div className="snapshot-calibration-grid">
        <MiniTile
          value={`Type ${fitzpatrickType}`}
          label="Skin colour"
          onClick={toggle}
          isOpen={isOpen}
        />
        <MiniTile value={eyeColorLabel} label="Eye colour" onClick={toggle} isOpen={isOpen} />
        <MiniTile
          value={latDisplay}
          label="GPS"
          onClick={toggle}
          isOpen={isOpen}
        />
        <MiniTile value={chronotype} label="Chronotype" onClick={toggle} isOpen={isOpen} />
      </div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="calibration-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <SlidersHorizontal
                  className="h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--researcher-avatar-text)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="dash-panel-heading">How your snapshot is personalised</p>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/75 bg-white/45 text-[var(--text-primary)] hover:bg-white/70"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-[var(--text-muted)]">Skin · </span>
                Type {fitzpatrickType} ({fitzpatrickLabel}) — melanopic dose calibration
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Eye · </span>
                {retinomicBaseline
                  ? `${eyeColorLabel} iris from retinomic scan · ITA ${retinomicBaseline.skinIta}°`
                  : `${eyeColorLabel} iris tone (proxy from skin type until you add a photo)`}
              </p>
              {retinomicBaseline?.hasOctThickness && retinomicBaseline.gclIplMicrons != null ? (
                <p>
                  <span className="text-[var(--text-muted)]">OCT · </span>
                  GCL-IPL {retinomicBaseline.gclIplMicrons} µm — Siloton structural layer adjusts light
                  bandwidth
                </p>
              ) : retinomicBaseline ? (
                <p>
                  <span className="text-[var(--text-muted)]">OCT · </span>
                  Optional Siloton scan node — adds structural thickness when you book in person
                </p>
              ) : null}
              <p>
                <span className="text-[var(--text-muted)]">GPS · </span>
                {locationName} · {latDisplay} · {season} · zenith {solarZenith}°
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Chronotype · </span>
                {chronotype} · {chronotypeSource}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
