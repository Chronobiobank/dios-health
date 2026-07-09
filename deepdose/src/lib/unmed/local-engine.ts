/** On-device sleep matrix + Sleep Regularity Index (SRI) — no cloud compute. */

export type SleepBlock = {
  start: string | Date
  end: string | Date
}

/** On-device sleep matrix + Sleep Regularity Index (SRI). */
export class DeepdoseLocalEngine {
  private readonly minutesInDay = 1440


  /**
   * Transforms raw timestamp windows into a multi-day binary array matrix.
   */
  generateBinaryMatrix(historicalSleepBlocks: SleepBlock[], totalDays = 14): Uint8Array[] {
    const matrix: Uint8Array[] = []
    const executionEndTime = new Date()
    executionEndTime.setHours(0, 0, 0, 0)

    for (let i = 0; i < totalDays; i++) {
      const dayTargetStart = new Date(
        executionEndTime.getTime() - (totalDays - i) * 24 * 60 * 60 * 1000
      )
      const dayEpochArray = new Uint8Array(this.minutesInDay)

      for (const block of historicalSleepBlocks) {
        const blockStart = new Date(block.start)
        const blockEnd = new Date(block.end)

        for (let minute = 0; minute < this.minutesInDay; minute++) {
          const checkTime = new Date(dayTargetStart.getTime() + minute * 60 * 1000)
          if (checkTime >= blockStart && checkTime <= blockEnd) {
            dayEpochArray[minute] = 1
          }
        }
      }
      matrix.push(dayEpochArray)
    }
    return matrix
  }

  /**
   * Rolling SRI via adjacent 24-hour epoch comparisons (0–100).
   */
  calculateRollingSRI(matrix: Uint8Array[]): number {
    const totalDaysAvailable = matrix.length
    if (totalDaysAvailable < 5) {
      throw new Error('Insufficient historical timeline. Minimum 5 validation cycles required.')
    }

    let matchingEpochs = 0
    let totalComparedEpochs = 0

    for (let d = 0; d < totalDaysAvailable - 1; d++) {
      const currentDay = matrix[d]
      const nextDay = matrix[d + 1]

      for (let m = 0; m < this.minutesInDay; m++) {
        totalComparedEpochs++
        if (currentDay[m] === nextDay[m]) {
          matchingEpochs++
        }
      }
    }

    const sriResult = (matchingEpochs / totalComparedEpochs) * 100
    return parseFloat(sriResult.toFixed(2))
  }

  /** SRI for the trailing N-day window (uses last N rows of the matrix). */
  calculateWindowSRI(historicalSleepBlocks: SleepBlock[], windowDays: number): number | null {
    if (windowDays < 5) return null
    const matrix = this.generateBinaryMatrix(historicalSleepBlocks, windowDays)
    if (matrix.length < 5) return null
    try {
      return this.calculateRollingSRI(matrix)
    } catch {
      return null
    }
  }
}

/** @deprecated Use DeepdoseLocalEngine */
export const UnmedLocalEngine = DeepdoseLocalEngine

/** Map wearable sleep logs into sleep blocks for SRI. */
export function sleepBlocksFromLogs(
  logs: { sleepOnset: string; wake: string }[]
): SleepBlock[] {
  return logs.map((log) => ({
    start: log.sleepOnset,
    end: log.wake,
  }))
}
