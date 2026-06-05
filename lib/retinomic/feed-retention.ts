export const FEED_AGING_MS = 12 * 60 * 60 * 1000
export const FEED_STALE_MS = 24 * 60 * 60 * 1000
export const RETURN_VISIT_MS = 24 * 60 * 60 * 1000

export type FeedFreshness = 'fresh' | 'aging' | 'stale' | 'none'

export function resolveFeedFreshness(
  observedAt: string | null | undefined,
  now = new Date()
): FeedFreshness {
  if (!observedAt) return 'none'
  const observed = new Date(observedAt)
  if (Number.isNaN(observed.getTime())) return 'none'
  const ageMs = now.getTime() - observed.getTime()
  if (ageMs < 0) return 'fresh'
  if (ageMs >= FEED_STALE_MS) return 'stale'
  if (ageMs >= FEED_AGING_MS) return 'aging'
  return 'fresh'
}

export function isSmartphoneFeedFresh(
  observedAt: string | null | undefined,
  now = new Date()
): boolean {
  const freshness = resolveFeedFreshness(observedAt, now)
  return freshness === 'fresh' || freshness === 'aging'
}

export function formatLastCheckInLabel(
  observedAt: string | null | undefined,
  now = new Date()
): string | null {
  if (!observedAt) return null
  const observed = new Date(observedAt)
  if (Number.isNaN(observed.getTime())) return null

  const diffMs = now.getTime() - observed.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 2) return 'just now'
  if (diffMin < 60) return `${diffMin} minutes ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
}

export function staleFeedNudge(
  observedAt: string | null | undefined,
  now = new Date()
): string | null {
  if (resolveFeedFreshness(observedAt, now) !== 'stale') return null
  const label = formatLastCheckInLabel(observedAt, now)
  return label
    ? `Last check-in ${label} — refresh your ring below`
    : 'No recent check-in — refresh your ring below'
}

export function agingFeedHint(
  observedAt: string | null | undefined,
  now = new Date()
): string | null {
  if (resolveFeedFreshness(observedAt, now) !== 'aging') return null
  const label = formatLastCheckInLabel(observedAt, now)
  return label ? `Last check-in ${label}` : null
}

export function isReturnDashboardVisit(
  accountCreatedAt: string | null | undefined,
  now = new Date()
): boolean {
  if (!accountCreatedAt) return false
  const created = new Date(accountCreatedAt)
  if (Number.isNaN(created.getTime())) return false
  return now.getTime() - created.getTime() >= RETURN_VISIT_MS
}

export function returnVisitInterventionIntro(
  firstName: string,
  feedFreshness: FeedFreshness
): string {
  if (feedFreshness === 'stale' || feedFreshness === 'none') {
    return `${firstName}, your light feed is due — run a quick check-in below to keep today's dose ring honest. Med timing and today's plan stay anchored to your baseline.`
  }
  if (feedFreshness === 'aging') {
    return `${firstName}, check in below when you can to keep your light dose current through the day.`
  }
  return `${firstName}, your phone feed is live — today's plan and med windows stay tuned to your body clock.`
}

export function returnVisitBaselineCopy(firstName: string, feedFreshness: FeedFreshness): {
  eyebrow: string
  title: string
  body: string
} {
  if (feedFreshness === 'stale' || feedFreshness === 'none') {
    return {
      eyebrow: 'Keep your dose current',
      title: `${firstName}, refresh your light ring.`,
      body: "Your eye baseline still anchors the ceiling — a quick check-in below updates today's melanopic dose.",
    }
  }
  return {
    eyebrow: 'Your eye baseline',
    title: "Keep today's dose honest",
    body: 'Your scan sets the light ceiling and med timing anchor. Check in on the light panel when your day shifts.',
  }
}
