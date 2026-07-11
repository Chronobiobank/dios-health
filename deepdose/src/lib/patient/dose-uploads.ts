/** Local Medmaxxing dose uploads — four biologic clusters. */

export type DoseTag = 'RESETTER' | 'HIJACKER' | 'CROSSER' | 'BATTERY'

export const DOSE_TAGS: readonly DoseTag[] = [
  'RESETTER',
  'HIJACKER',
  'CROSSER',
  'BATTERY',
] as const

export type Chronotype = 'lark' | 'owl'

export type DoseUpload = {
  id: string
  tag: DoseTag
  mediaUrl: string
  /** Local calendar day YYYY-MM-DD */
  date: string
  timestamp: string
  displayName: string
  sri: number
  chronotype: Chronotype
  isPremium: boolean
  unlockPrice: number
  syncCount: number
  /** Soft telemetry stubs (filled when EXIF / wearables land) */
  exifLuxValue?: number | null
  deviceHeartRate?: number | null
  isSelf?: boolean
}

export const DOSE_UPLOADS_STORAGE_KEY = 'deepdose-dose-uploads'
export const BANK_OPT_IN_KEY = 'deepdose-bank-opt-in'
export const DOSE_SYNCS_KEY = 'deepdose-dose-syncs'

/** Consumer labels — Medmaxxing biologic clusters. */
export const DOSE_TAG_META: Record<
  DoseTag,
  { label: string; hash: string; cue: string; hint: string; idea: string }
> = {
  RESETTER: {
    label: 'Resetters',
    hash: '#Resetters',
    cue: 'var(--dd-cue-resetter)',
    hint: 'Brain → night',
    idea: 'Tell your brain: drop everything, it’s bedtime now.',
  },
  HIJACKER: {
    label: 'Hijackers',
    hash: '#Hijackers',
    cue: 'var(--dd-cue-hijacker)',
    hint: 'Organs → day',
    idea: 'Tell your organs: wake up and work at 100%.',
  },
  CROSSER: {
    label: 'Crossers',
    hash: '#Crossers',
    cue: 'var(--dd-cue-crosser)',
    hint: 'Volume on energy',
    idea: 'Pull the volume knob up or down on your brain’s energy.',
  },
  BATTERY: {
    label: 'Batteries',
    hash: '#Batteries',
    cue: 'var(--dd-cue-battery)',
    hint: 'Fuel the timers',
    idea: 'Oil and fuel so the cellular timers run on time.',
  },
}

function isDoseTag(value: unknown): value is DoseTag {
  return (
    value === 'RESETTER' ||
    value === 'HIJACKER' ||
    value === 'CROSSER' ||
    value === 'BATTERY'
  )
}

export function todayDoseDate(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function chronotypeFromWake(wakeLabel: string | null | undefined): Chronotype {
  if (!wakeLabel) return 'owl'
  const m = wakeLabel.trim().match(/^(\d{1,2}):/)
  if (!m) return 'owl'
  const h = Number(m[1])
  return h >= 5 && h < 9 ? 'lark' : 'owl'
}

export function readDoseUploads(): DoseUpload[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DOSE_UPLOADS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isDoseUpload)
  } catch {
    return []
  }
}

function isDoseUpload(value: unknown): value is DoseUpload {
  if (!value || typeof value !== 'object') return false
  const d = value as DoseUpload
  return (
    typeof d.id === 'string' &&
    isDoseTag(d.tag) &&
    typeof d.mediaUrl === 'string' &&
    typeof d.date === 'string' &&
    typeof d.timestamp === 'string' &&
    typeof d.displayName === 'string' &&
    typeof d.sri === 'number'
  )
}

export function writeDoseUploads(doses: DoseUpload[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DOSE_UPLOADS_STORAGE_KEY, JSON.stringify(doses.slice(0, 120)))
  } catch {
    /* quota */
  }
}

export function addDoseUpload(
  input: Omit<DoseUpload, 'id' | 'syncCount' | 'isSelf'> & { id?: string }
): DoseUpload {
  const next: DoseUpload = {
    ...input,
    id: input.id ?? `dose-${Date.now()}`,
    syncCount: 0,
    isSelf: true,
  }
  writeDoseUploads([next, ...readDoseUploads()])
  return next
}

export function dosesForDate(date: string): DoseUpload[] {
  return readDoseUploads().filter((d) => d.date === date && d.isSelf !== false)
}

export function todayPillars(date = todayDoseDate()): Record<DoseTag, boolean> {
  const today = dosesForDate(date)
  return {
    RESETTER: today.some((d) => d.tag === 'RESETTER'),
    HIJACKER: today.some((d) => d.tag === 'HIJACKER'),
    CROSSER: today.some((d) => d.tag === 'CROSSER'),
    BATTERY: today.some((d) => d.tag === 'BATTERY'),
  }
}

export function readBankOptIn(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(BANK_OPT_IN_KEY) === '1'
}

export function writeBankOptIn(on: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(BANK_OPT_IN_KEY, on ? '1' : '0')
}

export function readSyncMap(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(DOSE_SYNCS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

export function bumpSync(doseId: string): number {
  const map = readSyncMap()
  map[doseId] = (map[doseId] ?? 0) + 1
  try {
    localStorage.setItem(DOSE_SYNCS_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
  return map[doseId]
}
