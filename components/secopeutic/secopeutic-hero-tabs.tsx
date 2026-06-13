'use client'

import { BookOpen, LineChart, MapPin, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { SECOPEUTIC_LANDING_PLATFORM } from '@/lib/secopeutic/landing-content'
import { cn } from '@/lib/utils'

type HeroPillar = (typeof SECOPEUTIC_LANDING_PLATFORM.pillars)[number]
type HeroPanelItem = HeroPillar['panelItems'][number]

type HeroClinician = {
  name: string
  image?: string
  imageAlt?: string
  initials?: string
  tone?: 'violet' | 'amber' | 'teal'
}

function getPanelClinicians(item: HeroPanelItem): readonly HeroClinician[] {
  return 'clinicians' in item ? item.clinicians : []
}

const HERO_TAB_ICONS: Record<HeroPillar['icon'], LucideIcon> = {
  book: BookOpen,
  tools: LineChart,
  clinics: MapPin,
}

const HERO_TAB_ICON_TONES: Record<HeroPillar['icon'], string> = {
  book: 'learn',
  tools: 'tools',
  clinics: 'clinics',
}

const AVATAR_TONE_CLASS: Record<NonNullable<HeroClinician['tone']>, string> = {
  violet: 'seco-hero-tabs__panel-avatar--violet',
  amber: 'seco-hero-tabs__panel-avatar--amber',
  teal: 'seco-hero-tabs__panel-avatar--teal',
}

function ClinicianAvatar({ clinician }: { clinician: HeroClinician }) {
  if (clinician.image) {
    return (
      <Image
        src={clinician.image}
        alt={clinician.imageAlt ?? clinician.name}
        width={32}
        height={32}
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
  const pillars = SECOPEUTIC_LANDING_PLATFORM.pillars
  const [activeId, setActiveId] = useState<HeroPillar['id']>(pillars[0].id)

  const activePillar = pillars.find((pillar) => pillar.id === activeId) ?? pillars[0]
  const activeIndex = pillars.findIndex((pillar) => pillar.id === activeId)
  const panelLayout =
    'panelLayout' in activePillar && activePillar.panelLayout === 'grid' ? 'grid' : undefined

  return (
    <div className="seco-hero-tabs" data-active-index={activeIndex}>
      <div className="seco-hero-tabs__list" role="tablist" aria-label="Platform pathways">
        {pillars.map((pillar) => {
          const Icon = HERO_TAB_ICONS[pillar.icon]
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
                <Icon size={18} strokeWidth={1.75} />
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
