'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import {
  resolvePolyPlanMeds,
  syncStateForRisk,
} from '@/lib/medications/poly-plan-meds'
import {
  DEEPDOSE_PATIENT_PLAN_PERSONAL_BRIDGE,
  DEEPDOSE_PATIENT_PLAN_SHARING,
  DEEPDOSE_PATIENT_PLAN_TABS,
} from '@/lib/deepdose-marketing/landing-content'
import { buildPersonalTimingPath } from '@/lib/medications/home-to-onboarding'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { usePatientPlanProfile } from '@/lib/patient/use-patient-plan-profile'
import { PatientPlanProfileHeader } from '@/components/deepdose/PatientPlanProfileHeader'
import { PatientPlanTimingPanel } from '@/components/deepdose/PatientPlanTimingPanel'
import { PatientPlanDosingPanel } from '@/components/deepdose/PatientPlanDosingPanel'

const LANDING_TABS = DEEPDOSE_PATIENT_PLAN_TABS.landing

type PlanTab = (typeof LANDING_TABS)[number]['id']

const SHARING_PEERS = [
  { count: '2.4k', faces: ['women/44', 'men/32', 'women/68'] },
  { count: '860', faces: ['men/75', 'women/12', 'men/41'] },
] as const

const FACE_BASE = 'https://randomuser.me/api/portraits'

function resolveSharingHref(href: string, signupHref?: string) {
  return href === '/login' && signupHref ? signupHref : href
}

function SharingPanelAvatars({ index }: { index: number }) {
  const peer = SHARING_PEERS[index % SHARING_PEERS.length]

  return (
    <span className="seco-hero-tabs__media seco-hero-tabs__peers" aria-hidden>
      <span className="seco-hero-tabs__avatars">
        {peer.faces.map((face) => (
          <span
            key={face}
            className="seco-hero-tabs__avatar"
            style={{ backgroundImage: `url(${FACE_BASE}/${face}.jpg)` }}
          />
        ))}
      </span>
      <span className="seco-hero-tabs__peers-count">{peer.count} sharing</span>
    </span>
  )
}

