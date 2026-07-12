import Link from 'next/link'

import {
  MEMBER_DASHBOARD_COMMUNITY,
  DEEPDOSE_COMMUNITY_MATCHES,
  type CommunityMatch,
} from '@/lib/deepdose-marketing/community-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import { connectChatHref } from '@/lib/chat/connect-demo-peers'
import { cn } from '@/lib/utils/cn'

type CommunityMatchesPanelProps = {
  /** discovery = Sniffies-lean connect; marketing = glass tile; app = member cards */
  variant?: 'marketing' | 'app' | 'discovery'
  /** When true, Chat opens/creates a real DM; guests soft-gate via /?next=… */
  signedIn?: boolean
}

function profileHref(matchId: string): string {
  return `/connect/${matchId}`
}

function MatchCard({
  match,
  index,
  variant,
  signedIn,
}: {
  match: CommunityMatch
  index: number
  variant: 'marketing' | 'app' | 'discovery'
  signedIn: boolean
}) {
  const messageHref = connectChatHref(match.id, signedIn)

  if (variant === 'discovery') {
    return (
      <article className="dd-connect__tile">
        <Link
          href={profileHref(match.id)}
          className="dd-connect__tile-profile"
          aria-label={`${match.name} profile`}
        >
          <span
            className="dd-connect__tile-face"
            style={{ backgroundImage: `url(${communityFaceUrl(match.face, 320)})` }}
            aria-hidden
          />
        </Link>
        <div className="dd-connect__tile-bar">
          <Link href={profileHref(match.id)} className="dd-connect__name">
            {match.name}
          </Link>
          <Link href={messageHref} className="dd-connect__message">
            Chat
          </Link>
        </div>
      </article>
    )
  }

  if (variant === 'marketing') {
    return (
      <article className="dios-glass-inner sw-connect__match">
        <div className="sw-connect__match-top">
          <span
            className="sw-connect__avatar"
            style={{ backgroundImage: `url(${communityFaceUrl(match.face)})` }}
            aria-hidden
          />
          <div className="sw-connect__match-id">
            <p className="sw-connect__match-name">{match.name}</p>
            <p className="sw-connect__match-meta">
              {match.location} · Score {match.chemistryPct}
            </p>
          </div>
          <span className="sw-connect__match-rank" aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <p className="sw-connect__match-journey">{match.journey}</p>
        <Link href={messageHref} className="sw-dash__text-link sw-connect__match-link">
          Message
        </Link>
      </article>
    )
  }

  return (
    <Link
      href={messageHref}
      className={cn('seco-hero-tabs__panel-card', 'seco-hero-tabs__panel-card--media')}
    >
      <span className="seco-hero-tabs__media seco-hero-tabs__peers" aria-hidden>
        <span
          className="seco-hero-tabs__avatar"
          style={{ backgroundImage: `url(${communityFaceUrl(match.face)})` }}
        />
        <span className="seco-hero-tabs__peers-count">Score {match.chemistryPct}</span>
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

export function CommunityMatchesPanel({
  variant = 'app',
  signedIn = false,
}: CommunityMatchesPanelProps) {
  const copy = MEMBER_DASHBOARD_COMMUNITY.matches

  if (variant === 'discovery') {
    return (
      <div className="dd-connect__body">
        <p className="dd-connect__lede">{copy.support}</p>
        <section className="dd-connect__grid" aria-label="Friends">
          {DEEPDOSE_COMMUNITY_MATCHES.map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              index={index}
              variant="discovery"
              signedIn={signedIn}
            />
          ))}
        </section>
      </div>
    )
  }

  if (variant === 'marketing') {
    return (
      <article className="dios-glass-outer sw-dash__tile sw-connect__tile" aria-labelledby="connect-matches">
        <p id="connect-matches" className="seco-page__eyebrow sw-dash__tile-eyebrow">
          {copy.eyebrow}
        </p>
        <div className="sw-connect__match-grid">
          {DEEPDOSE_COMMUNITY_MATCHES.map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              index={index}
              variant="marketing"
              signedIn={signedIn}
            />
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
          <MatchCard
            key={match.id}
            match={match}
            index={index}
            variant="app"
            signedIn={signedIn}
          />
        ))}
      </div>
    </section>
  )
}
