// lib/circadian/medications.ts
// Per-drug chronopharma timing logic for the 8 core medications
// All times are population-level defaults — adjusted per patient by DLMO offset in score.ts

export type MedicationCode =
  | 'atorvastatin'
  | 'simvastatin'
  | 'ramipril'
  | 'amlodipine'
  | 'metformin'
  | 'aspirin'
  | 'prednisolone'
  | 'alendronate'
  | 'warfarin'
  | 'melatonin_supplement'
  | 'magnesium'
  | 'vitamin_d3'
  | 'vitamin_b6'
  | 'vitamin_b12'
  | 'prep_truvada'
  | 'prep_descovy'
  | 'haart_biktarvy'
  | 'haart_triumeq'
  | 'haart_dovato'
  | 'haart_atripla'
  | 'dolutegravir'

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
  simvastatin: {
    code: 'simvastatin',
    displayName: 'Simvastatin',
    drugClass: 'Statin',
    populationWindowStart: '20:00',
    populationWindowEnd: '22:00',
    evidenceGrade: 'A',
    rationale: 'Same nocturnal hepatic synthesis rhythm as other statins. Evening dosing aligns with peak cholesterol production.',
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
  melatonin_supplement: {
    code: 'melatonin_supplement',
    displayName: 'Melatonin (supplement)',
    drugClass: 'Sleep onset signal',
    populationWindowStart: '20:00',
    populationWindowEnd: '21:00',
    evidenceGrade: 'B',
    rationale: 'Exogenous melatonin should align with your natural melatonin rise — not a fixed clock time. We anchor this to your estimated melatonin switch.',
    keyTrial: 'Auld et al., Sleep Med Rev 2017',
    phaseOffsetSensitive: true,
  },
  magnesium: {
    code: 'magnesium',
    displayName: 'Magnesium',
    drugClass: 'Nervous system calm',
    populationWindowStart: '21:00',
    populationWindowEnd: '22:30',
    evidenceGrade: 'C',
    rationale: 'Evening magnesium supports wind-down before sleep. Timing shifts with your lights-off and melatonin anchor.',
    keyTrial: 'Abbasi et al., J Res Med Sci 2012',
    phaseOffsetSensitive: true,
  },
  vitamin_d3: {
    code: 'vitamin_d3',
    displayName: 'Vitamin D3',
    drugClass: 'Daylight biology',
    populationWindowStart: '07:00',
    populationWindowEnd: '10:00',
    evidenceGrade: 'C',
    rationale: 'Vitamin D supports daytime biology and absorbs best with a morning meal — not at bedtime.',
    keyTrial: 'Golan et al., Nutrients 2018',
    phaseOffsetSensitive: true,
  },
  vitamin_b6: {
    code: 'vitamin_b6',
    displayName: 'Vitamin B6',
    drugClass: 'Sleep chemistry',
    populationWindowStart: '18:00',
    populationWindowEnd: '20:00',
    evidenceGrade: 'C',
    rationale: 'B6 supports serotonin–melatonin conversion. Evening timing fits sleep-formula use without morning activation.',
    keyTrial: 'Ebben et al., Percept Mot Skills 2002',
    phaseOffsetSensitive: true,
  },
  vitamin_b12: {
    code: 'vitamin_b12',
    displayName: 'Vitamin B12',
    drugClass: 'Morning activation',
    populationWindowStart: '07:00',
    populationWindowEnd: '09:00',
    evidenceGrade: 'C',
    rationale: 'B12 can feel activating. Morning dosing avoids sleep disruption and aligns with the wake switch.',
    keyTrial: 'Mayer et al., Nutrients 2019',
    phaseOffsetSensitive: true,
  },
  prep_truvada: {
    code: 'prep_truvada',
    displayName: 'PrEP (Truvada)',
    drugClass: 'HIV pre-exposure prophylaxis',
    populationWindowStart: '08:00',
    populationWindowEnd: '10:00',
    evidenceGrade: 'C',
    rationale:
      'Emtricitabine/tenofovir DF works when taken at the same time every day. We anchor your daily PrEP dose to your body-clock routine so it moves with your schedule.',
    keyTrial: 'BHIVA/BASHH PrEP guidelines; Grant et al., NEJM 2010 (iPrEx)',
    phaseOffsetSensitive: true,
  },
  prep_descovy: {
    code: 'prep_descovy',
    displayName: 'PrEP (Descovy)',
    drugClass: 'HIV pre-exposure prophylaxis',
    populationWindowStart: '08:00',
    populationWindowEnd: '10:00',
    evidenceGrade: 'C',
    rationale:
      'Emtricitabine/tenofovir AF requires consistent daily timing. Your window shifts with your melatonin anchor to keep adherence on a stable daily cue.',
    keyTrial: 'BHIVA/BASHH PrEP guidelines; Molina et al., Lancet HIV 2018 (DISCOVER)',
    phaseOffsetSensitive: true,
  },
  haart_biktarvy: {
    code: 'haart_biktarvy',
    displayName: 'Biktarvy',
    drugClass: 'Antiretroviral (integrase-based)',
    populationWindowStart: '08:00',
    populationWindowEnd: '10:00',
    evidenceGrade: 'C',
    rationale:
      'Once-daily bictegravir/emtricitabine/tenofovir AF depends on same-time dosing. We place your daily dose on a stable clock cue aligned to your rhythm.',
    keyTrial: 'BNF 5.3 · Gallant et al., Lancet 2017',
    phaseOffsetSensitive: true,
  },
  haart_triumeq: {
    code: 'haart_triumeq',
    displayName: 'Triumeq',
    drugClass: 'Antiretroviral (integrase-based)',
    populationWindowStart: '08:00',
    populationWindowEnd: '10:00',
    evidenceGrade: 'C',
    rationale:
      'Dolutegravir/abacavir/lamivudine is once daily — consistency beats time-of-day biology alone. Your window follows your body-clock anchor.',
    keyTrial: 'BNF 5.3 · Walmsley et al., NEJM 2013 (SINGLE)',
    phaseOffsetSensitive: true,
  },
  haart_dovato: {
    code: 'haart_dovato',
    displayName: 'Dovato',
    drugClass: 'Antiretroviral (integrase-based)',
    populationWindowStart: '08:00',
    populationWindowEnd: '10:00',
    evidenceGrade: 'C',
    rationale:
      'Dolutegravir/lamivudine needs a reliable daily time. We tie that to your circadian routine so it moves when your schedule shifts.',
    keyTrial: 'BNF 5.3 · Cahn et al., Lancet 2019 (GEMINI)',
    phaseOffsetSensitive: true,
  },
  haart_atripla: {
    code: 'haart_atripla',
    displayName: 'Atripla',
    drugClass: 'Antiretroviral (NNRTI-based)',
    populationWindowStart: '20:00',
    populationWindowEnd: '22:00',
    evidenceGrade: 'C',
    rationale:
      'Efavirenz-based regimens are often taken at bedtime to limit daytime side effects. Evening window shifts with your lights-off anchor.',
    keyTrial: 'BNF 5.3 · efavirenz CNS effects',
    phaseOffsetSensitive: true,
  },
  dolutegravir: {
    code: 'dolutegravir',
    displayName: 'Dolutegravir',
    drugClass: 'Integrase inhibitor',
    populationWindowStart: '08:00',
    populationWindowEnd: '10:00',
    evidenceGrade: 'C',
    rationale:
      'Once-daily dolutegravir requires consistent timing. Take with or without food at the same clock cue each day — adjusted to your body clock.',
    keyTrial: 'BNF 5.3 · dolutegravir SPC',
    phaseOffsetSensitive: true,
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
