/** Local dose uploads — posts into a chemical phenotype group. */

import {
  CHEMICAL_PHENOTYPE_BY_ID,
  CHEMICAL_PHENOTYPE_IDS,
  isChemicalPhenotypeId,
  phenotypeFromWakeLabel,
  type ChemicalPhenotypeId,
} from '@/lib/brand/chemical-phenotypes'

/** Dose tag = phenotype group the post belongs to. */
export type DoseTag = ChemicalPhenotypeId

export const DOSE_TAGS: readonly DoseTag[] = CHEMICAL_PHENOTYPE_IDS

export type DoseUpload = {
  id: string
  /** Phenotype group this post belongs to */
  tag: DoseTag
  mediaUrl: string
  /** Local calendar day YYYY-MM-DD */
  date: string
  timestamp: string
  displayName: string
  sri: number
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
/** Dose ids the current member has synced (Strava-style once). */
export const DOSE_SYNCED_BY_ME_KEY = 'deepdose-dose-synced-by-me'

/** Consumer labels — one button / card per phenotype group. */
export const DOSE_TAG_META: Record<
  DoseTag,
  { label: string; hash: string; cue: string; hint: string; idea: string }
> = {
  night_creator: {
    label: CHEMICAL_PHENOTYPE_BY_ID.night_creator.label,
    hash: CHEMICAL_PHENOTYPE_BY_ID.night_creator.hash,
    cue: CHEMICAL_PHENOTYPE_BY_ID.night_creator.cue,
    hint: CHEMICAL_PHENOTYPE_BY_ID.night_creator.expression,
    idea: `Post into the ${CHEMICAL_PHENOTYPE_BY_ID.night_creator.label} feed.`,
  },
  early_explorer: {
    label: CHEMICAL_PHENOTYPE_BY_ID.early_explorer.label,
    hash: CHEMICAL_PHENOTYPE_BY_ID.early_explorer.hash,
    cue: CHEMICAL_PHENOTYPE_BY_ID.early_explorer.cue,
    hint: CHEMICAL_PHENOTYPE_BY_ID.early_explorer.expression,
    idea: `Post into the ${CHEMICAL_PHENOTYPE_BY_ID.early_explorer.label} feed.`,
  },
  twilight_transformer: {
    label: CHEMICAL_PHENOTYPE_BY_ID.twilight_transformer.label,
    hash: CHEMICAL_PHENOTYPE_BY_ID.twilight_transformer.hash,
    cue: CHEMICAL_PHENOTYPE_BY_ID.twilight_transformer.cue,
    hint: CHEMICAL_PHENOTYPE_BY_ID.twilight_transformer.expression,
    idea: `Post into the ${CHEMICAL_PHENOTYPE_BY_ID.twilight_transformer.label} feed.`,
  },
  pulse_shifter: {
    label: CHEMICAL_PHENOTYPE_BY_ID.pulse_shifter.label,
    hash: CHEMICAL_PHENOTYPE_BY_ID.pulse_shifter.hash,
    cue: CHEMICAL_PHENOTYPE_BY_ID.pulse_shifter.cue,
    hint: CHEMICAL_PHENOTYPE_BY_ID.pulse_shifter.expression,
    idea: `Post into the ${CHEMICAL_PHENOTYPE_BY_ID.pulse_shifter.label} feed.`,
  },
}

function isDoseTag(value: unknown): value is DoseTag {
  return isChemicalPhenotypeId(value)
}

export function todayDoseDate(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** @deprecated Prefer phenotypeFromWakeLabel — kept for older imports. */
export function chronotypeFromWake(wakeLabel: string | null | undefined): DoseTag {
  return phenotypeFromWakeLabel(wakeLabel).id
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
    night_creator: today.some((d) => d.tag === 'night_creator'),
    early_explorer: today.some((d) => d.tag === 'early_explorer'),
    twilight_transformer: today.some((d) => d.tag === 'twilight_transformer'),
    pulse_shifter: today.some((d) => d.tag === 'pulse_shifter'),
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

export function readSyncedByMe(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(DOSE_SYNCED_BY_ME_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [])
  } catch {
    return new Set()
  }
}

function writeSyncedByMe(ids: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DOSE_SYNCED_BY_ME_KEY, JSON.stringify([...ids]))
  } catch {
    /* ignore */
  }
}

/** Sync a dose once — chemistry recognition, not attention farming. */
export function bumpSync(doseId: string): number {
  const mine = readSyncedByMe()
  const map = readSyncMap()
  if (mine.has(doseId)) {
    return map[doseId] ?? 0
  }
  mine.add(doseId)
  writeSyncedByMe(mine)
  map[doseId] = (map[doseId] ?? 0) + 1
  try {
    localStorage.setItem(DOSE_SYNCS_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
  return map[doseId]
}

export function hasSyncedDose(doseId: string): boolean {
  return readSyncedByMe().has(doseId)
}
