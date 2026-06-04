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

const ICON_TONES: Record<MeasureTileData['id'], string> = {
  sleep: 'bg-[var(--researcher-avatar-bg)] text-[var(--researcher-avatar-text)]',
  vitd: 'bg-[var(--lilac-light)] text-[var(--aubergine-mid)]',
  tiptraq: 'bg-[var(--gold-light)] text-[var(--gold)]',
  completeness: 'bg-white/60 text-[var(--calm-optimal)]',
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
        className={cn(
          'glass-tile flex h-full min-h-[196px] w-full flex-col p-5 text-left',
          isOpen && 'glass-tile--open'
        )}
        aria-expanded={isOpen}
      >
        <div className={cn('tool-tile-icon mb-4', ICON_TONES[tile.id])}>
          <Icon className="h-4 w-4" aria-hidden />
        </div>

        <p className="text-[1.75rem] font-medium leading-none text-[var(--dash-metric-brown)]">{tile.value}</p>
        <p className="mt-2 text-[15px] font-semibold leading-snug text-[var(--dash-metric-brown)]">{tile.label}</p>
        <p className="mt-1.5 flex-1 text-[13px] leading-snug text-[var(--dash-section-label)]">{tile.subtitle}</p>

        <div className="mt-4 space-y-2">
          <Badge variant="outline" className={cn('rounded-full text-[11px]', badgeClass(tile.badgeTone))}>
            {tile.badge}
          </Badge>
          <div className="flex items-center justify-between text-[12px] text-[var(--dash-section-label)]">
            <span>{tile.source}</span>
            <ArrowRight className="h-4 w-4 text-[var(--researcher-avatar-text)]" aria-hidden />
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
