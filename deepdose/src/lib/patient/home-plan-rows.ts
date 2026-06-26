/** Resolve home splash med rows into catalog codes + take times for the free plan. */

export type HomePlanRowInput = {
  selectedCode: string | null
  takeTime: string
}

export function resolveHomePlanRows(
  rows: HomePlanRowInput[],
  visibleCount: number,
  defaultCodes: readonly string[]
): { medCodes: string[]; medTimes: string[] } {
  const medCodes: string[] = []
  const medTimes: string[] = []

  for (let i = 0; i < Math.min(visibleCount, rows.length); i++) {
    const row = rows[i]
    const code = row.selectedCode ?? (i < defaultCodes.length ? defaultCodes[i] : null)
    if (!code) continue
    medCodes.push(code)
    medTimes.push(row.takeTime)
  }

  return { medCodes, medTimes }
}
