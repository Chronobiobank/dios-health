'use client'

import { DashTileExpandCue, DashTileExpandRow } from '@/components/patient-dashboard/dash-tile-expand-row'
import { CircadianDesynchronyTree } from '@/components/patient-dashboard/circadian-desynchrony-tree'
import {
  CHRONOIMMUNE_ZONES,
  ZONE_COLOUR_STYLES,
} from '@/lib/chronoimmune/indication-zones'
import type { DashboardPanelId, SpectrumNode } from '@/lib/patient-dashboard/types'
import { desynchronyNodesFromSpectrumSeverity } from '@/lib/spectrum/desynchrony-tree'
import { cn } from '@/lib/utils'

type MetabolicRiskTileProps = {
  nodes: SpectrumNode[]
  openPanel: DashboardPanelId | null
  onTogglePanel: (id: DashboardPanelId) => void
  onExplainRisk: () => void
  embedded?: boolean
}

export function MetabolicRiskTile({
  nodes,
  onExplainRisk,
  embedded = false,
}: MetabolicRiskTileProps) {
  const activeNodeIds = desynchronyNodesFromSpectrumSeverity(nodes)

  return (
    <div className={embedded ? 'dash-tile-group' : 'dash-tile-group col-span-2'}>
      <div
        className={cn(
          'metabolic-risk-tile w-full',
          embedded ? 'dios-glass-inner snapshot-metabolic-risk-tile' : 'glass-tile'
        )}
      >
        <p className="sr-only">Circadian Desynchrony Spectrum — branching diagnostic model</p>

        <p className="desynchrony-tree__section-label font-mono text-[10px] uppercase tracking-widest text-black/45">
          Circadian Desynchrony Spectrum
        </p>

        <CircadianDesynchronyTree activeNodeIds={activeNodeIds} compact showAxisNote={false} />

        <DashTileExpandRow
          leading={
            <div
              className="chronosomatic-spectrum__legend metabolic-risk-tile__legend"
              role="list"
              aria-label="Indication zone colour key"
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
          <DashTileExpandCue as="button" label="Explain desynchrony tree" onClick={onExplainRisk} />
        </DashTileExpandRow>
      </div>
    </div>
  )
}
