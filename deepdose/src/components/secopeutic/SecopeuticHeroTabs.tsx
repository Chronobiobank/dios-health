'use client'

import Link from 'next/link'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { DEEPDOSE_LANDING_PLATFORM } from '@/lib/secopeutic/landing-content'
import { cn } from '@/lib/utils/cn'

type HeroPillar = (typeof DEEPDOSE_LANDING_PLATFORM.pillars)[number]
type HeroPanelItem = HeroPillar['panelItems'][number]

const HERO_TAB_ICONS: Record<HeroPillar['icon'], ReactElement> = {
  book: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  tools: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  clinics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
}

const HERO_TAB_ICON_TONES: Record<HeroPillar['icon'], string> = {
  book: 'learn',
  tools: 'tools',
  clinics: 'clinics',
}

function HeroPanelCard({
  item,
  index,
  layout,
}: {
  item: HeroPanelItem
  index: number
  layout?: 'grid'
}) {
  return (
    <Link href={item.href} className="seco-hero-tabs__panel-card">
      <p className="seco-hero-tabs__panel-card-title">{item.title}</p>
      <p className="seco-hero-tabs__panel-card-meta">{item.meta}</p>

      <span
        className={cn(
          'seco-hero-tabs__panel-rank',
          layout === 'grid' && 'seco-hero-tabs__panel-rank--grid'
        )}
        aria-hidden="true"
      >
        {index + 1}
      </span>
    </Link>
  )
}

export function SecopeuticHeroTabs() {
  const pillars = DEEPDOSE_LANDING_PLATFORM.pillars
  const [activeId, setActiveId] = useState<HeroPillar['id']>('quiz')

  const activePillar = pillars.find((pillar) => pillar.id === activeId) ?? pillars[0]
  const activeIndex = pillars.findIndex((pillar) => pillar.id === activeId)
  const panelLayout =
    'panelLayout' in activePillar && activePillar.panelLayout === 'grid' ? 'grid' : undefined

  return (
    <div className="seco-hero-tabs" data-active-index={activeIndex}>
      <div className="seco-hero-tabs__list" role="tablist" aria-label="Clinical pathway">
        {pillars.map((pillar) => {
          const isActive = pillar.id === activeId

          return (
            <button
              key={pillar.id}
              type="button"
              role="tab"
              id={`seco-hero-tab-${pillar.id}`}
              aria-selected={isActive}
              aria-controls="seco-hero-tabpanel"
              tabIndex={isActive ? 0 : -1}
              className={cn('seco-hero-tabs__tab', isActive && 'seco-hero-tabs__tab--active')}
              onClick={() => setActiveId(pillar.id)}
            >
              <span
                className={cn(
                  'seco-hero-tabs__icon',
                  `seco-hero-tabs__icon--${HERO_TAB_ICON_TONES[pillar.icon]}`
                )}
                aria-hidden="true"
              >
                {HERO_TAB_ICONS[pillar.icon]}
              </span>
              <span className="seco-hero-tabs__copy">
                <span className="seco-hero-tabs__label">{pillar.label}</span>
                <span className="seco-hero-tabs__body">{pillar.body}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="seco-hero-tabpanel"
        role="tabpanel"
        aria-labelledby={`seco-hero-tab-${activePillar.id}`}
        className="seco-hero-tabs__panel"
      >
        <div className="seco-hero-tabs__panel-head">
          <h2 className="seco-hero-tabs__panel-title">{activePillar.panelTitle}</h2>
          <Link href={activePillar.panelSeeAll.href} className="seco-hero-tabs__panel-link">
            {activePillar.panelSeeAll.label} →
          </Link>
        </div>

        {'panelHook' in activePillar && activePillar.panelHook ? (
          <p className="seco-hero-tabs__panel-hook">{activePillar.panelHook}</p>
        ) : null}

        <div
          className={cn(
            'seco-hero-tabs__panel-rail',
            panelLayout === 'grid' && 'seco-hero-tabs__panel-rail--grid'
          )}
        >
          {activePillar.panelItems.map((item, index) => (
            <HeroPanelCard
              key={`${activePillar.id}-${item.href}-${index}`}
              item={item}
              index={index}
              layout={panelLayout}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
