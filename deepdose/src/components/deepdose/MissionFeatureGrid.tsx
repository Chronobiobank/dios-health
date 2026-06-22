'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

export type MissionFeature = {
  id: string
  title: string
  teaser?: string
  badge?: string
  cue?: string
  icon?: ReactNode
  hashAnchors?: readonly string[]
  panelId?: string
  body: ReactNode
}

type MissionFeatureGridProps = {
  features: MissionFeature[]
  className?: string
}

/** Mission topic grid — headers stay in a 2-column layout; detail opens in a panel below. */
export function MissionFeatureGrid({ features, className }: MissionFeatureGridProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const hashSyncedRef = useRef(false)

  const openFeature = features.find((feature) => feature.id === openId) ?? null

  const revealPanel = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ block: 'nearest', behavior })
    })
  }, [])

  const toggle = useCallback(
    (id: string) => {
      setOpenId((current) => {
        const next = current === id ? null : id
        if (next) revealPanel()
        return next
      })
    },
    [revealPanel],
  )

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return

      const match = features.find(
        (feature) => feature.id === hash || feature.hashAnchors?.includes(hash),
      )
      if (!match) return

      setOpenId(match.id)

      const scrollTarget =
        hash !== match.id ? document.getElementById(hash) : panelRef.current

      requestAnimationFrame(() => {
        scrollTarget?.scrollIntoView({
          block: 'nearest',
          behavior: hashSyncedRef.current ? 'smooth' : 'auto',
        })
        hashSyncedRef.current = true
      })
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [features])

  return (
    <div className={cn('seco-science-folds seco-chronobiobank__feature-grid', className)}>
      <div className="seco-chronobiobank__feature-grid-tiles" role="list">
        {features.map((feature) => {
          const isOpen = openId === feature.id

          return (
            <button
              key={feature.id}
              type="button"
              role="listitem"
              className={cn(
                'seco-science-fold seco-science-fold--grid-tile seco-science-fold--grid-trigger seco-app-card',
                isOpen && 'is-open',
              )}
              style={feature.cue ? ({ '--cue': feature.cue } as CSSProperties) : undefined}
              aria-expanded={isOpen}
              aria-controls={isOpen ? 'mission-feature-panel' : undefined}
              onClick={() => toggle(feature.id)}
            >
              <span className="seco-science-fold__summary">
                <span className="seco-science-fold__head">
                  {feature.icon ? (
                    <span className="seco-science-fold__icon">{feature.icon}</span>
                  ) : null}
                  <span className="seco-science-fold__head-copy">
                    {feature.badge ? (
                      <span className="seco-science-fold__badge">{feature.badge}</span>
                    ) : null}
                    <span className="seco-science-fold__title">{feature.title}</span>
                    {feature.teaser ? (
                      <span className="seco-science-fold__teaser">{feature.teaser}</span>
                    ) : null}
                  </span>
                </span>
                <span
                  className={cn(
                    'seco-science-fold__chevron',
                    isOpen && 'seco-science-fold__chevron--open',
                  )}
                  aria-hidden="true"
                />
              </span>
            </button>
          )
        })}
      </div>

      {openFeature ? (
        <div
          ref={panelRef}
          id={openFeature.panelId ?? 'mission-feature-panel'}
          className="seco-chronobiobank__feature-expand seco-app-card"
          style={openFeature.cue ? ({ '--cue': openFeature.cue } as CSSProperties) : undefined}
        >
          <div className="seco-science-fold__body">{openFeature.body}</div>
        </div>
      ) : null}
    </div>
  )
}
