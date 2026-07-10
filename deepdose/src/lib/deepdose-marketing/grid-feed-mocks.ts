/** Seeded Grid doses for Larks / Owls — local SVG scenes (no CDN). */

import { DEEPDOSE_COMMUNITY_MATCHES } from '@/lib/deepdose-marketing/community-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import {
  todayDoseDate,
  type Chronotype,
  type DoseTag,
  type DoseUpload,
} from '@/lib/patient/dose-uploads'

const TAGS: DoseTag[] = ['PHOTONIC', 'METABOLIC', 'KINETIC']

const SCENE_COLORS: Record<DoseTag, { a: string; b: string }> = {
  PHOTONIC: { a: '#2a2410', b: '#f5e74a' },
  METABOLIC: { a: '#0f1c22', b: '#acd3de' },
  KINETIC: { a: '#241014', b: '#ff5a5a' },
}

/** Reliable in-browser media — no Unsplash dependency. */
export function doseSceneDataUrl(tag: DoseTag, label: string): string {
  const { a, b } = SCENE_COLORS[tag]
  const safe = label.replace(/[^\w\s#.-]/g, '').slice(0, 24)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="720" height="720" fill="url(#g)"/>
  <circle cx="360" cy="300" r="88" fill="${b}" fill-opacity="0.22"/>
  <text x="360" y="520" text-anchor="middle" font-family="system-ui,sans-serif" font-size="36" fill="#ffffff" fill-opacity="0.88">${safe}</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function buildMockGridDoses(now = new Date()): DoseUpload[] {
  const date = todayDoseDate(now)
  return DEEPDOSE_COMMUNITY_MATCHES.map((match, index) => {
    const posted = new Date(now)
    posted.setHours(6 + (index % 10), (index * 11) % 60, 0, 0)
    const chronotype: Chronotype = index % 2 === 0 ? 'lark' : 'owl'
    const tag = TAGS[index % TAGS.length]!
    const isPremium = index === 2 || index === 5
    return {
      id: `mock-dose-${match.id}-${date}`,
      tag,
      mediaUrl: doseSceneDataUrl(tag, match.name),
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
