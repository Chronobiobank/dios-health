import Link from 'next/link'

import {
  MEMBER_DASHBOARD_COMMUNITY,
  UNMED_COMMUNITY_MATCHES,
  type CommunityMatch,
} from '@/lib/deepdose-marketing/community-content'
import { cn } from '@/lib/utils/cn'

const FACE_BASE = 'https://randomuser.me/api/portraits'

function MatchCard({ match, index }: { match: CommunityMatch; index: number }) {
  return (
    <Link
      href="/partners"
      className={cn(
        'seco-hero-tabs__panel-card',
        'seco-hero-tabs__panel-card--media'
      )}
    >
      <span className="seco-hero-tabs__media seco-hero-tabs__peers" aria-hidden>
        <span
          className="seco-hero-tabs__avatar"
          style={{ backgroundImage: `url(${FACE_BASE}/${match.face}.jpg)` }}
        />
        <span className="seco-hero-tabs__peers-count">{match.chemistryPct}% chemistry</span>
      </span>
      <p className="seco-hero-tabs__panel-card-title">{match.name}</p>
      <p className="seco-hero-tabs__panel-card-meta">
        {match.location} · {match.journey}
      </p>
      <span className="seco-hero-tabs__panel-rank seco-hero-tabs__panel-rank--grid" aria-hidden>
        {index + 1}
      </span>
    </Link>
  )
}

export function CommunityMatchesPanel() {
  const copy = MEMBER_DASHBOARD_COMMUNITY.matches

  return (
    <section className="seco-app-card space-y-4 p-5 md:p-6">
      <div>
        <p className="seco-page__eyebrow">{copy.eyebrow}</p>
        <h2 className="seco-app-section-title">{copy.title}</h2>
        <p className="mt-2 text-sm text-ink-muted">{copy.support}</p>
      </div>

      <div className="seco-hero-tabs__panel-rail seco-hero-tabs__panel-rail--grid">
        {UNMED_COMMUNITY_MATCHES.map((match, index) => (
          <MatchCard key={match.id} match={match} index={index} />
        ))}
      </div>
    </section>
  )
}
