import Link from 'next/link'

import {
  MEMBER_DASHBOARD_COMMUNITY,
  DEEPDOSE_COMMUNITY_MATCHES,
  type CommunityMatch,
} from '@/lib/deepdose-marketing/community-content'
import { cn } from '@/lib/utils/cn'

const FACE_BASE = 'https://randomuser.me/api/portraits'

type CommunityMatchesPanelProps = {
  /** marketing = dark glass connect page; app = member dashboard cards */
  variant?: 'marketing' | 'app'
}

function MatchCard({
  match,
  index,
  variant,
}: {
  match: CommunityMatch
  index: number
  variant: 'marketing' | 'app'
}) {
  if (variant === 'marketing') {
    return (
      <article className="dios-glass-inner sw-connect__match">
        <div className="sw-connect__match-top">
          <span
            className="sw-connect__avatar"
            style={{ backgroundImage: `url(${FACE_BASE}/${match.face}.jpg)` }}
            aria-hidden
          />
          <div className="sw-connect__match-id">
            <p className="sw-connect__match-name">{match.name}</p>
            <p className="sw-connect__match-meta">
              {match.location} · {match.chemistryPct}% chemistry
            </p>
          </div>
          <span className="sw-connect__match-rank" aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <p className="sw-connect__match-journey">{match.journey}</p>
        <Link href="/login" className="sw-dash__text-link sw-connect__match-link">
          Message
        </Link>
      </article>
    )
  }

  return (
    <Link
      href="/connect"
      className={cn('seco-hero-tabs__panel-card', 'seco-hero-tabs__panel-card--media')}
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

export function CommunityMatchesPanel({ variant = 'app' }: CommunityMatchesPanelProps) {
  const copy = MEMBER_DASHBOARD_COMMUNITY.matches

  if (variant === 'marketing') {
    return (
      <article className="dios-glass-outer sw-dash__tile sw-connect__tile" aria-labelledby="connect-matches">
        <p id="connect-matches" className="seco-page__eyebrow sw-dash__tile-eyebrow">
          {copy.eyebrow}
        </p>
        <div className="sw-connect__match-grid">
          {DEEPDOSE_COMMUNITY_MATCHES.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} variant="marketing" />
          ))}
        </div>
      </article>
    )
  }

  return (
    <section className="seco-app-card space-y-4 p-5 md:p-6">
      <div>
        <p className="seco-page__eyebrow">{copy.eyebrow}</p>
        <h2 className="seco-app-section-title">
          {copy.titleBefore}
          {copy.titleHighlight}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{copy.support}</p>
      </div>

      <div className="seco-hero-tabs__panel-rail seco-hero-tabs__panel-rail--grid">
        {DEEPDOSE_COMMUNITY_MATCHES.map((match, index) => (
          <MatchCard key={match.id} match={match} index={index} variant="app" />
        ))}
      </div>
    </section>
  )
}
