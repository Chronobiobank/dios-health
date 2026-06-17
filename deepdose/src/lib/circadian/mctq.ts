// lib/circadian/mctq.ts
// Roenneberg Munich Chronotype Questionnaire scoring
// Computes MSFsc (sleep-corrected mid-sleep on free days) and SJL

export interface MCTQInput {
  // Workday sleep timing
  workSleepOnset: string      // HH:MM
  workSleepEnd: string        // HH:MM
  workAlarmUsed: boolean

  // Free day sleep timing
  freeSleepOnset: string      // HH:MM
  freeSleepEnd: string        // HH:MM

  // Work schedule
  workdaysPerWeek: number     // 0–7
}

export interface MCTQResult {
  msfSc: number               // sleep-corrected MSF in decimal hours (e.g. 4.5 = 04:30)
  sjlHours: number            // social jet lag magnitude in hours
  chronotypeCat: 'extreme_early' | 'early' | 'intermediate' | 'late' | 'extreme_late'
  dlmoEstimateHours: number   // estimated DLMO: MSFsc - 2.5 hours
}

function timeToDecimal(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h + m / 60
}

function midSleep(onset: string, end: string): number {
  const onsetH = timeToDecimal(onset)
  let endH = timeToDecimal(end)
  // Handle overnight sleep (end < onset)
  if (endH < onsetH) endH += 24
  const mid = (onsetH + endH) / 2
  return mid % 24
}

function sleepDuration(onset: string, end: string): number {
  const onsetH = timeToDecimal(onset)
  let endH = timeToDecimal(end)
  if (endH < onsetH) endH += 24
  return endH - onsetH
}

export function scoreMCTQ(input: MCTQInput): MCTQResult {
  const { workdaysPerWeek } = input
  const freeDays = 7 - workdaysPerWeek

  const sdWork = sleepDuration(input.workSleepOnset, input.workSleepEnd)
  const sdFree = sleepDuration(input.freeSleepOnset, input.freeSleepEnd)
  const msfRaw = midSleep(input.freeSleepOnset, input.freeSleepEnd)

  // Sleep debt correction: MSFsc = MSF - (SDfree - SDweek) / 2
  // SDweek = weighted average sleep duration across the week
  const sdWeek = (sdWork * workdaysPerWeek + sdFree * freeDays) / 7
  const sleepDebtCorrection = (sdFree - sdWeek) / 2
  const msfSc = ((msfRaw - sleepDebtCorrection) % 24 + 24) % 24

  // Social jet lag = |MSF - MSW| where MSW = mid-sleep on workdays
  const msWork = midSleep(input.workSleepOnset, input.workSleepEnd)
  const sjlHours = Math.abs(msfSc - msWork)

  // Chronotype classification (Roenneberg population norms)
  let chronotypeCat: MCTQResult['chronotypeCat']
  if (msfSc < 2.17)       chronotypeCat = 'extreme_early'
  else if (msfSc < 3.33)  chronotypeCat = 'early'
  else if (msfSc < 5.17)  chronotypeCat = 'intermediate'
  else if (msfSc < 6.0)   chronotypeCat = 'late'
  else                     chronotypeCat = 'extreme_late'

  // DLMO estimate: approximately 2.5h before MSFsc
  const dlmoEstimateHours = ((msfSc - 2.5) % 24 + 24) % 24

  return { msfSc, sjlHours, chronotypeCat, dlmoEstimateHours }
}
