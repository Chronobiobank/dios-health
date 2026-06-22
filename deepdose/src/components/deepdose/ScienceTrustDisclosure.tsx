'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type ScienceTrustDisclosureProps = {
  id?: string
  title: string
  teaser?: string
  badge?: string
  icon?: ReactNode
  cue?: string
  defaultOpen?: boolean
  nested?: boolean
  className?: string
  children: ReactNode
}

/** Science page fold — concise summary row; detail on tap. */
export const ScienceTrustDisclosure = forwardRef<HTMLDetailsElement, ScienceTrustDisclosureProps>(
  function ScienceTrustDisclosure(
    { id, title, teaser, badge, icon, cue, defaultOpen = false, nested = false, className, children },
    ref,
  ) {
    const detailsRef = useRef<HTMLDetailsElement>(null)
    const scrollLockRef = useRef<number | null>(null)

    useImperativeHandle(ref, () => detailsRef.current as HTMLDetailsElement)

    useEffect(() => {
      const details = detailsRef.current
      if (!details) return

      const onToggle = () => {
        const lockedY = scrollLockRef.current
        scrollLockRef.current = null
        if (lockedY == null) return

        window.scrollTo({ top: lockedY, left: 0, behavior: 'instant' })

        if (details.open) {
          requestAnimationFrame(() => {
            details.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          })
        }
      }

      details.addEventListener('toggle', onToggle)
      return () => details.removeEventListener('toggle', onToggle)
    }, [])

    return (
      <details
        ref={detailsRef}
        id={id}
        className={cn(
          'seco-science-fold seco-app-card',
          nested && 'seco-science-fold--nested',
          className,
        )}
        style={cue ? ({ '--cue': cue } as CSSProperties) : undefined}
        open={defaultOpen || undefined}
      >
        <summary
          className="seco-science-fold__summary"
          onClick={() => {
            scrollLockRef.current = window.scrollY
          }}
        >
          <span className="seco-science-fold__head">
            {icon ? <span className="seco-science-fold__icon">{icon}</span> : null}
            <span className="seco-science-fold__head-copy">
              {badge ? <span className="seco-science-fold__badge">{badge}</span> : null}
              <span className="seco-science-fold__title">{title}</span>
              {teaser ? <span className="seco-science-fold__teaser">{teaser}</span> : null}
            </span>
          </span>
          <span className="seco-science-fold__chevron" aria-hidden="true" />
        </summary>
        <div className="seco-science-fold__body">{children}</div>
      </details>
    )
  },
)

type ScienceTrustFoldStackProps = {
  className?: string
  children: ReactNode
}

export function ScienceTrustFoldStack({ className, children }: ScienceTrustFoldStackProps) {
  return <div className={cn('seco-science-folds', className)}>{children}</div>
}
