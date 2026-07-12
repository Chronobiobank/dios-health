/**
 * Community / home face set — real Unsplash portraits (not randomuser stock).
 * Includes male faces for ManJam / Doser demos, plus gender-expansive community set.
 */

export type CommunityFaceId =
  | 'ash'
  | 'river'
  | 'sage'
  | 'kai'
  | 'rowan'
  | 'sol'
  | 'indie'
  | 'leo'
  | 'riley'
  | 'theo'

/** Unsplash photo ids — face-cropped for circular avatars. */
const FACE_PHOTOS: Record<CommunityFaceId, string> = {
  /** Genderqueer / non-binary portrait */
  ash: '1525471213995-b203757ecd60',
  /** Nonbinary studio portrait */
  river: '1687360441063-27492a092519',
  /** Soft androgynous short crop */
  sage: '1618077360395-f3068be8e001',
  /** East Asian, short hair, direct gaze */
  kai: '1531746020798-e6953c6e8e04',
  /** Black person, natural light, soft presentation */
  rowan: '1531123897727-8f129e1688ce',
  /** South Asian, warm outdoor portrait */
  sol: '1544005313-94ddf0286df2',
  /** Latine / mixed, short hair, piercings energy */
  indie: '1529626455594-4ff0802cfb7e',
  /** Male portrait — default for ManJam / chrome demo */
  leo: '1507003211169-0a1dd7228f2d',
  /** @deprecated alias — use theo */
  riley: '1506794778202-cad84cf45f1d',
  /** Male portrait — Theo Davidson demo (beard, strong jaw) */
  theo: '1506794778202-cad84cf45f1d',
}

export const COMMUNITY_FACE_IDS = Object.keys(FACE_PHOTOS) as CommunityFaceId[]

/** Home constellation order — seven attractors. */
export const HOME_FACE_IDS: readonly CommunityFaceId[] = [
  'ash',
  'river',
  'sage',
  'kai',
  'rowan',
  'sol',
  'indie',
] as const

export function communityFaceUrl(id: CommunityFaceId | string, size = 160): string {
  const photo = FACE_PHOTOS[id as CommunityFaceId] ?? FACE_PHOTOS.ash
  return `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=${size}&h=${size}&q=80&crop=faces`
}

/**
 * My daily doses — headless body close-ups only.
 * Local `/…` paths = public/ assets; other values = Unsplash photo IDs.
 */
const THEO_DAILY_DOSE_STILLS = [
  '1634657859073-24c04bf0d6ac', // neck close-up (no face)
  '1542850774-374d46ed6a4a', // torso + hand, headless
  '1713208182546-2ca07f5bfd5d', // hand on neck / shoulder
  '1708700237143-271b4c087324', // collarbone / neck
  '1646503801865-290d4e27cae3', // neck / chest / arm
  '1583454110551-21f2fa2afe61', // forearms + hands
  '/pexels-angela-roma-7479526.jpg', // fingerprint macro (Pexels)
  '/pexels-angela-roma-7479624.jpg', // neck / shoulder (Pexels)
  '/pexels-angela-roma-7479950.jpg', // skin / vein macro (Pexels)
] as const

/** Tight body crops for Unsplash focalpoint — locals are pre-framed. */
const THEO_DOSE_CROPS: readonly { fpY: number; fpZ: number }[] = [
  { fpY: 0.48, fpZ: 1.15 },
  { fpY: 0.55, fpZ: 1.2 },
  { fpY: 0.45, fpZ: 1.25 },
  { fpY: 0.52, fpZ: 1.3 },
  { fpY: 0.42, fpZ: 1.2 },
  { fpY: 0.5, fpZ: 1.35 },
  { fpY: 0.5, fpZ: 1 },
  { fpY: 0.5, fpZ: 1 },
  { fpY: 0.5, fpZ: 1 },
]

export function theoPresenceUrl(index: number, size = 520): string {
  const photo = THEO_DAILY_DOSE_STILLS[index % THEO_DAILY_DOSE_STILLS.length]!
  if (photo.startsWith('/')) return photo
  const crop = THEO_DOSE_CROPS[index % THEO_DOSE_CROPS.length]!
  return (
    `https://images.unsplash.com/photo-${photo}` +
    `?auto=format&fit=crop&crop=focalpoint` +
    `&w=${size}&h=${size}&q=80` +
    `&fp-x=0.5&fp-y=${crop.fpY}&fp-z=${crop.fpZ}`
  )
}

