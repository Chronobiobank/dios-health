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
    eyebrow: 'Friends',
    titleBefore: 'People on ',
    titleHighlight: 'your clock',
    support: 'People whose sleep timing fits yours. See their doses. Message when it feels right.',
  },
  stories: {
    eyebrow: 'Stories',
    title: 'What others shared',
    support: 'Real nights. Shared scores. Better sleep together.',
  },
} as const

export const DEEPDOSE_COMMUNITY_MATCHES: readonly CommunityMatch[] = [
  {
    id: 'match-1',
    name: 'Ash R.',
    location: 'Leeds',
    journey: 'Late clock · logs most mornings',
    chemistryPct: 94,
    face: 'ash',
  },
  {
    id: 'match-2',
    name: 'Kai T.',
    location: 'Glasgow',
    journey: 'Same lights-off window as you',
    chemistryPct: 91,
    face: 'kai',
  },
  {
    id: 'match-3',
    name: 'River M.',
    location: 'Bristol',
    journey: 'Steady nights for months',
    chemistryPct: 88,
    face: 'river',
  },
  {
    id: 'match-4',
    name: 'Sage L.',
    location: 'Manchester',
    journey: 'Night owl · shares evening tips',
    chemistryPct: 86,
    face: 'sage',
  },
  {
    id: 'match-5',
    name: 'Rowan K.',
    location: 'London',
    journey: 'Afternoon dip · same wake time',
    chemistryPct: 84,
    face: 'rowan',
  },
  {
    id: 'match-6',
    name: 'Sol A.',
    location: 'Cardiff',
    journey: 'Wake-aligned nights · similar score',
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
    quote: 'I thought I needed another evening fix. Matching someone on my clock showed me what to change first.',
  },
  {
    id: 'story-2',
    name: 'Rowan',
    monthsOnPlatform: 9,
    quote: 'Finding someone with the same chemistry mattered more than any forum thread.',
  },
  {
    id: 'story-3',
    name: 'Sol',
    monthsOnPlatform: 22,
    quote: 'We compared notes, corrected what drifted, and kept what worked. That is the whole point.',
  },
] as const

/** @deprecated Use DEEPDOSE_COMMUNITY_STORIES */
export const UNMED_COMMUNITY_STORIES = DEEPDOSE_COMMUNITY_STORIES
