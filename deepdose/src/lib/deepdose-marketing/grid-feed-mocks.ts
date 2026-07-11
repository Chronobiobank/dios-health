/** Seeded Grid doses for Larks / Owls — candid Unsplash stills (not studio stock). */

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
 * Avoid plated food, hotel beds, and gym-studio lighting.
 */
const SCENE_PHOTOS: Record<DoseTag, readonly string[]> = {
  RESETTER: [
    '1541781774459-bb2af2f05b55', // rumpled bed · night lock-in
    '1514565131-fce0801e5785', // city dusk · owl nights
    '1522708323590-d24dbb6b0267', // apartment · window light
    '1529156069898-49953e39b3ac', // friends on a ledge
  ],
  HIJACKER: [
    '1486312338219-ce68d2c6f44d', // laptop hands · late focus
    '1554118811-1e0d58224f24', // café floor · lived-in
    '1453614512568-c4024d13c247', // café counter · working
    '1522071820081-009f0129c71c', // people around a table
  ],
  CROSSER: [
    '1476480862126-209bfaa8edc8', // stairs · shoe POV
    '1429962714451-bb934ecdc4ec', // crowd · night out
    '1541625602330-2277a4c46182', // coastal ride
    '1551632811-561732d1e306', // trail hike · from behind
  ],
  BATTERY: [
    '1512621776951-a57141f2eefd', // produce / fuel still
    '1490645930847-3d94d77aee30', // kitchen counter
    '1546069901-ba9599a7e63c', // bowl · everyday fuel
    '1505576399270-aec009ca2114', // fridge / home stash
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
