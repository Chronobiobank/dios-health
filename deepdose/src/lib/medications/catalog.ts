import {
  MEDICATION_TIMINGS,
  adjustTimingForPhase,
  type MedicationCode,
  type MedicationTiming,
} from '@/lib/circadian/medications'

export type TimingTier = 'optimised' | 'tracked'
export type ItemType = 'prescription' | 'supplement'
export type DoseUnit = 'mg' | 'mcg' | 'iu' | 'units'

export type ClusterId =
  | 'sleep'
  | 'heart'
  | 'cholesterol'
  | 'glucose'
  | 'blood_thinning'
  | 'inflammation'
  | 'bones'
  | 'coagulation'
  | 'hiv'
  | 'other'

export interface MedicationCluster {
  id: ClusterId
  label: string
  description: string
}

export const MEDICATION_CLUSTERS: readonly MedicationCluster[] = [
  {
    id: 'sleep',
    label: 'Sleep & wind-down',
    description: 'Melatonin, magnesium, and vitamins that hit your sleep switches.',
  },
  {
    id: 'heart',
    label: 'Blood pressure & heart',
    description: 'Medicines timed to nocturnal blood pressure and morning surge.',
  },
  {
    id: 'cholesterol',
    label: 'Cholesterol',
    description: 'Statins aligned to night-time liver synthesis.',
  },
  {
    id: 'glucose',
    label: 'Blood sugar',
    description: 'Diabetes medicines matched to morning glucose rhythms.',
  },
  {
    id: 'blood_thinning',
    label: 'Stroke prevention',
    description: 'Antiplatelet timing for morning cardiovascular risk.',
  },
  {
    id: 'inflammation',
    label: 'Inflammation & joints',
    description: 'Steroids timed to pre-dawn inflammatory peaks.',
  },
  {
    id: 'bones',
    label: 'Bones',
    description: 'Bisphosphonates with fasting morning rules.',
  },
  {
    id: 'coagulation',
    label: 'Anticoagulation',
    description: 'Warfarin and INR-aware evening dosing.',
  },
  {
    id: 'hiv',
    label: 'PrEP & HIV treatment',
    description: 'Daily PrEP and antiretroviral regimens — same-time dosing matters.',
  },
  {
    id: 'other',
    label: 'Other medicines',
    description: 'Tracked at your current time until we add clock timing.',
  },
] as const

export interface MedicationCatalogEntry {
  code: string
  displayName: string
  drugClass: string
  timingTier: TimingTier
  clusterId: ClusterId
  itemType: ItemType
  searchTerms: string[]
  doseUnit: DoseUnit
  evidenceGrade: 'A' | 'B' | 'C' | null
  rationale: string | null
  /** Present when timingTier === 'optimised' */
  timing?: MedicationTiming
}

const OPTIMISED_META: Record<
  MedicationCode,
  Pick<MedicationCatalogEntry, 'clusterId' | 'itemType' | 'searchTerms' | 'doseUnit'>
