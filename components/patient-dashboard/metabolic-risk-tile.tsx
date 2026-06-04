'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { ChronosomaticSpectrum } from '@/components/patient-dashboard/chronosomatic-spectrum'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  dotStyleForSeverity,
  isElevatedSeverity,
  SPECTRUM_SEVERITY_LABELS,
  SPECTRUM_SEVERITY_STYLES,
} from '@/lib/patient-dashboard/dashboard-indicators'
import type { DashboardPanelId, SpectrumNode, SpectrumNodeId } from '@/lib/patient-dashboard/types'
import type { SpectrumSeverity } from '@/lib/patient-dashboard/types'

type MetabolicRiskTileProps = {
  nodes: SpectrumNode[]
  openPanel: DashboardPanelId | null
  onTogglePanel: (id: DashboardPanelId) => void
  onExplainRisk: () => void
}

function elevatedCount(nodes: SpectrumNode[]): number {
  return nodes.filter((node) => isElevatedSeverity(node.severity)).length
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
}: MetabolicRiskTileProps) {
  const elevated = elevatedCount(nodes)
  const openNode = nodes.find((node) => node.id === openPanel) ?? null

  const handleSelectNode = (id: SpectrumNodeId) => {
    onTogglePanel(id)
  }

  return (
    <div className="col-span-2 space-y-3">
      <div className="glass-tile w-full p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="dash-tile-title !min-h-0">Metabolic Risk</p>
            <p className="mt-1 text-[0.6875rem] leading-snug text-[var(--text-muted)]">
              (which body systems your Dark Years are affecting)
            </p>
          </div>
          {elevated > 0 ? (
            <Badge
              variant="outline"
              className="shrink-0 rounded-full border-[#A32D2D] bg-[#FCEBEB] px-2.5 py-0.5 text-[0.6875rem] font-medium text-[#A32D2D]"
            >
              {elevated} at risk
            </Badge>
          ) : null}
        </div>

        <p className="sr-only">Chronosomatic Spectrum</p>

        <div className="mt-5">
          <ChronosomaticSpectrum
            nodes={nodes}
            openNodeId={openPanel && nodes.some((n) => n.id === openPanel) ? (openPanel as SpectrumNodeId) : null}
            onSelectNode={handleSelectNode}
          />
        </div>

        <div className="chronosomatic-spectrum__legend mt-4">
          {SPECTRUM_SEVERITY_LABELS.map(({ severity, label }) => {
            const style = dotStyleForSeverity(severity)
            const dot = (
              <span
                className="chronosomatic-spectrum__legend-dot"
                style={{
                  width: style.size,
                  height: style.size,
                  backgroundColor: style.fill,
                  borderColor: style.border,
                  borderWidth: style.borderWidth,
                }}
              />
            )
            if (severity === 'severe') {
              return (
                <LegendItem
                  key={severity}
                  dot={
                    <span className="chronosomatic-spectrum__legend-dot-wrap">
                      <motion.span
                        className="chronosomatic-spectrum__pulse-ring chronosomatic-spectrum__pulse-ring--legend"
                        style={{ borderColor: style.border }}
                        animate={{ scale: [0.75, 1.75], opacity: [0.85, 0] }}
                        transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity }}
                        aria-hidden
                      />
                      {dot}
                    </span>
                  }
                >
                  {label} · largest dot
                </LegendItem>
              )
            }
            return (
              <LegendItem key={severity} dot={dot}>
                {label}
              </LegendItem>
            )
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full border-[var(--color-border)] bg-white/45 dash-panel-action"
          onClick={onExplainRisk}
        >
          Explain my Metabolic Risk ↗
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {openNode ? (
          <motion.div
            key={`spectrum-${openNode.id}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-5"
          >
            <p className="dash-panel-heading">{openNode.label}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/50">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${openNode.score}%`,
                  backgroundColor: severityBarFill(openNode.severity),
                }}
              />
            </div>
            <p className="mt-4 dash-panel-muted leading-relaxed">
              <span className="font-medium text-[var(--text-primary)]">Reason: </span>
              {openNode.reason}
            </p>
            <p className="mt-3 dash-panel-muted leading-relaxed">
              <span className="font-medium text-[var(--text-primary)]">Action: </span>
              {openNode.action}
            </p>
            <p className="mt-3 text-[0.6875rem] text-[var(--text-muted)] capitalize">
              Chronosomatic Spectrum · {openNode.severity}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
