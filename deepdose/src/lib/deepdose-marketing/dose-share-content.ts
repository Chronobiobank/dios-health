import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/**
 * Share / Dose — presence post → Sync.
 * Photos drive core use; adult unlock is a secondary upgrade.
 */

export const DOSE_SHARE_META = {
  title: `Dose · ${DEEPDOSE_NAME}`,
  description:
    'Post a presence photo into your tribe feed so people in your biological window can Sync.',
} as const

/** /dose composer */
export const DOSE_SHARE = {
  hint: 'Post your presence into your tribe feed.',
  support: 'No captions. Lead with presence so people in your window can Sync.',
  yourTribe: 'Your tribe · post your presence',
  otherTribe: 'Other tribe',
  posted: 'Posted',
  premium: {
    label: 'Adult doses',
    body: 'Optional upgrade. Presence stays free. Adult unlock is secondary.',
    cta: 'See Founders',
    href: '/founders',
  },
} as const

/** Profile Doses tile */
export const DOSE_ARCHIVE = {
  title: 'My daily doses',
  cta: 'Post your dose',
  ctaHref: '/dose',
  emptyTitle: 'Show up to Sync',
  emptyBody:
    'Post a presence photo into your tribe feed. These images are how people recognize you, and why they upgrade.',
  emptyCta: 'Post your dose',
  feedCta: 'Feed',
  feedHref: '/grid',
} as const

/** chronotype feed empty */
export const DOSE_FEED_EMPTY = {
  before: 'No presence here yet.',
  post: 'Post your dose',
  sync: 'Find people who are awake',
} as const
