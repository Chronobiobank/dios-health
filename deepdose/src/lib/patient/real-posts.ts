/** Browser-local daily Real posts (photo + SRI). One Real per calendar day. */

export type RealPost = {
  id: string
  /** Local calendar day YYYY-MM-DD */
  date: string
  photoUrl: string
  sri: number
  sleepOff: string
  sleepOn: string
  displayName: string
  postedAt: string
  isSelf?: boolean
}

export const REAL_POSTS_STORAGE_KEY = 'deepdose-real-posts'

export function todayRealDate(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function readRealPosts(): RealPost[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(REAL_POSTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRealPost)
  } catch {
    return []
  }
}

function isRealPost(value: unknown): value is RealPost {
  if (!value || typeof value !== 'object') return false
  const p = value as RealPost
  return (
    typeof p.id === 'string' &&
    typeof p.date === 'string' &&
    typeof p.photoUrl === 'string' &&
    typeof p.sri === 'number' &&
    typeof p.sleepOff === 'string' &&
    typeof p.sleepOn === 'string' &&
    typeof p.displayName === 'string' &&
    typeof p.postedAt === 'string'
  )
}

export function writeRealPosts(posts: RealPost[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(REAL_POSTS_STORAGE_KEY, JSON.stringify(posts))
  } catch {
    /* quota or private mode */
  }
}

/** Upsert today’s Real (overwrite allowed). Keeps newest-first history. */
export function upsertTodayReal(
  input: Omit<RealPost, 'id' | 'date' | 'postedAt' | 'isSelf'> & {
    date?: string
  }
): RealPost {
  const date = input.date ?? todayRealDate()
  const posts = readRealPosts().filter((p) => p.date !== date)
  const next: RealPost = {
    id: `self-${date}`,
    date,
    photoUrl: input.photoUrl,
    sri: input.sri,
    sleepOff: input.sleepOff,
    sleepOn: input.sleepOn,
    displayName: input.displayName,
    postedAt: new Date().toISOString(),
    isSelf: true,
  }
  writeRealPosts([next, ...posts].slice(0, 60))
  return next
}

export function getRealForDate(date: string): RealPost | null {
  return readRealPosts().find((p) => p.date === date) ?? null
}

export function getTodayReal(): RealPost | null {
  return getRealForDate(todayRealDate())
}
