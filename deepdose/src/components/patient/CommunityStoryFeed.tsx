import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  MEMBER_DASHBOARD_COMMUNITY,
  DEEPDOSE_COMMUNITY_STORIES,
} from '@/lib/deepdose-marketing/community-content'

type CommunityStoryFeedProps = {
  /** marketing = dark glass connect page; app = member dashboard cards */
  variant?: 'marketing' | 'app'
}

export function CommunityStoryFeed({ variant = 'app' }: CommunityStoryFeedProps) {
  const copy = MEMBER_DASHBOARD_COMMUNITY.stories

  if (variant === 'marketing') {
    return (
      <article className="dios-glass-outer sw-dash__tile sw-connect__tile" aria-labelledby="connect-stories">
        <p id="connect-stories" className="seco-page__eyebrow sw-dash__tile-eyebrow">
          {copy.eyebrow}
        </p>
        <p className="sw-dash__tile-lead">{copy.title}</p>
        <p className="sw-dash__tile-note">{copy.support}</p>
        <ul className="sw-connect__stories">
          {DEEPDOSE_COMMUNITY_STORIES.map((story) => (
            <li key={story.id} className="dios-glass-inner sw-connect__story">
              <div className="sw-connect__story-head">
                <p className="sw-connect__story-name">{story.name}</p>
                <p className="sw-connect__story-meta">
                  {story.monthsOnPlatform} months on {DEEPDOSE_NAME}
                </p>
              </div>
              <p className="sw-connect__story-quote">&ldquo;{story.quote}&rdquo;</p>
            </li>
          ))}
        </ul>
      </article>
    )
  }

  return (
    <section className="seco-app-card space-y-4 p-5 md:p-6">
      <div>
        <p className="seco-page__eyebrow">{copy.eyebrow}</p>
        <h2 className="seco-app-section-title">{copy.title}</h2>
        <p className="mt-2 text-sm text-ink-muted">{copy.support}</p>
      </div>

      <ul className="space-y-3">
        {DEEPDOSE_COMMUNITY_STORIES.map((story) => (
          <li key={story.id}>
            <div className="seco-hero-tabs__panel-card block">
              <p className="seco-hero-tabs__panel-card-title">{story.name}</p>
              <p className="seco-hero-tabs__panel-card-meta">
                {story.monthsOnPlatform} months on {DEEPDOSE_NAME}
              </p>
              <p className="mt-2 text-sm text-ink-muted">&ldquo;{story.quote}&rdquo;</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
