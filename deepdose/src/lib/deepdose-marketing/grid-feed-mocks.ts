/** Seeded feed doses — one post stream per chemical phenotype. */

import { CHEMICAL_PHENOTYPE_IDS, type ChemicalPhenotypeId } from '@/lib/brand/chemical-phenotypes'
import { DEEPDOSE_COMMUNITY_MATCHES } from '@/lib/deepdose-marketing/community-content'
import {
  communityFaceUrl,
  theoPresenceUrl,
} from '@/lib/deepdose-marketing/community-faces'
import {
  DOSE_TAGS,
  todayDoseDate,
  type DoseTag,
  type DoseUpload,
} from '@/lib/patient/dose-uploads'

/**
 * Phone-snapshot energy by phenotype group.
 * Night · morning · twilight · shift — candid stills, not catalog stock.
 */
const SCENE_PHOTOS: Record<DoseTag, readonly string[]> = {
  night_creator: [
    '1522771739844-6a9f6d5f14af',
    '1514565131-fce0801e5785',
    '1522708323590-d24dbb6b0267',
    '1505693416388-ac5ce068fe85',
  ],
  early_explorer: [
    '1544367567-0f2fcb009e0b',
    '1518611012118-696072aa579a',
    '1471864190281-a93a3070b6de',
    '1495521821757-a1efb6729352',
  ],
  twilight_transformer: [
    '1486312338219-ce68d2c6f44d',
    '1506126613408-eca07ce68773',
    '1571019614242-c5c5dee9f50b',
    '1522708323590-d24dbb6b0267',
  ],
  pulse_shifter: [
    '1584308666744-24d5c474f2ae',
    '1576602976047-174e57a47881',
    '1517836357463-d25dfeac3438',
    '1546069901-ba9599a7e63c',
  ],
}

function sceneUrl(photoId: string, size = 720): string {
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
    const tag: ChemicalPhenotypeId = DOSE_TAGS[index % DOSE_TAGS.length]!
    const isPremium = index === 2 || index === 5
    return {
      id: `mock-dose-${match.id}-${date}`,
      tag,
      mediaUrl: doseSceneUrl(tag, index),
      date,
      timestamp: posted.toISOString(),
      displayName: match.name,
      sri: match.chemistryPct,
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

/**
 * Profile Doses tile — 3×3 headless body close-ups only (no faces).
 */
export function buildDemoSelfDoses(
  displayName: string,
  sri: number,
  now = new Date()
): DoseUpload[] {
  const date = todayDoseDate(now)
  return Array.from({ length: 9 }, (_, index) => {
    const posted = new Date(now)
    posted.setDate(posted.getDate() - (8 - index))
    posted.setHours(20 - (index % 5), (index * 7) % 60, 0, 0)
    const tag: DoseTag = DOSE_TAGS[index % DOSE_TAGS.length]!
    return {
      id: `demo-self-dose-${index}-${date}`,
      tag,
      mediaUrl: theoPresenceUrl(index),
      date: todayDoseDate(posted),
      timestamp: posted.toISOString(),
      displayName,
      sri,
      isPremium: index === 7,
      unlockPrice: index === 7 ? 4.99 : 0,
      syncCount: 2 + (index % 6),
      isSelf: true,
    }
  })
}
