'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

import type { DashboardPanelId } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

export type CalibrationStripProps = {
  fitzpatrickType: string
  fitzpatrickLabel: string
  latitude: number
  locationName: string
  season: string
  solarZenith: number
  chronotype: string
  chronotypeSource: string
  openPanel: DashboardPanelId | null
  togglePanel: (id: DashboardPanelId) => void
}

const STRIP_STYLE = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.55)',
  borderRadius: 14,
  padding: '10px 14px',
} as const

const PANEL_STYLE = {
  padding: '1rem 1.25rem',
  borderRadius: 18,
} as const

function ColumnDivider() {
  return (
    <div
      className="mx-1 w-px shrink-0 self-stretch"
      style={{ background: 'rgba(255,255,255,0.5)' }}
      aria-hidden
    />
  )
}

function StripColumn({
  value,
  label,
  why,
}: {
  value: string
  label: string
  why: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-[3px] px-0.5">
      <span className="calibration-strip__value max-w-full truncate text-center">
        {value}
      </span>
      <span className="calibration-strip__label max-w-full truncate">{label}</span>
      <span className="calibration-strip__why max-w-full">{why}</span>
    </div>
  )
}

function PanelRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-start justify-between gap-3 dash-panel-row">
      <span className="shrink-0 text-[var(--text-muted)]">{label}</span>
      <span
        className={cn(
          'max-w-[60%] text-right font-medium text-[var(--text-primary)]',
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  )
}

function WhyRow({ children }: { children: string }) {
  return (
    <div className="flex items-start justify-between gap-3 dash-panel-row">
      <span className="shrink-0 text-[var(--text-muted)]">Why it matters</span>
      <p className="calibration-panel-why">{children}</p>
    </div>
  )
}

export function CalibrationStrip({
  fitzpatrickType,
  fitzpatrickLabel,
  latitude,
  locationName,
  season,
  solarZenith,
  chronotype,
  chronotypeSource,
  openPanel,
  togglePanel,
}: CalibrationStripProps) {
  const isOpen = openPanel === 'calibration'
  const hemisphere = latitude < 0 ? 'S' : 'N'
  const latDisplay = `${Math.abs(latitude).toFixed(1)}°${hemisphere}`

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => togglePanel('calibration')}
        className={cn(
          'flex w-full min-w-0 items-center text-left transition-transform active:scale-[0.995]',
          isOpen && 'ring-1 ring-white/60'
        )}
        style={STRIP_STYLE}
        aria-expanded={isOpen}
      >
        <StripColumn
          value={`Type ${fitzpatrickType}`}
          label="Skin type"
          why="(Fitzpatrick · vitamin D calibration)"
        />
        <ColumnDivider />
        <StripColumn
          value={`${latDisplay} · ${season}`}
          label="Solar position"
          why={`(${locationName} · light dose calibration)`}
        />
        <ColumnDivider />
        <StripColumn
          value={chronotype}
          label="Chronotype"
          why="(TipTraQ · medication timing anchor)"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="calibration-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel"
            style={PANEL_STYLE}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <SlidersHorizontal
                  className="h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--researcher-avatar-text)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="dash-panel-heading">How your results are personalised to you</p>
              </div>
              <button
                type="button"
                onClick={() => togglePanel('calibration')}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/75 bg-white/45 text-[var(--text-primary)] hover:bg-white/70"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <PanelRow
                label="Fitzpatrick skin type"
                value={`Type ${fitzpatrickType} · ${fitzpatrickLabel}`}
              />
              <WhyRow>
                Darker skin absorbs less UV. Your vitamin D thresholds and VDR risk scores are
                corrected for your skin type — not calibrated to white European skin as most clinical
                systems are.
              </WhyRow>
              <PanelRow label="Location" value={locationName} />
              <PanelRow
                label="Solar zenith today"
                value={`${latDisplay} · ${solarZenith}° angle · ${season}`}
              />
              <WhyRow>
                Available daylight at your latitude and season is calibrated into your light
                alignment score. Your results reflect what is actually possible where you are today
                — not a population average.
              </WhyRow>
              <PanelRow label="Chronotype" value={`${chronotype} · ${chronotypeSource}`} />
              <WhyRow>
                Your medication times, Dark Years calculation, and DLMO estimate are all anchored to
                your personal body clock phase — not a population average.
              </WhyRow>
            </div>

            <p className="calibration-panel-note">
              These three inputs are what make your DIOS results yours — not a generic score built
              for someone else&apos;s biology, location, or clock.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
