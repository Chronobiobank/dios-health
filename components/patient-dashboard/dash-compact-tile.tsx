'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DashCompactTileProps = {
  icon: ReactNode
  iconClassName?: string
  title: string
  subtitle: string
  isOpen: boolean
  onToggle: () => void
  panel?: ReactNode
}

/** Square-grid tile: icon + title on one line, short subhead, arrow footer. */
export function DashCompactTile({
  icon,
  iconClassName,
  title,
  subtitle,
  isOpen,
  onToggle,
  panel,
}: DashCompactTileProps) {
  return (
    <div className="dash-tile-group">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'glass-tile dash-tile dash-compact-tile flex w-full flex-col text-left',
          isOpen && 'glass-tile--open'
        )}
        aria-expanded={isOpen}
      >
        <div className="dash-compact-tile__head">
          <div className={cn('dash-compact-tile__icon', iconClassName)}>{icon}</div>
          <p className="dash-compact-tile__title">{title}</p>
        </div>
        <p className="dash-compact-tile__subtitle">{subtitle}</p>
        <div className="dash-compact-tile__expand" aria-hidden>
          <ArrowRight className="dash-compact-tile__arrow" strokeWidth={1.75} />
        </div>
        <span className="sr-only">See more</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && panel ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel"
          >
            {panel}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
