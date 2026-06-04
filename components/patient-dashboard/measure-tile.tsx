'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Clock, Droplets, Moon, ShieldAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MeasureTileData } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

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

function badgeClass(tone: MeasureTileData['badgeTone']) {
  switch (tone) {
    case 'act':
      return 'border-[var(--calm-critical)] text-[var(--calm-critical)]'
    case 'action':
      return 'border-[var(--gold)] text-[var(--gold)]'
    case 'study':
      return 'border-[var(--color-border)] text-[var(--text-muted)]'
    default:
      return 'border-[var(--researcher-avatar-text)] text-[var(--researcher-avatar-text)]'
  }
}

export function MeasureTile({ tile, isOpen, onToggle, onSendPrompt, onOpenCoach }: MeasureTileProps) {
  const Icon = ICONS[tile.id]

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={cn('glass-tile dash-tile flex w-full flex-col p-5 text-left', isOpen && 'glass-tile--open')}
        aria-expanded={isOpen}
      >
        <div className={cn('tool-tile-icon', ICON_CLASS[tile.id])}>
          <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
        </div>

        <p className="dash-tile-metric">{tile.value}</p>
        <p className="dash-tile-title">{tile.label}</p>
        <p className="dash-tile-subtitle">{tile.subtitle}</p>

        <div className="dash-tile-footer space-y-2">
          <Badge variant="outline" className={cn('rounded-full text-[11px]', badgeClass(tile.badgeTone))}>
            {tile.badge}
          </Badge>
          <div className="dash-tile-footer-meta">
            <span>{tile.source}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--researcher-avatar-text)]" aria-hidden />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key={`${tile.id}-panel`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-5"
          >
            <div className="space-y-2">
              {tile.panelRows.map((row) => (
                <div key={row.key} className="flex items-start justify-between gap-3 text-[14px]">
                  <span className="text-[var(--text-muted)]">{row.key}</span>
                  <span className="text-right font-medium text-[var(--text-primary)]">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tile.panelActions.map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-[var(--color-border)] bg-white/45 text-[13px]"
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
