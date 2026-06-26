import Link from 'next/link'

import {
  MEMBER_DASHBOARD_COMMUNITY,
  UNMED_COMMUNITY_STORIES,
} from '@/lib/deepdose-marketing/community-content'

export function CommunityStoryFeed() {
  const copy = MEMBER_DASHBOARD_COMMUNITY.stories

  return (
    <section className="seco-app-card space-y-4 p-5 md:p-6">
      <div>
        <p className="seco-page__eyebrow">{copy.eyebrow}</p>
        <h2 className="seco-app-section-title">{copy.title}</h2>
        <p className="mt-2 text-sm text-ink-muted">{copy.support}</p>
      </div>

      <ul className="space-y-3">
        {UNMED_COMMUNITY_STORIES.map((story) => (
          <li key={story.id}>
            <Link href="/partners" className="seco-hero-tabs__panel-card block">
              <p className="seco-hero-tabs__panel-card-title">{story.name}</p>
              <p className="seco-hero-tabs__panel-card-meta">
                {story.monthsOnPlatform} months on Unmed
              </p>
              <p className="mt-2 text-sm text-ink-muted">&ldquo;{story.quote}&rdquo;</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
