export type RiskLevel = 'high' | 'medium' | 'low'

export type PolyMedMeta = {
  risk: RiskLevel
  timing: string
  window: string
  instruction: string
  evidence: string
}

export const RISK_RANK: Record<RiskLevel, number> = { high: 3, medium: 2, low: 1 }

export const VERDICT_LABEL: Record<RiskLevel, string> = {
  low: 'Looking good — your timings line up.',
  medium: 'A couple of times could work better for you.',
  high: 'At least one medicine is taken at the wrong time of day.',
}

export const CALLOUT_CLASS: Record<RiskLevel, string> = {
  high: 'dios-callout dios-callout--error',
  medium: 'dios-callout dios-callout--warning',
  low: 'dios-callout dios-callout--success',
}

export const POLYPHARMACY_TIMING: Record<string, PolyMedMeta> = {
  metformin: {
    risk: 'low',
    timing: 'Morning',
    window: 'Within 1 hr of waking',
    instruction: 'Take with breakfast within an hour of waking.',
    evidence: 'Circadian glucose metabolism peaks in early morning. Morning metformin reduces post-breakfast excursion versus evening dosing.',
  },
  atorvastatin: {
    risk: 'medium',
    timing: 'Evening',
    window: '20:00 – 22:00',
    instruction: 'Move to evening — take between 8pm and 10pm.',
    evidence: 'Hepatic cholesterol synthesis follows a nocturnal peak. The TIME substudy (Dundee) confirmed evening atorvastatin achieves better LDL reduction.',
  },
  ramipril: {
    risk: 'medium',
    timing: 'Bedtime',
    window: '21:00 – 23:00',
    instruction: 'Take Ramipril at bedtime instead of morning.',
    evidence: 'Hygia Trial: bedtime dosing reduces cardiovascular events by 45%.',
  },
  amlodipine: {
    risk: 'low',
    timing: 'Morning',
    window: 'Within 1 hr of waking',
    instruction: 'Take with your morning medications.',
    evidence: 'The morning blood pressure surge (06:00–10:00) is the highest-risk window for cardiovascular events.',
  },
  sertraline: {
    risk: 'medium',
    timing: 'Morning',
    window: 'With breakfast',
    instruction: 'Take with breakfast. If sleep is affected, try moving to morning.',
    evidence: 'Serotonin synthesis and reuptake follow circadian patterns. Morning dosing works better for most people.',
  },
  prednisolone: {
    risk: 'high',
    timing: 'Early morning',
    window: '07:30 – 08:30',
    instruction: 'Take at 8am only — not later in the day.',
    evidence: 'Your body makes its own cortisol at 8am. Taking Prednisolone then causes least harm.',
  },
  salmeterol: {
    risk: 'low',
    timing: 'Evening',
    window: '19:00 – 21:00',
    instruction: 'Take in the evening before bed.',
    evidence: 'Airways tighten most at 4am. Evening Salmeterol protects you through the night.',
  },
  levothyroxine: {
    risk: 'low',
    timing: 'Bedtime',
    window: 'At bedtime, fasted',
    instruction: 'Take at bedtime on an empty stomach.',
    evidence: 'Bedtime Levothyroxine absorbs better and produces more consistent hormone levels.',
  },
}

export function getPolyMedMeta(code: string): PolyMedMeta {
  const key = code.toLowerCase().replace(/\s+/g, '')
  return POLYPHARMACY_TIMING[key] ?? {
    risk: 'low',
    timing: 'Variable',
    window: 'Ask your GP',
    instruction: 'Follow your GP\'s instructions for this medication.',
    evidence: 'Timing data for this medication is being added.',
  }
}

export function worstRiskForMedCodes(medCodes: string[]): RiskLevel {
  return medCodes.reduce<RiskLevel>((worst, code) => {
    const risk = getPolyMedMeta(code).risk
    return RISK_RANK[risk] > RISK_RANK[worst] ? risk : worst
  }, 'low')
}

export function verdictForMedCodes(medCodes: string[]): string {
  if (!medCodes.length) return VERDICT_LABEL.low
  return VERDICT_LABEL[worstRiskForMedCodes(medCodes)]
}

export const TIME_ORDER: Record<string, number> = {
  'early morning': 0,
  morning: 1,
  variable: 2,
  evening: 3,
  bedtime: 4,
}

export function dosePillLabel(timing: string): string {
  const key = timing.toLowerCase()
  if (key === 'early morning' || key === 'morning') return 'Morning'
  if (key === 'evening') return 'Evening'
  if (key === 'bedtime') return 'Bedtime'
  return 'Today'
}

export function dosePillTone(timing: string): 'success' | 'warning' | 'neutral' {
  const key = timing.toLowerCase()
  if (key === 'early morning' || key === 'morning') return 'success'
  if (key === 'evening' || key === 'bedtime') return 'warning'
  return 'neutral'
}
