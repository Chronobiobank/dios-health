'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { SleepScoreTipTraqLink } from '@/components/deepdose/SleepScoreTipTraqLink'
import {
  buildMockGridDoses,
  mockDoseAvatar,
} from '@/lib/deepdose-marketing/grid-feed-mocks'
import {
  APP_GROUP_DEFAULT,
  parseAppGroupId,
  type AppGroupId,
} from '@/lib/deepdose-marketing/app-groups'
import { sleepScoreBadge } from '@/lib/brand/sleep-score'
import { DOSE_FEED_EMPTY } from '@/lib/deepdose-marketing/dose-share-content'
import { DOSE_TAG_META, type DoseUpload } from '@/lib/patient/dose-uploads'
import { usePatientDoses } from '@/lib/patient/use-patient-doses'
import { planProfileDisplayName } from '@/lib/patient/plan-profile'
import { resolvePlanAvatarUrl } from '@/lib/patient/patient-landing-defaults'

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function readFeedFromLocation(): AppGroupId {
  try {
    return (
      parseAppGroupId(new URLSearchParams(window.location.search).get('clock')) ??
      APP_GROUP_DEFAULT
    )
  } catch {
    return APP_GROUP_DEFAULT
  }
}

function DoseCard({
  dose,
  syncCount,
  synced,
  onSync,
  selfAvatar,
}: {
  dose: DoseUpload
  syncCount: number
  synced: boolean
  onSync: () => void
  selfAvatar: string
}) {
  const avatar = dose.isSelf ? selfAvatar : mockDoseAvatar(dose.displayName)
  const tag = DOSE_TAG_META[dose.tag]

  return (
    <article className="dd-grid__card">
      <header className="dd-grid__card-head">
        <span
          className="dd-grid__avatar"
          style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
          aria-hidden
        />
        <div className="dd-grid__meta">
          <p className="dd-grid__name">{dose.displayName}</p>
          <p className="dd-grid__sub">
            <span className="dd-grid__tag">{tag.hash}</span>
            <span aria-hidden> · </span>
            {formatTime(dose.timestamp)}
          </p>
        </div>
        <span className="dd-grid__sri tabular-nums" title="chronotype score">
          {sleepScoreBadge(dose.sri)}
        </span>
      </header>

      <div className="dd-grid__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dose.mediaUrl} alt="" className="dd-grid__photo" />
        {dose.isPremium ? (
          <div className="dd-grid__blur" aria-label="Dose photo hidden">
            <p className="dd-grid__unlock">Photo shared with friends only</p>
          </div>
        ) : null}
      </div>

      <footer className="dd-grid__card-foot">
        <button
          type="button"
          className={synced ? 'dd-grid__sync dd-grid__sync--on' : 'dd-grid__sync'}
          onClick={onSync}
          aria-pressed={synced}
          disabled={synced}
        >
          {synced ? `Synced · ${syncCount}` : `Sync · ${syncCount}`}
        </button>
      </footer>
    </article>
  )
}

export function GridFeedView() {
  const pathname = usePathname() ?? '/grid'
  const { ready, doses, syncs, syncedByMe, sync } = usePatientDoses()
  const [feed, setFeed] = useState<AppGroupId>(APP_GROUP_DEFAULT)
  const mocks = useMemo(() => buildMockGridDoses(), [])
  const selfAvatar = resolvePlanAvatarUrl(null)

  useEffect(() => {
    setFeed(readFeedFromLocation())
  }, [pathname])

  const items = useMemo(() => {
    const self = doses
      .filter((d) => d.isSelf !== false)
      .map((d) => ({
        ...d,
        displayName: d.displayName || planProfileDisplayName() || 'You',
        isSelf: true as const,
      }))
    return [...self, ...mocks]
      .filter((d) => d.tag === feed)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [doses, mocks, feed])

  if (!ready) return null

  return (
    <div className="dd-grid">
      <SleepScoreTipTraqLink compact className="dd-grid__tiptraq" />

      <div className="dd-grid__feed">
        {items.length === 0 ? (
          <p className="dd-grid__empty">
            {DOSE_FEED_EMPTY.before}{' '}
            <Link href={`/dose?tag=${feed}`}>{DOSE_FEED_EMPTY.post}</Link>
            {' · '}
            <Link href="/matches">{DOSE_FEED_EMPTY.sync}</Link>
          </p>
        ) : (
          items.map((dose) => (
            <DoseCard
              key={dose.id}
              dose={dose}
              selfAvatar={selfAvatar}
              syncCount={syncs[dose.id] ?? dose.syncCount}
              synced={syncedByMe.has(dose.id)}
              onSync={() => sync(dose.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