> = {
  atorvastatin: {
    clusterId: 'cholesterol',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['atorvastatin', 'lipitor', 'statin'],
  },
  simvastatin: {
    clusterId: 'cholesterol',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['simvastatin', 'zocor', 'statin'],
  },
  ramipril: {
    clusterId: 'heart',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['ramipril', 'ace inhibitor', 'titrace'],
  },
  amlodipine: {
    clusterId: 'heart',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['amlodipine', 'istin', 'calcium channel'],
  },
  metformin: {
    clusterId: 'glucose',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['metformin', 'glucophage', 'diabetes'],
  },
  aspirin: {
    clusterId: 'blood_thinning',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['aspirin', 'dispirin', 'antiplatelet', '75mg'],
  },
  prednisolone: {
    clusterId: 'inflammation',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['prednisolone', 'steroid', 'corticosteroid'],
  },
  alendronate: {
    clusterId: 'bones',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['alendronate', 'fosamax', 'bisphosphonate'],
  },
  warfarin: {
    clusterId: 'coagulation',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['warfarin', 'anticoagulant', 'inr'],
  },
  melatonin_supplement: {
    clusterId: 'sleep',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['melatonin', 'sleep aid', 'circadin'],
  },
  magnesium: {
    clusterId: 'sleep',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['magnesium', 'mag', 'glycinate', 'citrate', 'sleep'],
  },
  vitamin_d3: {
    clusterId: 'sleep',
    itemType: 'supplement',
    doseUnit: 'iu',
    searchTerms: ['vitamin d', 'vitamin d3', 'd3', 'cholecalciferol', 'vit d'],
  },
  vitamin_b6: {
    clusterId: 'sleep',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['vitamin b6', 'b6', 'pyridoxine', 'sleep formula'],
  },
  vitamin_b12: {
    clusterId: 'sleep',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['vitamin b12', 'b12', 'cobalamin', 'methylcobalamin'],
  },
  prep_truvada: {
    clusterId: 'hiv',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['prep', 'truvada', 'tenofovir', 'emtricitabine', 'hiv prevention', 'tdf'],
  },
  prep_descovy: {
    clusterId: 'hiv',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['prep', 'descovy', 'tenofovir alafenamide', 'taf', 'hiv prevention'],
  },
  haart_biktarvy: {
    clusterId: 'hiv',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['biktarvy', 'haart', 'hiv', 'antiretroviral', 'art', 'bictegravir'],
  },
  haart_triumeq: {
    clusterId: 'hiv',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['triumeq', 'haart', 'hiv', 'antiretroviral', 'art', 'abacavir'],
  },
  haart_dovato: {
    clusterId: 'hiv',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['dovato', 'haart', 'hiv', 'antiretroviral', 'art'],
  },
  haart_atripla: {
    clusterId: 'hiv',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['atripla', 'haart', 'hiv', 'antiretroviral', 'art', 'efavirenz'],
  },
  dolutegravir: {
    clusterId: 'hiv',
    itemType: 'prescription',
    doseUnit: 'mg',
    searchTerms: ['dolutegravir', 'tivicay', 'haart', 'hiv', 'integrase'],
  },
}

interface TrackedMedDef {
  displayName: string
  drugClass: string
  clusterId: ClusterId
  searchTerms: string[]
  doseUnit: DoseUnit
}

