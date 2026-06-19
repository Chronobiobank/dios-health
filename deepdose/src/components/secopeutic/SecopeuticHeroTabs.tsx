'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { DEEPDOSE_LANDING_PLATFORM } from '@/lib/secopeutic/landing-content'
import type { LandingClinician } from '@/lib/secopeutic/landing-clinicians'
import { cn } from '@/lib/utils/cn'

type HeroPillar = (typeof DEEPDOSE_LANDING_PLATFORM.pillars)[number]
type HeroPanelItem = HeroPillar['panelItems'][number]

function getPanelClinicians(item: HeroPanelItem): readonly LandingClinician[] {
  return 'clinicians' in item && item.clinicians ? item.clinicians : []
}

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

const AVATAR_TONE_CLASS: Record<NonNullable<LandingClinician['tone']>, string> = {
  violet: 'seco-hero-tabs__panel-avatar--violet',
  amber: 'seco-hero-tabs__panel-avatar--amber',
  teal: 'seco-hero-tabs__panel-avatar--teal',
}

function ClinicianAvatar({ clinician }: { clinician: LandingClinician }) {
  if (clinician.image) {
    return (
      <Image
        src={clinician.image}
        alt={clinician.imageAlt ?? clinician.name}
        width={32}
        height={32}
        unoptimized
        className="seco-hero-tabs__panel-avatar"
      />
    )
  }

  const initials = clinician.initials ?? clinician.name.slice(0, 2).toUpperCase()
  const toneClass = clinician.tone ? AVATAR_TONE_CLASS[clinician.tone] : ''

  return (
    <span
      className={cn('seco-hero-tabs__panel-avatar seco-hero-tabs__panel-avatar--initials', toneClass)}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
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
  const clinicians = getPanelClinicians(item)
  const clinicianLabel = clinicians.map((clinician) => clinician.name).join(', ')

  return (
    <Link href={item.href} className="seco-hero-tabs__panel-card">
      <p className="seco-hero-tabs__panel-card-title">{item.title}</p>
      <p className="seco-hero-tabs__panel-card-meta">{item.meta}</p>

      {layout === 'grid' && clinicians.length > 0 ? (
        <div className="seco-hero-tabs__panel-card-footer">
          <div className="seco-hero-tabs__panel-avatars" aria-hidden="true">
            {clinicians.map((clinician) => (
              <ClinicianAvatar key={clinician.name} clinician={clinician} />
            ))}
          </div>
          <p className="seco-hero-tabs__panel-clinicians">{clinicianLabel}</p>
        </div>
      ) : null}

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
  const [activeId, setActiveId] = useState<HeroPillar['id']>('clinics')

  const activePillar = pillars.find((pillar) => pillar.id === activeId) ?? pillars[0]
  const activeIndex = pillars.findIndex((pillar) => pillar.id === activeId)
  const panelLayout =
    'panelLayout' in activePillar && activePillar.panelLayout === 'grid' ? 'grid' : undefined

  return (
    <div className="seco-hero-tabs" data-active-index={activeIndex}>
      <div className="seco-hero-tabs__list" role="tablist" aria-label="Platform pathways">
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