function TabIcon({ variant }: { variant: PlanTab }) {
  if (variant === 'timing') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (variant === 'dosing') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
        <path d="M9 4h6v2.5H9z" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m8.5 13.5 2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.12" aria-hidden>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.25 10.85 7.5-3.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.25 13.15 7.5 3.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const APP_TABS = DEEPDOSE_PATIENT_PLAN_TABS.app

type PatientTimingPlanProps = {
  medCodes: string[]
  wake: string | null
  verdict: string
  signupHref?: string
  variant?: 'landing' | 'app'
  embedded?: boolean
}

export function PatientTimingPlan({
  medCodes,
  wake,
  verdict,
  signupHref = '/login',
  variant = 'landing',
  embedded = false,
}: PatientTimingPlanProps) {
  const [tab, setTab] = useState<PlanTab>('timing')
  const [biobankOn, setBiobankOn] = useState(false)
  const profile = usePatientPlanProfile(wake)

  const meds = useMemo(() => resolvePolyPlanMeds(medCodes), [medCodes])

  const syncedCount = meds.filter((m) => syncStateForRisk(m.meta.risk) === 'synced').length
  const reviewCount = meds.length - syncedCount
  const chronoTestHref = useMemo(
    () =>
      buildPersonalTimingPath({
        medCodes,
        wake: profile.wake ?? undefined,
      }),
    [medCodes, profile.wake]
  )

  const timingPanelProps = {
    meds,
    verdict,
    syncedCount,
    reviewCount,
  }

  function PlanFooterCta({ className }: { className?: string }) {
    return (
      <div className={marketingCtaClass(className)}>
        <Link href={chronoTestHref} className="seco-landing__btn seco-landing__btn--primary">
          {DEEPDOSE_PATIENT_PLAN_PERSONAL_BRIDGE.cta.label}
        </Link>
      </div>
    )
  }

  const profileHeader = (
    <PatientPlanProfileHeader
      firstName={profile.firstName}
      onFirstNameChange={profile.setFirstName}
      familyName={profile.familyName}
      onFamilyNameChange={profile.setFamilyName}
      avatarUrl={profile.avatarUrl}
      onAvatarChange={profile.setAvatarUrl}
      wake={profile.wake}
      onWakeChange={profile.setWake}
      medCount={meds.length}
      variant={variant === 'app' ? 'app' : 'landing'}
    />
  )

  if (variant === 'app') {
    const content = (
      <div className="patient-dash__plan">
        <div className="patient-dash__plan-surface">
          {profileHeader}

          <div
            className="patient-dash__tabs patient-dash__tabs--three"
            role="tablist"
            aria-label="Plan views"
          >
          {APP_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={cn('patient-dash__tab', tab === item.id && 'patient-dash__tab--active')}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'timing' && (
          <PatientPlanTimingPanel {...timingPanelProps} variant="app" />
        )}

        {tab === 'dosing' && (
          <PatientPlanDosingPanel meds={meds} wake={profile.wake} variant="app" />
        )}

        {tab === 'sharing' && (
          <ul className="patient-dash__share-list">
            {DEEPDOSE_PATIENT_PLAN_SHARING.items.map((item) => (
              <li key={item.href + item.title} className="patient-dash__share-row">
                {item.href === '/chronobiobank' ? (
                  <button
                    type="button"
                    className="patient-dash__share-toggle"
                    onClick={() => setBiobankOn((prev) => !prev)}
                    aria-pressed={biobankOn}
                  >
                    <span
                      className={cn(
                        'patient-dash__share-switch',
                        biobankOn && 'patient-dash__share-switch--on'
                      )}
                      aria-hidden
                    >
                      <span className="patient-dash__share-switch-knob" />
                    </span>
                    <span>
                      <p className="patient-dash__share-title">{item.title}</p>
                      <p className="patient-dash__share-meta">{item.meta}</p>
                    </span>
                  </button>
                ) : (
                  <>
                    <p className="patient-dash__share-title">{item.title}</p>
                    <p className="patient-dash__share-meta">{item.meta}</p>
                    <Link
                      href={resolveSharingHref(item.href, signupHref)}
                      className="patient-dash__share-link"
                    >
                      {DEEPDOSE_PATIENT_PLAN_SHARING.linkLabel}
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        </div>
        <PlanFooterCta />
      </div>
    )

    if (embedded) {
      return content
    }

    return <div className="patient-dash">{content}</div>
  }

  const activeTab = LANDING_TABS.find((item) => item.id === tab) ?? LANDING_TABS[0]

  return (
    <>
      <div className="seco-hero-tabs seco-hero-tabs--patient-plan">
      <div className="seco-hero-tabs__list" role="tablist" aria-label="Your medication plan">
        {LANDING_TABS.map((item) => {
          const isActive = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`seco-patient-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls="seco-patient-tabpanel"
              tabIndex={isActive ? 0 : -1}
              className={cn('seco-hero-tabs__tab', isActive && 'seco-hero-tabs__tab--active')}
              onClick={() => setTab(item.id)}
            >
              <span
                className={cn('seco-hero-tabs__icon', `seco-hero-tabs__icon--${item.tone}`)}
                aria-hidden
              >
                <TabIcon variant={item.id} />
              </span>
              <span className="seco-hero-tabs__copy">
                <span className="seco-hero-tabs__label">{item.label}</span>
                <span className="seco-hero-tabs__body">{item.body}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="seco-patient-tabpanel"
        role="tabpanel"
        aria-labelledby={`seco-patient-tab-${activeTab.id}`}
        className="seco-hero-tabs__panel"
      >
        <div
          className={cn(
            'seco-hero-tabs__panel-inner',
            tab === 'sharing' && 'seco-hero-tabs__panel-inner--sharing'
          )}
        >
          {profileHeader}
          {tab === 'sharing' ? (
            <div className="seco-hero-tabs__panel-rail seco-hero-tabs__panel-rail--grid">
              {DEEPDOSE_PATIENT_PLAN_SHARING.items.map((item, index) => (
                  <Link
                    key={item.title}
                    href={resolveSharingHref(item.href, signupHref)}
                    className={cn(
                      'seco-hero-tabs__panel-card',
                      item.showPeers && 'seco-hero-tabs__panel-card--media'
                    )}
                  >
                    {item.showPeers ? <SharingPanelAvatars index={index} /> : null}
                    <p className="seco-hero-tabs__panel-card-title">{item.title}</p>
                    <p className="seco-hero-tabs__panel-card-meta">{item.meta}</p>
                    <span
                      className="seco-hero-tabs__panel-rank seco-hero-tabs__panel-rank--grid"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                  </Link>
                ))}
            </div>
          ) : tab === 'timing' ? (
            <PatientPlanTimingPanel {...timingPanelProps} variant="landing" />
          ) : (
            <PatientPlanDosingPanel meds={meds} wake={profile.wake} variant="landing" />
          )}
        </div>
      </div>
      </div>
      <PlanFooterCta />
    </>
  )
}
