import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Section title row — sits above subsection tiles (not inside a media card). */
export function PitchSectionHead({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <header className={cn('pitch-section-head', className)}>
      <p className="pitch-section-head__eyebrow">{eyebrow}</p>
      <h2 className="pitch-section-head__title">{title}</h2>
      {subtitle ? <p className="pitch-section-head__subtitle hidden sm:block">{subtitle}</p> : null}
    </header>
  )
}

/** Non-media block under a section head (spectrum bars, disclaimer, CTAs). */
export function PitchSubsectionTile({
  children,
  className,
  flush,
}: {
  children: ReactNode
  className?: string
  /** Less padding when content is dense (e.g. spectrum rows). */
  flush?: boolean
}) {
  return (
    <article className={cn('pitch-subsection-tile', className)}>
      <div className={cn('pitch-subsection-tile__inner', flush && 'pitch-subsection-tile__inner--flush')}>
        {children}
      </div>
    </article>
  )
}

/** Groups a head + one or more subsection tiles with consistent rhythm. */
export function PitchSectionBlock({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('pitch-section-block flex flex-col gap-3 sm:gap-4', className)}>{children}</div>
}
