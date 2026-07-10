'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import {
  buildMockFriendReals,
  mockFriendAvatarUrl,
} from '@/lib/deepdose-marketing/real-feed-mocks'
import type { RealPost } from '@/lib/patient/real-posts'
import { usePatientRealPosts } from '@/lib/patient/use-patient-real-posts'
import { planProfileDisplayName, readPlanProfile } from '@/lib/patient/plan-profile'

function formatPostedAt(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function RealCard({ post }: { post: RealPost }) {
  const avatar =
    post.isSelf
      ? readPlanProfile().avatarUrl ?? null
      : mockFriendAvatarUrl(post.displayName)

  return (
    <article className="dd-real__card seco-spectrum-tile">
      <header className="dd-real__card-head">
        <span
          className="dd-real__avatar"
          style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
          aria-hidden
        />
        <div className="dd-real__card-meta">
          <p className="dd-real__name">{post.displayName}</p>
          <p className="dd-real__time">{formatPostedAt(post.postedAt)}</p>
        </div>
        <div className="dd-real__stats" aria-label="Sleep metrics">
          <span className="dd-real__stat">
            <span className="dd-real__stat-value tabular-nums">{post.sri}</span>
            <span className="dd-real__stat-label">SRI</span>
          </span>
          <span className="dd-real__stat">
            <span className="dd-real__stat-value tabular-nums">{post.sleepOff}</span>
            <span className="dd-real__stat-label">Off</span>
          </span>
          <span className="dd-real__stat">
            <span className="dd-real__stat-value tabular-nums">{post.sleepOn}</span>
            <span className="dd-real__stat-label">On</span>
          </span>
        </div>
      </header>
      {/* Local / Unsplash preview */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.photoUrl} alt="" className="dd-real__photo" />
    </article>
  )
}

export function RealFeedView() {
  const { ready, today, hasPostedToday } = usePatientRealPosts()
  const mocks = useMemo(() => buildMockFriendReals(), [])

  const feed = useMemo(() => {
    const self = today
      ? {
          ...today,
          displayName: today.displayName || planProfileDisplayName() || 'You',
          isSelf: true as const,
        }
      : null
    const items = self ? [self, ...mocks] : mocks
    return [...items].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    )
  }, [today, mocks])

  if (!ready) return null

  return (
    <div className="dd-real__stack">
      {!hasPostedToday ? (
        <div className="dd-real__gate seco-spectrum-tile">
          <p className="dd-real__gate-copy">Post today’s Real to unlock the feed.</p>
          <Link href="/real/post" className="dd-real__gate-cta">
            Post
          </Link>
        </div>
      ) : null}

      <div className="dd-real__feed">
        {feed.map((post) => (
          <RealCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
