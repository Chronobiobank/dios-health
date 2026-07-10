'use client'

import { useMemo, useState } from 'react'

import {
  buildMockGridDoses,
  mockDoseAvatar,
} from '@/lib/deepdose-marketing/grid-feed-mocks'
import { DOSE_TAG_META, type Chronotype, type DoseUpload } from '@/lib/patient/dose-uploads'
import { usePatientDoses } from '@/lib/patient/use-patient-doses'
import { planProfileDisplayName, readPlanProfile } from '@/lib/patient/plan-profile'

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function DoseCard({
  dose,
  syncCount,
  onSync,
}: {
  dose: DoseUpload
  syncCount: number
  onSync: () => void
}) {
  const avatar =
    dose.isSelf
      ? readPlanProfile().avatarUrl ?? null
      : mockDoseAvatar(dose.displayName)
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
            <span className="dd-grid__tag" style={{ color: tag.cue }}>
              {tag.hash}
            </span>
            <span aria-hidden> · </span>
            {formatTime(dose.timestamp)}
          </p>
        </div>
        <span className="dd-grid__sri tabular-nums" title="Sleep Regularity Index">
          SRI {dose.sri}
        </span>
      </header>

      <div className="dd-grid__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dose.mediaUrl} alt="" className="dd-grid__photo" />
        {dose.isPremium ? (
          <div className="dd-grid__blur" aria-label="Premium dose locked">
            <p className="dd-grid__unlock">Unlock Dose: ${dose.unlockPrice.toFixed(2)}</p>
          </div>
        ) : null}
      </div>

      <footer className="dd-grid__card-foot">
        <button type="button" className="dd-grid__sync" onClick={onSync}>
          Sync · {syncCount}
        </button>
      </footer>
    </article>
  )
}

export function GridFeedView() {
  const { ready, doses, syncs, sync } = usePatientDoses()
  const [feed, setFeed] = useState<Chronotype>('lark')
  const mocks = useMemo(() => buildMockGridDoses(), [])

  const items = useMemo(() => {
    const self = doses
      .filter((d) => d.isSelf !== false)
      .map((d) => ({
        ...d,
        displayName: d.displayName || planProfileDisplayName() || 'You',
        isSelf: true as const,
      }))
    return [...self, ...mocks]
      .filter((d) => d.chronotype === feed)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [doses, mocks, feed])

  if (!ready) return null

  return (
    <div className="dd-grid">
      <div className="dd-grid__tabs" role="tablist" aria-label="Chronotype">
        <button
          type="button"
          role="tab"
          aria-selected={feed === 'lark'}
          className={feed === 'lark' ? 'dd-grid__tab dd-grid__tab--on' : 'dd-grid__tab'}
          onClick={() => setFeed('lark')}
        >
          Larks
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={feed === 'owl'}
          className={feed === 'owl' ? 'dd-grid__tab dd-grid__tab--on' : 'dd-grid__tab'}
          onClick={() => setFeed('owl')}
        >
          Owls
        </button>
      </div>

      <div className="dd-grid__feed">
        {items.length === 0 ? (
          <p className="dd-grid__empty">No doses in this feed yet.</p>
        ) : (
          items.map((dose) => (
            <DoseCard
              key={dose.id}
              dose={dose}
              syncCount={syncs[dose.id] ?? dose.syncCount}
              onSync={() => sync(dose.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
