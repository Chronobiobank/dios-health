/** Seeded friend Reals for the daily feed (mock until friend graph ships). */

import { DEEPDOSE_COMMUNITY_MATCHES } from '@/lib/deepdose-marketing/community-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import { todayRealDate, type RealPost } from '@/lib/patient/real-posts'

const MOCK_OFF = ['22:40', '23:10', '00:15', '22:55', '23:30', '01:05'] as const
const MOCK_ON = ['06:45', '07:10', '08:20', '07:00', '07:40', '09:15'] as const

/** Lifestyle / room stills for BeReal-style mock posts (Unsplash). */
const MOCK_SCENE_PHOTOS = [
  '1505693416388-ac5ce068fe85',
  '1522771739844-6a9f6d5f14af',
  '1493809842364-78817add7ffb',
  '1484100356142-db6ab6244067',
  '1513690277738-c9a1b85a9f8e',
  '1556228453-efd6c1ff04f6',
] as const

function sceneUrl(photoId: string, size = 720): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${size}&h=${size}&q=80`
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
