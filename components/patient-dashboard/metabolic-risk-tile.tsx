'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { DashTileExpandCue, DashTileExpandRow } from '@/components/patient-dashboard/dash-tile-expand-row'
import { ChronosomaticSpectrum } from '@/components/patient-dashboard/chronosomatic-spectrum'
import {
  dotStyleForSeverity,
  spectrumDotWrapStyle,
  SPECTRUM_SEVERITY_LABELS,
  SPECTRUM_SEVERITY_STYLES,
} from '@/lib/patient-dashboard/dashboard-indicators'
import type { DashboardPanelId, SpectrumNode, SpectrumNodeId } from '@/lib/patient-dashboard/types'
import type { SpectrumSeverity } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type MetabolicRiskTileProps = {
  nodes: SpectrumNode[]
  openPanel: DashboardPanelId | null
  onTogglePanel: (id: DashboardPanelId) => void
  onExplainRisk: () => void
  /** Inside daily snapshot — no section-level grid span. */
  embedded?: boolean
}

function severityBarFill(severity: SpectrumSeverity): string {
  return SPECTRUM_SEVERITY_STYLES[severity].border
}

function LegendItem({
  children,
  dot,
}: {
  children: ReactNode
  dot: ReactNode
}) {
  return (
    <span className="chronosomatic-spectrum__legend-item">
      {dot}
      <span>{children}</span>
    </span>
  )
}

export function MetabolicRiskTile({
  nodes,
  openPanel,
  onTogglePanel,
  onExplainRisk,
  embedded = false,
}: MetabolicRiskTileProps) {
  const openNode = nodes.find((node) => node.id === openPanel) ?? null

  const handleSelectNode = (id: SpectrumNodeId) => {
    onTogglePanel(id)
  }

  return (
    <div className={embedded ? 'dash-tile-group' : 'dash-tile-group col-span-2'}>
      <div
        className={cn(
          'metabolic-risk-tile w-full',
          embedded ? 'dios-glass-inner snapshot-metabolic-risk-tile' : 'glass-tile'
        )}
      >
        <p className="sr-only">Metabolic risk profile — chronopenic burden spectrum</p>

        <ChronosomaticSpectrum
          nodes={nodes}
          openNodeId={
            openPanel && nodes.some((n) => n.id === openPanel) ? (openPanel as SpectrumNodeId) : null
          }
          onSelectNode={handleSelectNode}
        />

        <DashTileExpandRow
          leading={
            <div
              className="chronosomatic-spectrum__legend metabolic-risk-tile__legend"
              role="list"
              aria-label="Risk severity key"
            >
              {SPECTRUM_SEVERITY_LABELS.map(({ severity, label }) => {
                const style = dotStyleForSeverity(severity)
                const dot = (
                  <span
                    className="chronosomatic-spectrum__legend-dot"
                    style={{
                      ...spectrumDotWrapStyle(style.size),
                      backgroundColor: style.fill,
                      borderColor: style.border,
                      borderWidth: style.borderWidth,
                    }}
                  />
                )
                return (
                  <LegendItem key={severity} dot={dot}>
                    {label}
                  </LegendItem>
                )
              })}
            </div>
          }
        >
          <DashTileExpandCue as="button" label="Metabolic risk profile" onClick={onExplainRisk} />
        </DashTileExpandRow>
      </div>

      <AnimatePresence initial={false}>
        {openNode ? (
          <motion.div
            key={`spectrum-${openNode.id}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel"
          >
            <p className="dash-panel-heading">{openNode.label}</p>
            <div className="h-2 overflow-hidden rounded-full bg-white/50">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${openNode.score}%`,
                  backgroundColor: severityBarFill(openNode.severity),
                }}
              />
            </div>
            <p className="dash-panel-muted leading-relaxed">
              <span className="dash-head font-medium">Reason: </span>
              {openNode.reason}
            </p>
            <p className="dash-panel-muted leading-relaxed">
              <span className="dash-head font-medium">Action: </span>
              {openNode.action}
            </p>
            <p className="dash-sub text-[0.6875rem] capitalize">
              Chronosomatic Spectrum · {openNode.severity}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
