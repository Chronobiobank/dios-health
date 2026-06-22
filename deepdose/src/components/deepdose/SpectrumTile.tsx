import type { CSSProperties, ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

export type SpectrumTileProps = {
  cue: string
  label?: string
  title: ReactNode
  body?: ReactNode
  lead?: ReactNode
  rank?: number | string
  icon?: ReactNode
  foot?: ReactNode
  className?: string
  variant?: 'default' | 'hero' | 'muted' | 'compact'
  titleVariant?: 'default' | 'display' | 'formula'
  titleTag?: 'h2' | 'h3' | 'p'
  as?: ElementType
}

export function SpectrumTile({
  cue,
  label,
  title,
  body,
  lead,
  rank,
  icon,
  foot,
  className,
  variant = 'default',
  titleVariant = 'default',
  titleTag: TitleTag = 'h2',
  as: Tag = 'article',
}: SpectrumTileProps) {
  const titleClass = cn(
    'seco-spectrum-tile__title',
    titleVariant === 'display' && 'seco-spectrum-tile__title--display',
    titleVariant === 'formula' && 'seco-spectrum-tile__title--formula',
  )

  const content = (
    <>
      {icon || label ? (
        <div className="seco-spectrum-tile__head">
          {icon ? <span className="seco-spectrum-tile__icon">{icon}</span> : null}
          {label ? <span className="seco-spectrum-tile__cue">{label}</span> : null}
        </div>
      ) : null}
      <TitleTag className={titleClass}>{title}</TitleTag>
      {lead ? <p className="seco-spectrum-tile__lead">{lead}</p> : null}
      {body ? (
        typeof body === 'string' ? (
          <p className="seco-spectrum-tile__body">{body}</p>
        ) : (
          <div className="seco-spectrum-tile__body">{body}</div>
        )
      ) : null}
      {foot ? <div className="seco-spectrum-tile__foot">{foot}</div> : null}
    </>
  )

  return (
    <Tag
      className={cn(
        'seco-spectrum-tile',
        rank != null && 'seco-spectrum-tile--rank',
        lead != null && 'seco-spectrum-tile--stat',
        variant === 'hero' && 'seco-spectrum-tile--hero',
        variant === 'muted' && 'seco-spectrum-tile--muted',
        variant === 'compact' && 'seco-spectrum-tile--compact',
        className,
      )}
      style={{ '--cue': cue } as CSSProperties}
    >
      {rank != null ? (
        <>
          <div className="seco-spectrum-tile__content">{content}</div>
          <span className="seco-spectrum-tile__rank" aria-hidden="true">
            {typeof rank === 'number' ? String(rank).padStart(2, '0') : rank}
          </span>
        </>
      ) : (
        content
      )}
    </Tag>
  )
}

type SpectrumTileGridProps = {
  children: ReactNode
  cols?: 2 | 3
  sm2?: boolean
  className?: string
  as?: ElementType
  role?: string
  'aria-label'?: string
}

export function SpectrumTileGrid({
  children,
  cols = 2,
  sm2 = false,
  className,
  as: Tag = 'div',
  role,
  'aria-label': ariaLabel,
}: SpectrumTileGridProps) {
  return (
    <Tag
      className={cn(
        'seco-spectrum-tiles',
        cols === 2 && 'seco-spectrum-tiles--2',
        cols === 3 && 'seco-spectrum-tiles--3',
        sm2 && 'seco-spectrum-tiles--2-sm',
        className,
      )}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  )
}
