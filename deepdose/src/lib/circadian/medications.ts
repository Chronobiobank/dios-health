// lib/circadian/medications.ts
// Per-drug chronopharma timing logic for the 8 core medications
// All times are population-level defaults — adjusted per patient by DLMO offset in score.ts

export type MedicationCode =
  | 'atorvastatin'
  | 'ramipril'
  | 'amlodipine'
  | 'metformin'
  | 'aspirin'
  | 'prednisolone'
  | 'alendronate'
  | 'warfarin'

export interface MedicationTiming {
  code: MedicationCode
  displayName: string
  drugClass: string
  populationWindowStart: string   // HH:MM — population-average optimal window start
  populationWindowEnd: string     // HH:MM — population-average optimal window end
  evidenceGrade: 'A' | 'B' | 'C'
  rationale: string               // plain English for GP dashboard
  keyTrial: string                // primary evidence citation
  phaseOffsetSensitive: boolean   // true = adjust window by patient DLMO offset
}

export const MEDICATION_TIMINGS: Record<MedicationCode, MedicationTiming> = {
  atorvastatin: {
    code: 'atorvastatin',
    displayName: 'Atorvastatin',
    drugClass: 'Statin',
    populationWindowStart: '20:00',
    populationWindowEnd: '22:00',
    evidenceGrade: 'A',
    rationale: 'Hepatic HMG-CoA reductase activity peaks nocturnally. Evening dosing maximises inhibition of peak cholesterol synthesis.',
    keyTrial: 'Plakogiannis & Cohen, Ann Pharmacother 2007',
    phaseOffsetSensitive: true,
  },
  ramipril: {
    code: 'ramipril',
    displayName: 'Ramipril',
    drugClass: 'ACE Inhibitor',
    populationWindowStart: '21:00',
    populationWindowEnd: '23:00',
    evidenceGrade: 'A',
    rationale: 'Bedtime dosing provides BP coverage during nocturnal dip period and reduces morning surge risk. Hygia Chronotherapy Trial evidence.',
    keyTrial: 'Hermida et al., Eur Heart J 2020 (Hygia)',
    phaseOffsetSensitive: true,
  },
  amlodipine: {
    code: 'amlodipine',
    displayName: 'Amlodipine',
    drugClass: 'Calcium Channel Blocker',
    populationWindowStart: '20:00',
    populationWindowEnd: '22:00',
    evidenceGrade: 'B',
    rationale: 'Long half-life reduces timing sensitivity but evening dosing supports nocturnal BP control and non-dipper phenotype management.',
    keyTrial: 'Hermida et al., Chronobiol Int 2007',
    phaseOffsetSensitive: false,
  },
  metformin: {
    code: 'metformin',
    displayName: 'Metformin',
    drugClass: 'Biguanide',
    populationWindowStart: '07:00',
    populationWindowEnd: '09:00',
    evidenceGrade: 'B',
    rationale: 'Hepatic gluconeogenesis peaks in early morning driven by cortisol/GH surge. Morning dosing aligns AMPK activation with peak gluconeogenic drive.',
    keyTrial: 'Boden et al., Am J Physiol 1996',
    phaseOffsetSensitive: true,
  },
  aspirin: {
    code: 'aspirin',
    displayName: 'Aspirin',
    drugClass: 'Antiplatelet',
    populationWindowStart: '07:00',
    populationWindowEnd: '09:00',
    evidenceGrade: 'A',
    rationale: 'Platelet aggregability peaks in the morning hours coinciding with catecholamine surge and highest cardiovascular event risk.',
    keyTrial: 'Tofler et al., NEJM 1987',
    phaseOffsetSensitive: true,
  },
  prednisolone: {
    code: 'prednisolone',
    displayName: 'Prednisolone',
    drugClass: 'Corticosteroid',
    populationWindowStart: '02:00',
    populationWindowEnd: '04:00',
    evidenceGrade: 'A',
    rationale: 'Modified-release formulation targets pre-dawn inflammatory peak (IL-6, TNF-alpha surge). CAPRA-1 trial demonstrated superior morning stiffness reduction.',
    keyTrial: 'Buttgereit et al., Ann Rheum Dis 2008 (CAPRA-1)',
    phaseOffsetSensitive: true,
  },
  alendronate: {
    code: 'alendronate',
    displayName: 'Alendronate',
    drugClass: 'Bisphosphonate',
    populationWindowStart: '07:00',
    populationWindowEnd: '08:00',
    evidenceGrade: 'B',
    rationale: 'Fasting morning administration required for absorption. Bone resorption markers peak in early morning; timing aligns with osteoclast activity rhythm.',
    keyTrial: 'BNF guidance; Clowes et al., Bone 2002',
    phaseOffsetSensitive: false,
  },
  warfarin: {
    code: 'warfarin',
    displayName: 'Warfarin',
    drugClass: 'Anticoagulant',
    populationWindowStart: '17:00',
    populationWindowEnd: '19:00',
    evidenceGrade: 'B',
    rationale: 'Evening dosing supports consistent INR monitoring timing and aligns with circadian coagulation factor rhythms. Allows same-day dose adjustment after morning INR result.',
    keyTrial: 'Pinotti et al., Arterioscler Thromb Vasc Biol 2005',
    phaseOffsetSensitive: false,
  },
}

/**
 * Adjust population timing window by patient DLMO phase offset
 * phaseOffsetMinutes: positive = phase delayed (later chronotype), negative = phase advanced
 */
export function adjustTimingForPhase(
  timing: MedicationTiming,
  phaseOffsetMinutes: number
): { start: string; end: string } {
  if (!timing.phaseOffsetSensitive) {
    return { start: timing.populationWindowStart, end: timing.populationWindowEnd }
  }

  const adjustMinutes = (time: string, offsetMins: number): string => {
    const [h, m] = time.split(':').map(Number)
    const totalMins = ((h * 60 + m + offsetMins) % 1440 + 1440) % 1440
    const adjH = Math.floor(totalMins / 60).toString().padStart(2, '0')
    const adjM = (totalMins % 60).toString().padStart(2, '0')
    return `${adjH}:${adjM}`
  }

  return {
    start: adjustMinutes(timing.populationWindowStart, phaseOffsetMinutes),
    end: adjustMinutes(timing.populationWindowEnd, phaseOffsetMinutes),
  }
}
