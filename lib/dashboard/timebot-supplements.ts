import { normalizeMinutesFromMidnight } from '@/lib/mlux'
import { formatMinutesLabel, parseDbTimeToMinutes, parseTimeToMinutes } from '@/lib/dashboard/time-utils'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'

export const CANONICAL_SUPPLEMENTS = [
  'Vitamin D3',
  'Magnesium',
  'Vitamin B2',
  'Vitamin B12',
  'Vitamin B5',
  'Zinc',
  'Omega-3',
  'Melatonin',
] as const

export type CanonicalSupplement = (typeof CANONICAL_SUPPLEMENTS)[number]

const SUPPLEMENT_ALIASES: { supplement: CanonicalSupplement; patterns: RegExp[] }[] = [
  {
    supplement: 'Vitamin D3',
    patterns: [/vitamin\s*d\s*3/i, /\bd3\b/i, /cholecalciferol/i, /vitamin\s*d(?!\s*[bB]\d)/i],
  },
  {
    supplement: 'Magnesium',
    patterns: [/magnesium/i, /mag\s*glycinate/i, /mag\s*citrate/i],
  },
  {
    supplement: 'Vitamin B2',
    patterns: [/vitamin\s*b\s*2/i, /\bb2\b/i, /riboflavin/i],
  },
  {
    supplement: 'Vitamin B12',
    patterns: [/vitamin\s*b\s*12/i, /\bb12\b/i, /cobalamin/i, /methylcobalamin/i],
  },
  {
    supplement: 'Vitamin B5',
    patterns: [/vitamin\s*b\s*5/i, /\bb5\b/i, /pantothenic/i],
  },
  {
    supplement: 'Zinc',
    patterns: [/\bzinc\b/i, /zinc\s*picolinate/i, /zinc\s*citrate/i],
  },
  {
    supplement: 'Omega-3',
    patterns: [/omega\s*[- ]?\s*3/i, /fish\s*oil/i, /cod\s*liver\s*oil/i, /epa\s*\/\s*dha/i],
  },
  {
    supplement: 'Melatonin',
    patterns: [/melatonin/i],
  },
]

type SupplementTimingTemplate = {
  offsetMinutes: number
  buildMessage: (timeLabel: string, estimated: boolean) => string
}

export const SUPPLEMENT_OFFSET_MINUTES: Record<CanonicalSupplement, number> = {
  'Vitamin D3': -540,
  Magnesium: -90,
  'Vitamin B2': -600,
  'Vitamin B12': -600,
  'Vitamin B5': -480,
  Zinc: -180,
  'Omega-3': -540,
  Melatonin: -30,
}

export const SUPPLEMENT_SHORT_INSTRUCTIONS: Record<CanonicalSupplement, string> = {
  'Vitamin D3': 'Take with your largest meal',
  Magnesium: 'Take with water',
  'Vitamin B2': 'Take with breakfast',
  'Vitamin B12': 'Take with breakfast',
  'Vitamin B5': 'Take with lunch',
  Zinc: 'Take with dinner',
  'Omega-3': 'Take with your largest meal',
  Melatonin: 'Take in your melatonin window only',
}