const TRACKED_MEDICATIONS: Record<string, TrackedMedDef> = {
  omeprazole: {
    displayName: 'Omeprazole',
    drugClass: 'Proton pump inhibitor',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['omeprazole', 'losec', 'ppi', 'heartburn'],
  },
  lansoprazole: {
    displayName: 'Lansoprazole',
    drugClass: 'Proton pump inhibitor',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['lansoprazole', 'zoton', 'ppi'],
  },
  levothyroxine: {
    displayName: 'Levothyroxine',
    drugClass: 'Thyroid hormone',
    clusterId: 'other',
    doseUnit: 'mcg',
    searchTerms: ['levothyroxine', 'thyroxine', 'thyrox', 'eltroxin'],
  },
  sertraline: {
    displayName: 'Sertraline',
    drugClass: 'SSRI antidepressant',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['sertraline', 'lustral', 'antidepressant'],
  },
  citalopram: {
    displayName: 'Citalopram',
    drugClass: 'SSRI antidepressant',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['citalopram', 'cipramil', 'antidepressant'],
  },
  bisoprolol: {
    displayName: 'Bisoprolol',
    drugClass: 'Beta blocker',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['bisoprolol', 'cardicor', 'beta blocker'],
  },
  gliclazide: {
    displayName: 'Gliclazide',
    drugClass: 'Sulfonylurea',
    clusterId: 'glucose',
    doseUnit: 'mg',
    searchTerms: ['gliclazide', 'diamicron', 'diabetes'],
  },
  losartan: {
    displayName: 'Losartan',
    drugClass: 'ARB',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['losartan', 'cozaar', 'blood pressure'],
  },
  zopiclone: {
    displayName: 'Zopiclone',
    drugClass: 'Hypnotic',
    clusterId: 'sleep',
    doseUnit: 'mg',
    searchTerms: ['zopiclone', 'zimovane', 'sleeping tablet'],
  },
  amitriptyline: {
    displayName: 'Amitriptyline',
    drugClass: 'Tricyclic antidepressant',
    clusterId: 'sleep',
    doseUnit: 'mg',
    searchTerms: ['amitriptyline', 'sleep', 'pain'],
  },
  gabapentin: {
    displayName: 'Gabapentin',
    drugClass: 'Anticonvulsant',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['gabapentin', 'neurontin', 'nerve pain'],
  },
  furosemide: {
    displayName: 'Furosemide',
    drugClass: 'Loop diuretic',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['furosemide', 'lasix', 'water tablet', 'diuretic'],
  },
  salbutamol: {
    displayName: 'Salbutamol',
    drugClass: 'Bronchodilator',
    clusterId: 'other',
    doseUnit: 'mcg',
    searchTerms: ['salbutamol', 'ventolin', 'inhaler', 'asthma'],
  },
  paracetamol: {
    displayName: 'Paracetamol',
    drugClass: 'Analgesic',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['paracetamol', 'panadol', 'calpol', 'pain relief'],
  },
  insulin_glargine: {
    displayName: 'Insulin glargine',
    drugClass: 'Basal insulin',
    clusterId: 'glucose',
    doseUnit: 'units',
    searchTerms: ['insulin glargine', 'lantus', 'insulin', 'diabetes'],
  },
  emtricitabine_tenofovir_generic: {
    displayName: 'PrEP (generic)',
    drugClass: 'HIV pre-exposure prophylaxis',
    clusterId: 'hiv',
    doseUnit: 'mg',
    searchTerms: ['prep', 'generic prep', 'emtricitabine', 'tenofovir', 'ftc', 'tdf', 'taf'],
  },
  rilpivirine: {
    displayName: 'Rilpivirine',
    drugClass: 'Antiretroviral (NNRTI)',
    clusterId: 'hiv',
    doseUnit: 'mg',
    searchTerms: ['rilpivirine', 'edurant', 'haart', 'hiv', 'art'],
  },
  tenofovir_alafenamide: {
    displayName: 'Tenofovir alafenamide',
    drugClass: 'Nucleotide reverse transcriptase inhibitor',
    clusterId: 'hiv',
    doseUnit: 'mg',
    searchTerms: ['tenofovir alafenamide', 'taf', 'vemlidy', 'hiv'],
  },
}

function buildOptimisedEntry(code: MedicationCode): MedicationCatalogEntry {
  const timing = MEDICATION_TIMINGS[code]
  const meta = OPTIMISED_META[code]
  return {
    code,
    displayName: timing.displayName,
    drugClass: timing.drugClass,
    timingTier: 'optimised',
    clusterId: meta.clusterId,
    itemType: meta.itemType,
    searchTerms: [code.replace(/_/g, ' '), timing.displayName.toLowerCase(), ...meta.searchTerms],
    doseUnit: meta.doseUnit,
    evidenceGrade: timing.evidenceGrade,
    rationale: timing.rationale,
    timing,
  }
}

function buildTrackedEntry(code: string, def: TrackedMedDef): MedicationCatalogEntry {
  return {
    code,
    displayName: def.displayName,
    drugClass: def.drugClass,
    timingTier: 'tracked',
    clusterId: def.clusterId,
    itemType: 'prescription',
    searchTerms: [code.replace(/_/g, ' '), def.displayName.toLowerCase(), ...def.searchTerms],
    doseUnit: def.doseUnit,
    evidenceGrade: null,
    rationale: null,
  }
}

let catalogCache: MedicationCatalogEntry[] | null = null

export function getMedicationCatalog(): MedicationCatalogEntry[] {
  if (catalogCache) return catalogCache

  const optimised = (Object.keys(MEDICATION_TIMINGS) as MedicationCode[]).map(buildOptimisedEntry)
  const tracked = Object.entries(TRACKED_MEDICATIONS).map(([code, def]) =>
    buildTrackedEntry(code, def)
  )

  catalogCache = [...optimised, ...tracked].sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  )
  return catalogCache
}

export function getCatalogEntry(code: string): MedicationCatalogEntry | undefined {
  return getMedicationCatalog().find((e) => e.code === code)
}

export function isCatalogCode(code: string): boolean {
  return getCatalogEntry(code) !== undefined
}

