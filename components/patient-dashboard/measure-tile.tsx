'use client'

import { Clock, Droplets, Moon, ShieldAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { DashCompactTile } from '@/components/patient-dashboard/dash-compact-tile'
import { Button } from '@/components/ui/button'
import type { MeasureTileData } from '@/lib/patient-dashboard/types'

type MeasureTileProps = {
  tile: MeasureTileData
  isOpen: boolean
  onToggle: () => void
  onSendPrompt: (prompt: string) => void
  onOpenCoach: () => void
}

const ICONS: Record<MeasureTileData['id'], LucideIcon> = {
  sleep: Clock,
  vitd: Droplets,
  tiptraq: Moon,
  completeness: ShieldAlert,
}

const ICON_CLASS: Record<MeasureTileData['id'], string> = {
  sleep: 'dash-tile-icon--sleep',
  vitd: 'dash-tile-icon--vitd',
  tiptraq: 'dash-tile-icon--tiptraq',
  completeness: 'dash-tile-icon--completeness',
}

export function MeasureTile({ tile, isOpen, onToggle, onSendPrompt, onOpenCoach }: MeasureTileProps) {
  const Icon = ICONS[tile.id]

  return (
    <DashCompactTile
      icon={<Icon strokeWidth={1.75} aria-hidden />}
      iconClassName={ICON_CLASS[tile.id]}
      title={tile.label}
      subtitle={tile.subtitle}
      isOpen={isOpen}
      onToggle={onToggle}
      panel={
        <>
          <div className="dash-panel-stack">
            {tile.panelRows.map((row) => (
              <div key={row.key} className="flex items-start justify-between dash-panel-row dash-panel-inline">
                <span className="dash-sub">{row.key}</span>
                <span className="dash-head text-right font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="dash-panel-actions mt-[var(--dash-tile-gap)]">
            {tile.panelActions.map((action) => (
              <Button
                key={action.label}
                type="button"
                size="sm"
                variant="outline"
                className="dash-panel-action border-[var(--color-border)] bg-white/45"
                onClick={() => {
                  if (action.opensCoach) {
                    onOpenCoach()
                    return
                  }
                  if (action.prompt) onSendPrompt(action.prompt)
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </>
      }
    />
  )
}