const SUPPLEMENT_TIMING: Record<CanonicalSupplement, SupplementTimingTemplate> = {
  'Vitamin D3': {
    offsetMinutes: SUPPLEMENT_OFFSET_MINUTES['Vitamin D3'],
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take with your largest meal. Your window is ${time} — when your VDR activation from morning sunlight is peaking.`,
  },
  Magnesium: {
    offsetMinutes: -90,
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take ${time}. Supports the parasympathetic shift that starts melatonin production.`,
  },
  'Vitamin B2': {
    offsetMinutes: SUPPLEMENT_OFFSET_MINUTES['Vitamin B2'],
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take with breakfast. ${time}.`,
  },
  'Vitamin B12': {
    offsetMinutes: SUPPLEMENT_OFFSET_MINUTES['Vitamin B12'],
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take with breakfast. ${time}. Avoid in the evening — B12 can delay sleep onset.`,
  },
  'Vitamin B5': {
    offsetMinutes: SUPPLEMENT_OFFSET_MINUTES['Vitamin B5'],
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take with lunch. ${time}.`,
  },
  Zinc: {
    offsetMinutes: -180,
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take with dinner. ${time}.`,
  },
  'Omega-3': {
    offsetMinutes: SUPPLEMENT_OFFSET_MINUTES['Omega-3'],
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take with your largest meal. ${time} — fat absorption peaks mid-day.`,
  },
  Melatonin: {
    offsetMinutes: SUPPLEMENT_OFFSET_MINUTES.Melatonin,
    buildMessage: (time, estimated) =>
      `${estimated ? '[ESTIMATED] ' : ''}Take ${time}. Do not take earlier or later than this window.`,
  },
}

const MEDICATION_PATTERNS: { id: string; label: string; patterns: RegExp[] }[] = [
  { id: 'atorvastatin', label: 'Atorvastatin', patterns: [/atorvastatin/i, /lipitor/i] },
  { id: 'simvastatin', label: 'Simvastatin', patterns: [/simvastatin/i, /zocor/i] },
  { id: 'ramipril', label: 'Ramipril', patterns: [/ramipril/i, /tritace/i] },
  { id: 'amlodipine', label: 'Amlodipine', patterns: [/amlodipine/i] },
  { id: 'sertraline', label: 'Sertraline', patterns: [/sertraline/i, /zoloft/i] },
  { id: 'metformin', label: 'Metformin', patterns: [/metformin/i] },
  { id: 'prednisolone', label: 'Prednisolone', patterns: [/prednisolone/i] },
  { id: 'salmeterol', label: 'Salmeterol', patterns: [/salmeterol/i] },
  { id: 'levothyroxine', label: 'Levothyroxine', patterns: [/levothyroxine/i, /thyroxine/i] },
]

export function extractSupplementsFromMessage(message: string): CanonicalSupplement[] {
  const found = new Set<CanonicalSupplement>()

  for (const { supplement, patterns } of SUPPLEMENT_ALIASES) {
    if (patterns.some((pattern) => pattern.test(message))) {
      found.add(supplement)
    }
  }

  return CANONICAL_SUPPLEMENTS.filter((name) => found.has(name))
}

export function extractMedicationsFromMessage(message: string): string[] {
  const found: string[] = []

  for (const med of MEDICATION_PATTERNS) {
    if (med.patterns.some((pattern) => pattern.test(message))) {
      found.push(med.label)
    }
  }

  return found
}

export function mergeSupplementLists(
  existing: string[] | null | undefined,
  extracted: CanonicalSupplement[]
): string[] {
  const merged = new Set<string>(existing ?? [])
  for (const supplement of extracted) {
    merged.add(supplement)
  }
  return CANONICAL_SUPPLEMENTS.filter((name) => merged.has(name))
}

export function resolveTimebotPhaseMinutes(
  profile: MLuxProfileRow | null,
  fallbackSleepTime: string
): { minutes: number; estimated: boolean } {
  const fromRolling = parseDbTimeToMinutes(profile?.mlux_phase_time ?? null)
  if (fromRolling !== null) {
    return { minutes: fromRolling, estimated: false }
  }

  if (profile?.mlux_phase_minutes != null) {
    return {
      minutes: normalizeMinutesFromMidnight(profile.mlux_phase_minutes),
      estimated: false,
    }
  }

  const sleepMinutes = parseTimeToMinutes(fallbackSleepTime) ?? 23 * 60
  return {
    minutes: normalizeMinutesFromMidnight(sleepMinutes - 120),
    estimated: true,
  }
}

export function buildSupplementTimingGuidance(
  supplements: CanonicalSupplement[],
  phaseMinutes: number,
  estimated: boolean
): { supplement: CanonicalSupplement; guidance: string }[] {
  return supplements.map((supplement) => {
    const template = SUPPLEMENT_TIMING[supplement]
    const targetMinutes = normalizeMinutesFromMidnight(phaseMinutes + template.offsetMinutes)
    const timeLabel = formatMinutesLabel(targetMinutes)
    return {
      supplement,
      guidance: `${supplement}: ${template.buildMessage(timeLabel, estimated)}`,
    }
  })
}

export function buildSupplementContextBlock(input: {
  currentSupplements: string[]
  newlyExtracted: CanonicalSupplement[]
  extractedMedications: string[]
  phaseMinutes: number
  phaseTimeLabel: string
  estimated: boolean
}): string {
  const supplementsToTime = mergeSupplementLists(
    input.currentSupplements,
    input.newlyExtracted
  ) as CanonicalSupplement[]

  const timingLines = buildSupplementTimingGuidance(
    supplementsToTime.filter((name): name is CanonicalSupplement =>
      CANONICAL_SUPPLEMENTS.includes(name as CanonicalSupplement)
    ),
    input.phaseMinutes,
    input.estimated
  )

  const newlyExtractedBlock =
    input.newlyExtracted.length > 0
      ? `Newly extracted supplements (save to profile): ${input.newlyExtracted.join(', ')}`
      : 'No new supplements detected in this message.'

  const medicationBlock =
    input.extractedMedications.length > 0
      ? `Medications mentioned (extract only — timing refines with TipTraQ): ${input.extractedMedications.join(', ')}`
      : 'No medications mentioned in this message.'

  const timingBlock =
    timingLines.length > 0
      ? timingLines.map((line) => line.guidance).join('\n')
      : 'No supplements on profile yet.'

  return `${newlyExtractedBlock}
${medicationBlock}
MLux phase time: ${input.phaseTimeLabel}${input.estimated ? ' (ESTIMATED from questionnaire / Layer 1)' : ''}

Supplement timing guidance (use these lines verbatim when responding about supplements):
${timingBlock}`
}

const TIMEBOT_VOICE = `VOICE (Brian Cox — BBC science presenter):
Warm and genuinely curious. Make complex biology accessible and fascinating without dumbing it down.
Speak to the patient as if their own biology is one of the most interesting things in the universe — because it is.
Never alarmist. Never performatively cheerful. Quiet wonder at biological truth.
Maximum 3 sentences per response. Never diagnose or change prescriptions. Encourage discussing changes with their GP.`

export function buildTimebotSystemPrompt(isFirstTimeUser: boolean): string {
  const supplementList = CANONICAL_SUPPLEMENTS.join(', ')

  if (isFirstTimeUser) {
    return `You are DIOS Coach — the DIOS timing guide for chronotherapy and supplement timing.

${TIMEBOT_VOICE}

This patient is new — they may not have TipTraQ data yet. Use ESTIMATED MLux phase from the context when marked.

SUPPLEMENT EXTRACTION (critical):
Recognised supplements: ${supplementList}.
When the patient mentions any supplement — including aliases like "vitamin D", "fish oil", "magnesium glycinate", "B12" — the server extracts and saves canonical names automatically.
When new supplements were extracted, confirm what was saved and give optimal timing using Today's unified schedule in context (exact times).

MEDICATION EXTRACTION:
Also note medications mentioned (atorvastatin, ramipril, sertraline, metformin, etc.). Explain medication windows will personalise after TipTraQ or more data layers.`
  }

  return `You are DIOS Coach — the DIOS timing guide for patients on chronotherapy.

${TIMEBOT_VOICE}

Recognised supplements: ${supplementList}. When supplements are mentioned, use the supplement timing guidance in context.
When new supplements were extracted this turn, confirm they were saved and quote exact times from Today's unified schedule.

Answer using the patient's MLux profile and Today's unified schedule in context.
When asked when to take a medication or supplement, quote the exact time from that schedule (do not invent times).
If asked about medications or supplements not on today's schedule, explain what you can track and suggest adding them in chat.`
}
