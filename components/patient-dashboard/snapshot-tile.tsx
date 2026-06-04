'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { glass } from '@/components/patient-dashboard/constants'
import type { PatientSnapshot } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type SnapshotTileProps = {
  snapshot: PatientSnapshot
  isOpen: boolean
  onToggle: () => void
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 16" className="mx-auto h-4 w-6 text-[var(--calm-optimal)]" aria-hidden>
      <path
        d="M2 8h16M14 3l7 5-7 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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
        className={cn('glass-tile w-full rounded-3xl p-3 text-left', isOpen && 'ring-1 ring-white/70')}
        aria-expanded={isOpen}
      >
        <div className="grid grid-cols-3 items-stretch gap-2">
          <div
            className="flex flex-col items-center justify-center rounded-2xl px-2 py-4"
            style={{ border: `0.5px solid ${glass.hairline}` }}
          >
            <p className="text-[44px] font-medium leading-none text-[var(--text-primary)]">
              {Math.round(chronologicalAge)}
            </p>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">years old</p>
          </div>

          <div className="flex flex-col items-center justify-center px-2 py-4">
            <ArrowGlyph />
            <p className="text-[44px] font-medium leading-none text-[var(--calm-optimal)]">{yearsLost}</p>
            <p className="mt-1 text-center text-[13px] text-[var(--text-muted)]">years lost to jetlag</p>
          </div>

          <div
            className="flex flex-col items-center justify-center rounded-2xl px-2 py-4"
            style={{
              background: glass.circadianBg,
              border: `0.5px solid ${glass.circadianBorder}`,
            }}
          >
            <p className="text-[44px] font-medium leading-none text-[var(--text-primary)]">
              {Math.round(circadianAge)}
            </p>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">years old</p>
          </div>
        </div>

        <div
          className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center text-[12px] text-[var(--text-muted)]"
          style={{ borderColor: glass.hairline }}
        >
          <span>Social jetlag {socialJetlag}h</span>
          <span>Sync score {syncScore}</span>
          <span>Phase drift +{phaseDrift}m</span>
        </div>

        <p className="mt-3 text-center text-[13px] text-[var(--text-muted)]">
          Fix your body clock · recover{' '}
          <span className="font-medium text-[var(--color-brand)]">{recoveryYears} years</span> in 90 days
        </p>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="snapshot-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel rounded-3xl p-4"
          >
            <p className="text-[15px] font-medium text-[var(--text-primary)]">Age breakdown</p>
            <div className="mt-3 space-y-2 text-[14px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Chronological age</span>
                <span className="font-medium">{Math.round(chronologicalAge)} years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Circadian age</span>
                <span className="font-medium">{circadianAge} years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[var(--text-muted)]">Years lost</span>
                <span className="font-medium text-[var(--calm-optimal)]">{yearsLost}</span>
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
            <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-[var(--color-brand)]">
              <span>See re-entrainment plan</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
