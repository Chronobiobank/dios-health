'use client'

import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DashTileExpandCueProps = {
  label: string
  labelClassName?: string
  className?: string
  /** Use `button` when the cue is its own control; `span` when nested in a tile `<button>`. */
  as?: 'span' | 'button'
  onClick?: () => void
}

/** Descriptor + arrow — sits inside {@link DashTileExpandRow}. */
export function DashTileExpandCue({
  label,
  labelClassName,
  className,
  as = 'span',
  onClick,
}: DashTileExpandCueProps) {
  const content = (
    <>
      <span className={cn('dash-tile-expand-cue__label', labelClassName)}>{label}</span>
      <ArrowRight className="dash-tile-expand-cue__icon" strokeWidth={1.75} aria-hidden />
    </>
  )

  if (as === 'button') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn('dash-tile-expand-cue dash-tile-expand-cue--button', className)}
      >
        {content}
      </button>
    )
  }

  return <span className={cn('dash-tile-expand-cue', className)}>{content}</span>
}

type DashTileExpandRowProps = {
  /** Optional left slot (e.g. severity legend). */
  leading?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Dedicated footer zone for expand / discover actions — white hairline above label + arrow.
 */
export function DashTileExpandRow({ leading, children, className }: DashTileExpandRowProps) {
  return (
    <div className={cn('dash-tile-expand-row', className)}>
      {leading ? <div className="dash-tile-expand-row__leading">{leading}</div> : null}
      <div className="dash-tile-expand-row__cue">{children}</div>
    </div>
  )
}
