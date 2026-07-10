/** Community matching and story feed · member dashboard (mock until matching API ships). */

import type { CommunityFaceId } from '@/lib/deepdose-marketing/community-faces'

export type CommunityMatch = {
  id: string
  name: string
  location: string
  journey: string
  chemistryPct: number
  face: CommunityFaceId
}

export type CommunityStory = {
  id: string
  name: string
  monthsOnPlatform: number
  quote: string
}

export const MEMBER_DASHBOARD_COMMUNITY = {
  matches: {
    eyebrow: 'Your matches',
    titleBefore: 'Find your ',
    titleHighlight: 'chemistry',
    support:
      'Matched on body clock, medicines, and journey, not labels. Non-conformists who have been where you are.',
  },
  stories: {
    eyebrow: 'Stories',
    title: 'What others got back',
    support: 'Real journeys. Timed doses first, fewer prescriptions later.',
  },
} as const

export const DEEPDOSE_COMMUNITY_MATCHES: readonly CommunityMatch[] = [
  {
    id: 'match-1',
    name: 'Ash R.',
    location: 'Leeds',
    journey: 'Off sertraline after 8 months · same late clock as you',
    chemistryPct: 94,
    face: 'ash',
  },
  {
    id: 'match-2',
    name: 'Kai T.',
    location: 'Glasgow',
    journey: 'Retimed statin + metformin, then dropped one script',
    chemistryPct: 91,
    face: 'kai',
  },
  {
    id: 'match-3',
    name: 'River M.',
    location: 'Bristol',
    journey: 'Six-dose streak 120 days · Commons member',
    chemistryPct: 88,
    face: 'river',
  },
  {
    id: 'match-4',
    name: 'Sage L.',
    location: 'Manchester',
    journey: 'Night-owl clock · blackout dose fixed the evenings',
    chemistryPct: 86,
    face: 'sage',
  },
  {
    id: 'match-5',
    name: 'Rowan K.',
    location: 'London',
    journey: 'Shared metformin window · fewer afternoon crashes',
    chemistryPct: 84,
    face: 'rowan',
  },
  {
    id: 'match-6',
    name: 'Sol A.',
    location: 'Cardiff',
    journey: 'Same REM pattern · timed SSRI with wake, not the clock',
    chemistryPct: 82,
    face: 'sol',
  },
] as const

/** @deprecated Use DEEPDOSE_COMMUNITY_MATCHES */
export const UNMED_COMMUNITY_MATCHES = DEEPDOSE_COMMUNITY_MATCHES

export const DEEPDOSE_COMMUNITY_STORIES: readonly CommunityStory[] = [
  {
    id: 'story-1',
    name: 'Sage',
    monthsOnPlatform: 14,
    quote: 'I thought I needed the evening dose. My clock just needed the blackout dose first.',
  },
  {
    id: 'story-2',
    name: 'Rowan',
    monthsOnPlatform: 9,
    quote: 'Matching with someone on the same meds mattered more than any forum thread.',
  },
  {
    id: 'story-3',
    name: 'Sol',
    monthsOnPlatform: 22,
    quote: 'Commons data helped my GP trust the timing change · one less tablet within six months.',
  },
] as const

/** @deprecated Use DEEPDOSE_COMMUNITY_STORIES */
export const UNMED_COMMUNITY_STORIES = DEEPDOSE_COMMUNITY_STORIES
