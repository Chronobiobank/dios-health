/**
 * Sleep Regularity Index (SRI) — day-1 functional engine.
 *
 * Compares minute-level awake/asleep binary states across consecutive
 * 24h epochs (Phillips et al. style probability of matching sleep state).
 * Score is 0–100. Soft floor when history is short so the UI works from day 1.
 */

import {
  DeepdoseLocalEngine,
  sleepBlocksFromLogs,
  type SleepBlock,
} from '@/lib/unmed/local-engine'

const MINUTES_IN_DAY = 1440

export type SriResult = {
  score: number
  daysCompared: number
  method: 'rolling' | 'synthetic' | 'seed'
}

/**
 * Soft rolling SRI: works with ≥2 days (spec wants scores from day 1).
 * With only one day of data, returns a seed score from schedule regularity.
 */
export function calculateSriFromMatrix(matrix: Uint8Array[]): SriResult {
  if (matrix.length === 0) {
    return { score: 70, daysCompared: 0, method: 'seed' }
  }

  if (matrix.length === 1) {
    // Single night: score from sleep duration regularity proxy (target ~7.5h)
    const asleep = matrix[0]!.reduce((n, v) => n + v, 0)
    const hours = asleep / 60
    const delta = Math.abs(hours - 7.5)
    const score = Math.round(Math.max(35, Math.min(92, 88 - delta * 8)))
    return { score, daysCompared: 1, method: 'seed' }
  }

  let matching = 0
  let total = 0
  for (let d = 0; d < matrix.length - 1; d++) {
    const a = matrix[d]!
    const b = matrix[d + 1]!
    for (let m = 0; m < MINUTES_IN_DAY; m++) {
      total++
      if (a[m] === b[m]) matching++
    }
  }

  const score = Math.round((matching / total) * 100)
  return {
    score: Math.max(0, Math.min(100, score)),
    daysCompared: matrix.length,
    method: 'rolling',
  }
}

export function calculateSriFromSleepBlocks(
  blocks: SleepBlock[],
  totalDays = 7
): SriResult {
  const engine = new DeepdoseLocalEngine()
  const days = Math.max(1, Math.min(14, totalDays))
  const matrix = engine.generateBinaryMatrix(blocks, days)
  return calculateSriFromMatrix(matrix)
}

/** Build synthetic sleep blocks from lights-off / lights-on labels (HH:MM). */
export function syntheticBlocksFromSchedule(
  sleepOff: string,
  sleepOn: string,
  nights = 7
): SleepBlock[] {
  const parse = (label: string): { h: number; m: number } | null => {
    const m = label.trim().match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return null
    return { h: Number(m[1]), m: Number(m[2]) }
  }
  const off = parse(sleepOff)
  const on = parse(sleepOn)
  if (!off || !on) return []

  const blocks: SleepBlock[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = nights; i >= 1; i--) {
    const wakeDay = new Date(today.getTime() - (i - 1) * 86400000)
    const sleepDay = new Date(wakeDay.getTime() - 86400000)
    // Slight jitter so synthetic SRI isn't a perfect 100
    const jitterMin = ((i * 3) % 11) - 5
    const start = new Date(sleepDay)
    start.setHours(off.h, off.m + jitterMin, 0, 0)
    const end = new Date(wakeDay)
    end.setHours(on.h, on.m + (((i * 5) % 7) - 3), 0, 0)
    if (end <= start) end.setTime(start.getTime() + 7.5 * 3600000)
    blocks.push({ start, end })
  }
  return blocks
}

/** Day-1 entry: schedule → SRI. Always returns a usable 0–100 score. */
export function computeScheduleSri(
  sleepOff: string | null | undefined,
  sleepOn: string | null | undefined,
  nights = 7
): SriResult {
  if (!sleepOff || !sleepOn) {
    return { score: 72, daysCompared: 0, method: 'seed' }
  }
  const blocks = syntheticBlocksFromSchedule(sleepOff, sleepOn, nights)
  if (blocks.length === 0) {
    return { score: 72, daysCompared: 0, method: 'seed' }
  }
  const result = calculateSriFromSleepBlocks(blocks, nights)
  return { ...result, method: result.method === 'seed' ? 'synthetic' : result.method }
}

export function sriFromLogs(
  logs: { sleepOnset: string; wake: string }[],
  windowDays = 7
): SriResult {
  if (logs.length === 0) {
    return { score: 70, daysCompared: 0, method: 'seed' }
  }
  return calculateSriFromSleepBlocks(sleepBlocksFromLogs(logs), windowDays)
}
