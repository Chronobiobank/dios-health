'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { SnapshotAgeRow } from '@/components/patient-dashboard/snapshot-age-row'
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
    circadianAge,
    yearsLost,
    recoveryYears,
    socialJetlag,
    syncScore,
    phaseDrift,
    dlmoEstimate,
  } = snapshot

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
          circadianAge={circadianAge}
          yearsLost={yearsLost}
        />

        <div className="snapshot-stat-row">
          <p className="snapshot-stat">
            <strong>{socialJetlag}h</strong>
            Social jetlag
          </p>
          <p className="snapshot-stat">
            <strong>{syncScore}</strong>
            Sync score
          </p>
          <p className="snapshot-stat">
            <strong>+{phaseDrift}m</strong>
            Phase drift
          </p>
        </div>

        <div className="snapshot-cta-bar">
          <span>
            Fix your body clock · recover <em>{recoveryYears} years</em> in 90 days
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
            <p className="text-[15px] font-medium text-[var(--text-primary)]">Age breakdown</p>
            <div className="mt-3 space-y-2 text-[14px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Calendar years</span>
                <span className="font-medium">{Math.round(chronologicalAge)} years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Circadian years</span>
                <span className="font-medium">{circadianAge} years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Years lost</span>
                <span className="font-medium text-[var(--dash-metric-loss)]">{yearsLost}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">DLMO estimate</span>
                <span className="font-medium">{dlmoEstimate}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Social jetlag</span>
                <span className="font-medium">{socialJetlag}h</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-[var(--researcher-avatar-text)]">
              <span>See re-entrainment plan</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