export function isOptimisedCode(code: string): boolean {
  return getCatalogEntry(code)?.timingTier === 'optimised'
}

export function getMedicationDisplayName(code: string): string {
  return getCatalogEntry(code)?.displayName ?? code.replace(/_/g, ' ')
}

export function getClusterLabel(clusterId: ClusterId): string {
  return MEDICATION_CLUSTERS.find((c) => c.id === clusterId)?.label ?? clusterId
}

function normaliseQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ')
}

function entryMatchesQuery(entry: MedicationCatalogEntry, query: string): number {
  const q = normaliseQuery(query)
  if (!q) return 0

  if (entry.code.replace(/_/g, ' ') === q) return 100
  if (entry.displayName.toLowerCase() === q) return 95
  if (entry.displayName.toLowerCase().startsWith(q)) return 80
  if (entry.code.replace(/_/g, ' ').startsWith(q)) return 75

  for (const term of entry.searchTerms) {
    const t = term.toLowerCase()
    if (t === q) return 90
    if (t.startsWith(q)) return 70
    if (t.includes(q)) return 50
  }

  if (entry.displayName.toLowerCase().includes(q)) return 40
  if (entry.drugClass.toLowerCase().includes(q)) return 30

  return 0
}

export interface SearchMedicationsOptions {
  clusterId?: ClusterId
  limit?: number
}

export function searchMedicationCatalog(
  query: string,
  options: SearchMedicationsOptions = {}
): MedicationCatalogEntry[] {
  const { clusterId, limit = 12 } = options
  const q = normaliseQuery(query)

  let entries = getMedicationCatalog()
  if (clusterId) {
    entries = entries.filter((e) => e.clusterId === clusterId)
  }

  if (!q) {
    return entries.slice(0, limit)
  }

  return entries
    .map((entry) => ({ entry, score: entryMatchesQuery(entry, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.displayName.localeCompare(b.entry.displayName))
    .slice(0, limit)
    .map(({ entry }) => entry)
}

export interface MedicationRecommendation {
  code: string
  displayName: string
  drugClass: string
  evidenceGrade: 'A' | 'B' | 'C' | null
  rationale: string | null
  recommendedStart: string | null
  recommendedEnd: string | null
  phaseAdjusted: boolean
  timingTier: TimingTier
  clusterId: ClusterId
  clusterLabel: string
  itemType: ItemType
  doseUnit: DoseUnit
}

export function buildMedicationRecommendation(
  entry: MedicationCatalogEntry,
  phaseOffsetMinutes: number
): MedicationRecommendation {
  if (entry.timingTier === 'optimised' && entry.timing) {
    const window = adjustTimingForPhase(entry.timing, phaseOffsetMinutes)
    return {
      code: entry.code,
      displayName: entry.displayName,
      drugClass: entry.drugClass,
      evidenceGrade: entry.evidenceGrade,
      rationale: entry.rationale,
      recommendedStart: window.start,
      recommendedEnd: window.end,
      phaseAdjusted: entry.timing.phaseOffsetSensitive && phaseOffsetMinutes !== 0,
      timingTier: 'optimised',
      clusterId: entry.clusterId,
      clusterLabel: getClusterLabel(entry.clusterId),
      itemType: entry.itemType,
      doseUnit: entry.doseUnit,
    }
  }

  return {
    code: entry.code,
    displayName: entry.displayName,
    drugClass: entry.drugClass,
    evidenceGrade: null,
    rationale:
      'We track this medicine at your current time. Clock-optimised timing is coming for this drug.',
    recommendedStart: null,
    recommendedEnd: null,
    phaseAdjusted: false,
    timingTier: 'tracked',
    clusterId: entry.clusterId,
    clusterLabel: getClusterLabel(entry.clusterId),
    itemType: entry.itemType,
    doseUnit: entry.doseUnit,
  }
}

export function defaultTimingForEntry(entry: MedicationCatalogEntry, phaseOffsetMinutes: number): string {
  const rec = buildMedicationRecommendation(entry, phaseOffsetMinutes)
  return rec.recommendedStart ?? '08:00'
}
