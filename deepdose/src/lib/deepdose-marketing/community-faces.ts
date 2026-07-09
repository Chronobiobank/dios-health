/**
 * Community / home face set — real Unsplash portraits (not randomuser stock).
 * Bias: gender-expansive, androgynous, and racially diverse faces.
 */

export type CommunityFaceId =
  | 'ash'
  | 'river'
  | 'sage'
  | 'kai'
  | 'rowan'
  | 'sol'
  | 'indie'

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
