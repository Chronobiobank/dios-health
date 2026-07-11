/** Seeded feed doses for early birds / night owls — candid Unsplash stills. */

import { DEEPDOSE_COMMUNITY_MATCHES } from '@/lib/deepdose-marketing/community-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import {
  DOSE_TAGS,
  todayDoseDate,
  type Chronotype,
  type DoseTag,
  type DoseUpload,
} from '@/lib/patient/dose-uploads'

/**
 * Phone-snapshot energy by Medmaxxing cluster.
 * Sleep · stack · timing — no pets, plated food, or gym-studio stock.
 */
const SCENE_PHOTOS: Record<DoseTag, readonly string[]> = {
  RESETTER: [
    '1522771739844-6a9f6d5f14af', // bedroom · night lock-in
    '1514565131-fce0801e5785', // city dusk · owl nights
    '1522708323590-d24dbb6b0267', // apartment · window light
    '1505693416388-ac5ce068fe85', // quiet room · wind-down
  ],
  HIJACKER: [
    '1584308666744-24d5c474f2ae', // pills · stack close-up
    '1486312338219-ce68d2c6f44d', // laptop hands · late focus
    '1471864190281-a93a3070b6de', // tablets · AM dose
    '1576602976047-174e57a47881', // bottles · chemistry stash
  ],
  CROSSER: [
    '1544367567-0f2fcb009e0b', // morning stretch · phase
    '1518611012118-696072aa579a', // sunrise run · daylight
    '1571019614242-c5c5dee9f50b', // gym floor · load
    '1506126613408-eca07ce68773', // yoga mat · downshift
  ],
  BATTERY: [
    '1490645930847-3d94d77aee30', // kitchen counter · fuel
    '1546069901-ba9599a7e63c', // bowl · everyday fuel
    '1505576399270-aec009ca2114', // fridge · home stash
    '1495521821757-a1efb6729352', // coffee · wake cue
  ],
}

function sceneUrl(photoId: string, size = 720): string {
  // Slightly softer encode reads more like a phone share than a catalog still.
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${size}&h=${size}&q=72`
}

export function doseSceneUrl(tag: DoseTag, index: number): string {
  const pool = SCENE_PHOTOS[tag]
  return sceneUrl(pool[index % pool.length]!)
}

export function buildMockGridDoses(now = new Date()): DoseUpload[] {
  const date = todayDoseDate(now)
  return DEEPDOSE_COMMUNITY_MATCHES.map((match, index) => {
    const posted = new Date(now)
    posted.setHours(6 + (index % 10), (index * 11) % 60, 0, 0)
    const chronotype: Chronotype = index % 2 === 0 ? 'lark' : 'owl'
    const tag = DOSE_TAGS[index % DOSE_TAGS.length]!
    const isPremium = index === 2 || index === 5
    return {
      id: `mock-dose-${match.id}-${date}`,
      tag,
      mediaUrl: doseSceneUrl(tag, index),
      date,
      timestamp: posted.toISOString(),
      displayName: match.name,
      sri: match.chemistryPct,
      chronotype,
      isPremium,
      unlockPrice: isPremium ? 4.99 : 0,
      syncCount: 3 + (index % 9),
      isSelf: false,
    }
  })
}

export function mockDoseAvatar(displayName: string): string | null {
  const match = DEEPDOSE_COMMUNITY_MATCHES.find((m) => m.name === displayName)
  if (!match) return null
  return communityFaceUrl(match.face, 96)
}
