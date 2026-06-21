import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type ScienceTrustDisclosureProps = {
  title: string
  teaser?: string
  badge?: string
  defaultOpen?: boolean
  nested?: boolean
  className?: string
  children: ReactNode
}

/** Science page fold — concise summary row; detail on tap. */
export function ScienceTrustDisclosure({
  title,
  teaser,
  badge,
  defaultOpen = false,
  nested = false,
  className,
  children,
}: ScienceTrustDisclosureProps) {
  return (
    <details
      className={cn(
        'seco-science-fold seco-app-card',
        nested && 'seco-science-fold--nested',
        className,
      )}
      open={defaultOpen || undefined}
    >
      <summary className="seco-science-fold__summary">
        <span className="seco-science-fold__head">
          {badge ? <span className="seco-science-fold__badge">{badge}</span> : null}
          <span className="seco-science-fold__title">{title}</span>
          {teaser ? <span className="seco-science-fold__teaser">{teaser}</span> : null}
        </span>
        <span className="seco-science-fold__chevron" aria-hidden="true" />
      </summary>
      <div className="seco-science-fold__body">{children}</div>
    </details>
  )
}

type ScienceTrustFoldStackProps = {
  className?: string
  children: ReactNode
}

export function ScienceTrustFoldStack({ className, children }: ScienceTrustFoldStackProps) {
  return <div className={cn('seco-science-folds', className)}>{children}</div>
}
