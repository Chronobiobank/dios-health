/** Conservative executive circadian misalignment cost model — projections only. */

export type CorporateSectorId = 'corporate' | 'professional' | 'banking'

export type CorporateRoiInputs = {
  executives: number
  salaryK: number
  travelDaysPerMonth: number
  sector: CorporateSectorId
}

export type CorporateRoiBreakdown = {
  totalCost: number
  presenteeismCost: number
  presenteeismDays: number
  travelCost: number
  travelDays: number
  decisionCost: number
  diosProgrammeCost: number
  recoverable: number
  netRecovery: number
  roiMultiple: number
}

const WORKING_DAYS = 252
const DAYS_LOST_PER_EXEC = 44
const RECOVERY_RATE = 0.15
const DIOS_COST_PER_EXEC = 500

const SECTOR_WEIGHTS: Record<
  CorporateSectorId,
  { presenteeism: number; travel: number; decision: number }
> = {
  corporate: { presenteeism: 1, travel: 1, decision: 1 },
  professional: { presenteeism: 1.08, travel: 1.18, decision: 1.12 },
  banking: { presenteeism: 1.12, travel: 1.35, decision: 1.28 },
}

function roundMoney(value: number) {
  return Math.round(value)
}

/** IPPR presenteeism framing + travel recovery + decision-window exposure. */
export function calculateCorporateRoi(inputs: CorporateRoiInputs): CorporateRoiBreakdown {
  const salary = inputs.salaryK * 1000
  const dailyRate = salary / WORKING_DAYS
  const weights = SECTOR_WEIGHTS[inputs.sector]

  const presenteeismDays = Math.round(inputs.executives * DAYS_LOST_PER_EXEC * weights.presenteeism)
  const presenteeismCost = roundMoney(
    presenteeismDays * dailyRate * 0.52 * weights.presenteeism,
  )

  const travelDays = Math.round(
    inputs.executives * inputs.travelDaysPerMonth * 12 * 0.58 * weights.travel,
  )
  const travelCost = roundMoney(travelDays * dailyRate * weights.travel)

  const decisionCost = roundMoney(
    inputs.executives * salary * 0.034 * weights.decision,
  )

  const totalCost = presenteeismCost + travelCost + decisionCost
  const diosProgrammeCost = inputs.executives * DIOS_COST_PER_EXEC
  const recoverable = roundMoney(totalCost * RECOVERY_RATE)
  const netRecovery = recoverable - diosProgrammeCost
  const roiMultiple = diosProgrammeCost > 0 ? recoverable / diosProgrammeCost : 0

  return {
    totalCost,
    presenteeismCost,
    presenteeismDays,
    travelCost,
    travelDays,
    decisionCost,
    diosProgrammeCost,
    recoverable,
    netRecovery,
    roiMultiple,
  }
}

export function formatGbp(value: number, compact = false) {
  if (compact && Math.abs(value) >= 1_000_000) {
    return `£${(value / 1_000_000).toFixed(1)}m`
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `£${Math.round(value / 1_000)}k`
  }
  return `£${Math.round(value).toLocaleString('en-GB')}`
}
