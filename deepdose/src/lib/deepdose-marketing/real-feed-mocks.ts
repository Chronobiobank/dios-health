/** Seeded friend Reals for the daily feed (mock until friend graph ships). */

import { DEEPDOSE_COMMUNITY_MATCHES } from '@/lib/deepdose-marketing/community-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import { todayRealDate, type RealPost } from '@/lib/patient/real-posts'

const MOCK_OFF = ['22:40', '23:10', '00:15', '22:55', '23:30', '01:05'] as const
const MOCK_ON = ['06:45', '07:10', '08:20', '07:00', '07:40', '09:15'] as const

/** Candid stills — same pool energy as Grid mocks. */
const MOCK_SCENE_PHOTOS = [
  '1541781774459-bb2af2f05b55',
  '1522708323590-d24dbb6b0267',
  '1453614512568-c4024d13c247',
  '1551632811-561732d1e306',
  '1476224203421-9ac39bcb3327',
  '1476480862126-209bfaa8edc8',
] as const

function sceneUrl(photoId: string, size = 720): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${size}&h=${size}&q=72`
}

export function buildMockFriendReals(now = new Date()): RealPost[] {
  const date = todayRealDate(now)
  return DEEPDOSE_COMMUNITY_MATCHES.map((match, index) => {
    const scene = MOCK_SCENE_PHOTOS[index % MOCK_SCENE_PHOTOS.length]!
    const posted = new Date(now)
    posted.setHours(7 + (index % 5), (index * 7) % 60, 0, 0)
    return {
      id: `mock-${match.id}-${date}`,
      date,
      photoUrl: sceneUrl(scene),
      sri: match.chemistryPct,
      sleepOff: MOCK_OFF[index % MOCK_OFF.length]!,
      sleepOn: MOCK_ON[index % MOCK_ON.length]!,
      displayName: match.name,
      postedAt: posted.toISOString(),
      isSelf: false,
    }
  })
}

/** Avatar for a mock friend Real card header. */
export function mockFriendAvatarUrl(displayName: string): string | null {
  const match = DEEPDOSE_COMMUNITY_MATCHES.find((m) => m.name === displayName)
  if (!match) return null
  return communityFaceUrl(match.face, 96)
}
