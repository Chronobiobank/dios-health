'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { SnapshotAgeRow, SnapshotMetricLabel } from '@/components/patient-dashboard/snapshot-age-row'
import { formatBodyClockCta } from '@/lib/patient-dashboard/tile-copy'
import type { PatientSnapshot } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type SnapshotTileProps = {
  snapshot: PatientSnapshot
  isOpen: boolean
  onToggle: () => void
}

export function SnapshotTile({ snapshot, isOpen, onToggle }: SnapshotTileProps) {
  const {
    chronologicalAge,
    chronosomaticAge,
    darkYears,
    recoveryYears,
    darkYearsHours,
    lightAlignment,
    clockDrift,
  } = snapshot

  const bodyClockCta = formatBodyClockCta(recoveryYears)

  return (
    <div className="col-span-2 space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={cn('glass-tile w-full p-5 text-left', isOpen && 'glass-tile--open')}
        aria-expanded={isOpen}
      >
        <SnapshotAgeRow
          chronologicalAge={chronologicalAge}
          chronosomaticAge={chronosomaticAge}
          darkYears={darkYears}
        />

        <div className="snapshot-stat-row">
          <div className="snapshot-stat">
            <p className="snapshot-stat-value">{darkYearsHours}h</p>
            <SnapshotMetricLabel
              title="Dark years"
              description="(time in metabolic hibernation)"
            />
          </div>
          <div className="snapshot-stat">
            <p className="snapshot-stat-value">{lightAlignment}</p>
            <SnapshotMetricLabel
              title="Light alignment"
              description="(how closely your day matches your clock)"
            />
          </div>
          <div className="snapshot-stat">
            <p className="snapshot-stat-value">+{clockDrift}m</p>
            <SnapshotMetricLabel
              title="Clock drift"
              description="(how far your sleep slipped last night)"
            />
          </div>
        </div>

        <div className="snapshot-cta-bar">
          <span>
            {bodyClockCta.before}
            <em>{bodyClockCta.highlight}</em>
            {bodyClockCta.after}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="snapshot-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-5"
          >
            <p className="dash-panel-muted leading-relaxed">
              The UK Biobank study of 80,000 people proved that your light-dark cycle determines how
              fast you age metabolically. Each factor below adds Dark Years — time spent in metabolic
              hibernation.
            </p>
            <div className="mt-3 space-y-2 dash-panel-row">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Chronological age</span>
                <span className="font-medium">{Math.round(chronologicalAge)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Clock running late (body hibernating)</span>
                <span className="font-medium text-[var(--dash-metric-loss)]">+2.1 Dark Years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Vitamin D not absorbing</span>
                <span className="font-medium text-[var(--dash-metric-loss)]">+0.8 Dark Years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Low iron stores</span>
                <span className="font-medium text-[var(--dash-metric-loss)]">+0.3 Dark Years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Chronosomatic age today</span>
                <span className="font-medium">{chronosomaticAge}</span>
              </div>
            </div>
            <p className="mt-4 dash-panel-muted leading-relaxed">
              Restore your light-dark cycle and fix your vitamin D. Your Chronosomatic Age could fall
              to 61.8 — recovering {recoveryYears} years within 90 days.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 dash-panel-action font-medium text-[var(--researcher-avatar-text)]">
              <span>The science ↗</span>
              <span>Reduce dark years ↗</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
