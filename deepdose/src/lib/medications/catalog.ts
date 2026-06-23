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
  | 'mental_health'
  | 'adhd'
  | 'supplements'
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
    id: 'mental_health',
    label: 'Mental health',
    description: 'Antidepressants and anxiolytics tracked at your current time.',
  },
  {
    id: 'adhd',
    label: 'ADHD & focus',
    description: 'Stimulant and non-stimulant ADHD medicines — consistent daily timing matters.',
  },
  {
    id: 'supplements',
    label: 'Vitamins & minerals',
    description: 'Common supplements, nutrients, and minerals — tracked at your current time.',
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
  itemType?: ItemType
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
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['sertraline', 'lustral', 'zoloft', 'ssri', 'antidepressant', 'depression', 'anxiety'],
  },
  citalopram: {
    displayName: 'Citalopram',
    drugClass: 'SSRI antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['citalopram', 'cipramil', 'ssri', 'antidepressant', 'depression', 'anxiety'],
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
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['amitriptyline', 'sleep', 'pain', 'depression', 'antidepressant'],
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
  // Mental health — depression & anxiety
  fluoxetine: {
    displayName: 'Fluoxetine',
    drugClass: 'SSRI antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['fluoxetine', 'prozac', 'ssri', 'antidepressant', 'depression', 'anxiety'],
  },
  escitalopram: {
    displayName: 'Escitalopram',
    drugClass: 'SSRI antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['escitalopram', 'cipralex', 'lexapro', 'ssri', 'antidepressant', 'depression', 'anxiety'],
  },
  paroxetine: {
    displayName: 'Paroxetine',
    drugClass: 'SSRI antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['paroxetine', 'seroxat', 'ssri', 'antidepressant', 'depression', 'anxiety'],
  },
  venlafaxine: {
    displayName: 'Venlafaxine',
    drugClass: 'SNRI antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['venlafaxine', 'effexor', 'snri', 'antidepressant', 'depression', 'anxiety'],
  },
  duloxetine: {
    displayName: 'Duloxetine',
    drugClass: 'SNRI antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['duloxetine', 'cymbalta', 'snri', 'antidepressant', 'depression', 'anxiety', 'pain'],
  },
  mirtazapine: {
    displayName: 'Mirtazapine',
    drugClass: 'NaSSA antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['mirtazapine', 'zispin', 'antidepressant', 'depression', 'sleep'],
  },
  bupropion: {
    displayName: 'Bupropion',
    drugClass: 'NDRI antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['bupropion', 'wellbutrin', 'zyban', 'antidepressant', 'depression', 'smoking'],
  },
  trazodone: {
    displayName: 'Trazodone',
    drugClass: 'Serotonin antagonist antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['trazodone', 'antidepressant', 'depression', 'sleep', 'insomnia'],
  },
  vortioxetine: {
    displayName: 'Vortioxetine',
    drugClass: 'Multimodal antidepressant',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['vortioxetine', 'brintellix', 'antidepressant', 'depression'],
  },
  diazepam: {
    displayName: 'Diazepam',
    drugClass: 'Benzodiazepine',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['diazepam', 'valium', 'anxiety', 'benzodiazepine'],
  },
  lorazepam: {
    displayName: 'Lorazepam',
    drugClass: 'Benzodiazepine',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['lorazepam', 'ativan', 'anxiety', 'benzodiazepine'],
  },
  propranolol: {
    displayName: 'Propranolol',
    drugClass: 'Beta blocker',
    clusterId: 'mental_health',
    doseUnit: 'mg',
    searchTerms: ['propranolol', 'beta blocker', 'anxiety', 'migraine'],
  },
  // ADHD / ADD
  methylphenidate: {
    displayName: 'Methylphenidate',
    drugClass: 'ADHD stimulant',
    clusterId: 'adhd',
    doseUnit: 'mg',
    searchTerms: ['methylphenidate', 'ritalin', 'concerta', 'medikinet', 'equasym', 'adhd', 'add', 'attention'],
  },
  dexamfetamine: {
    displayName: 'Dexamfetamine',
    drugClass: 'ADHD stimulant',
    clusterId: 'adhd',
    doseUnit: 'mg',
    searchTerms: ['dexamfetamine', 'dextroamphetamine', 'dexedrine', 'adhd', 'add', 'attention'],
  },
  lisdexamfetamine: {
    displayName: 'Lisdexamfetamine',
    drugClass: 'ADHD stimulant',
    clusterId: 'adhd',
    doseUnit: 'mg',
    searchTerms: ['lisdexamfetamine', 'elvanse', 'vyvanse', 'adhd', 'add', 'attention'],
  },
  atomoxetine: {
    displayName: 'Atomoxetine',
    drugClass: 'ADHD non-stimulant',
    clusterId: 'adhd',
    doseUnit: 'mg',
    searchTerms: ['atomoxetine', 'strattera', 'adhd', 'add', 'attention'],
  },
  guanfacine: {
    displayName: 'Guanfacine',
    drugClass: 'ADHD non-stimulant',
    clusterId: 'adhd',
    doseUnit: 'mg',
    searchTerms: ['guanfacine', 'intuniv', 'adhd', 'add', 'attention'],
  },
  modafinil: {
    displayName: 'Modafinil',
    drugClass: 'Wakefulness promoter',
    clusterId: 'adhd',
    doseUnit: 'mg',
    searchTerms: ['modafinil', 'provigil', 'adhd', 'narcolepsy', 'focus'],
  },
  // Common cardiovascular & metabolic
  rosuvastatin: {
    displayName: 'Rosuvastatin',
    drugClass: 'Statin',
    clusterId: 'cholesterol',
    doseUnit: 'mg',
    searchTerms: ['rosuvastatin', 'crestor', 'statin', 'cholesterol'],
  },
  pravastatin: {
    displayName: 'Pravastatin',
    drugClass: 'Statin',
    clusterId: 'cholesterol',
    doseUnit: 'mg',
    searchTerms: ['pravastatin', 'lipostat', 'statin', 'cholesterol'],
  },
  candesartan: {
    displayName: 'Candesartan',
    drugClass: 'ARB',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['candesartan', 'amias', 'blood pressure', 'heart'],
  },
  perindopril: {
    displayName: 'Perindopril',
    drugClass: 'ACE inhibitor',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['perindopril', 'coversyl', 'ace inhibitor', 'blood pressure'],
  },
  enalapril: {
    displayName: 'Enalapril',
    drugClass: 'ACE inhibitor',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['enalapril', 'innovace', 'ace inhibitor', 'blood pressure'],
  },
  lisinopril: {
    displayName: 'Lisinopril',
    drugClass: 'ACE inhibitor',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['lisinopril', 'zestril', 'ace inhibitor', 'blood pressure'],
  },
  hydrochlorothiazide: {
    displayName: 'Hydrochlorothiazide',
    drugClass: 'Thiazide diuretic',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['hydrochlorothiazide', 'hctz', 'diuretic', 'blood pressure', 'water tablet'],
  },
  spironolactone: {
    displayName: 'Spironolactone',
    drugClass: 'Potassium-sparing diuretic',
    clusterId: 'heart',
    doseUnit: 'mg',
    searchTerms: ['spironolactone', 'aldactone', 'diuretic', 'blood pressure'],
  },
  apixaban: {
    displayName: 'Apixaban',
    drugClass: 'DOAC anticoagulant',
    clusterId: 'coagulation',
    doseUnit: 'mg',
    searchTerms: ['apixaban', 'eliquis', 'anticoagulant', 'blood thinner'],
  },
  rivaroxaban: {
    displayName: 'Rivaroxaban',
    drugClass: 'DOAC anticoagulant',
    clusterId: 'coagulation',
    doseUnit: 'mg',
    searchTerms: ['rivaroxaban', 'xarelto', 'anticoagulant', 'blood thinner'],
  },
  edoxaban: {
    displayName: 'Edoxaban',
    drugClass: 'DOAC anticoagulant',
    clusterId: 'coagulation',
    doseUnit: 'mg',
    searchTerms: ['edoxaban', 'lixiana', 'anticoagulant', 'blood thinner'],
  },
  clopidogrel: {
    displayName: 'Clopidogrel',
    drugClass: 'Antiplatelet',
    clusterId: 'blood_thinning',
    doseUnit: 'mg',
    searchTerms: ['clopidogrel', 'plavix', 'antiplatelet', 'blood thinner'],
  },
  empagliflozin: {
    displayName: 'Empagliflozin',
    drugClass: 'SGLT2 inhibitor',
    clusterId: 'glucose',
    doseUnit: 'mg',
    searchTerms: ['empagliflozin', 'jardiance', 'diabetes', 'sglt2'],
  },
  dapagliflozin: {
    displayName: 'Dapagliflozin',
    drugClass: 'SGLT2 inhibitor',
    clusterId: 'glucose',
    doseUnit: 'mg',
    searchTerms: ['dapagliflozin', 'forxiga', 'diabetes', 'sglt2'],
  },
  sitagliptin: {
    displayName: 'Sitagliptin',
    drugClass: 'DPP-4 inhibitor',
    clusterId: 'glucose',
    doseUnit: 'mg',
    searchTerms: ['sitagliptin', 'januvia', 'diabetes'],
  },
  semaglutide: {
    displayName: 'Semaglutide',
    drugClass: 'GLP-1 agonist',
    clusterId: 'glucose',
    doseUnit: 'mg',
    searchTerms: ['semaglutide', 'ozempic', 'wegovy', 'rybelsus', 'diabetes', 'weight loss'],
  },
  liraglutide: {
    displayName: 'Liraglutide',
    drugClass: 'GLP-1 agonist',
    clusterId: 'glucose',
    doseUnit: 'mg',
    searchTerms: ['liraglutide', 'victoza', 'saxenda', 'diabetes', 'weight loss'],
  },
  insulin_aspart: {
    displayName: 'Insulin aspart',
    drugClass: 'Rapid insulin',
    clusterId: 'glucose',
    doseUnit: 'units',
    searchTerms: ['insulin aspart', 'novorapid', 'insulin', 'diabetes'],
  },
  // Pain, nerve & common daily meds
  pregabalin: {
    displayName: 'Pregabalin',
    drugClass: 'Anticonvulsant',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['pregabalin', 'lyrica', 'nerve pain', 'anxiety'],
  },
  ibuprofen: {
    displayName: 'Ibuprofen',
    drugClass: 'NSAID',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['ibuprofen', 'nurofen', 'pain', 'anti-inflammatory'],
  },
  naproxen: {
    displayName: 'Naproxen',
    drugClass: 'NSAID',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['naproxen', 'naprosyn', 'pain', 'anti-inflammatory'],
  },
  tramadol: {
    displayName: 'Tramadol',
    drugClass: 'Opioid analgesic',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['tramadol', 'pain', 'analgesic'],
  },
  co_codamol: {
    displayName: 'Co-codamol',
    drugClass: 'Opioid combination analgesic',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['co-codamol', 'cocodamol', 'codeine', 'paracetamol', 'pain'],
  },
  allopurinol: {
    displayName: 'Allopurinol',
    drugClass: 'Urate-lowering therapy',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['allopurinol', 'zyloric', 'gout'],
  },
  tamsulosin: {
    displayName: 'Tamsulosin',
    drugClass: 'Alpha blocker',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['tamsulosin', 'flomax', 'prostate', 'bph'],
  },
  finasteride: {
    displayName: 'Finasteride',
    drugClass: '5-alpha reductase inhibitor',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['finasteride', 'propecia', 'proscar', 'prostate', 'hair loss'],
  },
  montelukast: {
    displayName: 'Montelukast',
    drugClass: 'Leukotriene receptor antagonist',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['montelukast', 'singulair', 'asthma', 'allergy'],
  },
  beclometasone: {
    displayName: 'Beclometasone',
    drugClass: 'Inhaled corticosteroid',
    clusterId: 'other',
    doseUnit: 'mcg',
    searchTerms: ['beclometasone', 'clenil', 'inhaler', 'asthma', 'copd'],
  },
  fluticasone: {
    displayName: 'Fluticasone',
    drugClass: 'Inhaled corticosteroid',
    clusterId: 'other',
    doseUnit: 'mcg',
    searchTerms: ['fluticasone', 'flixotide', 'inhaler', 'asthma', 'nasal spray'],
  },
  cetirizine: {
    displayName: 'Cetirizine',
    drugClass: 'Antihistamine',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['cetirizine', 'zyrtec', 'piriteze', 'allergy', 'hay fever'],
  },
  loratadine: {
    displayName: 'Loratadine',
    drugClass: 'Antihistamine',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['loratadine', 'clarityn', 'allergy', 'hay fever'],
  },
  ferrous_sulfate: {
    displayName: 'Ferrous sulfate',
    drugClass: 'Iron supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['ferrous sulfate', 'ferrous sulphate', 'iron', 'iron tablets', 'anaemia', 'anemia'],
  },
  folic_acid: {
    displayName: 'Folic acid',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['folic acid', 'folate', 'vitamin b9', 'pregnancy'],
  },
  omega_3: {
    displayName: 'Omega-3',
    drugClass: 'Fish oil supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['omega 3', 'omega-3', 'fish oil', 'cod liver oil', 'epa', 'dha', 'supplement'],
  },
  zinc: {
    displayName: 'Zinc',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['zinc', 'zinc picolinate', 'zinc gluconate', 'mineral', 'immune'],
  },
  calcium: {
    displayName: 'Calcium',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['calcium', 'calcium carbonate', 'calcium citrate', 'mineral', 'bones'],
  },
  vitamin_c: {
    displayName: 'Vitamin C',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['vitamin c', 'ascorbic acid', 'immune', 'supplement'],
  },
  vitamin_e: {
    displayName: 'Vitamin E',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'iu',
    searchTerms: ['vitamin e', 'tocopherol', 'supplement'],
  },
  vitamin_a: {
    displayName: 'Vitamin A',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'iu',
    searchTerms: ['vitamin a', 'retinol', 'beta carotene', 'supplement'],
  },
  vitamin_k: {
    displayName: 'Vitamin K',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['vitamin k', 'phylloquinone', 'supplement'],
  },
  vitamin_k2: {
    displayName: 'Vitamin K2',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['vitamin k2', 'mk-7', 'mk7', 'menaquinone', 'supplement'],
  },
  thiamine_b1: {
    displayName: 'Vitamin B1 (thiamine)',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['vitamin b1', 'b1', 'thiamine', 'supplement'],
  },
  riboflavin_b2: {
    displayName: 'Vitamin B2 (riboflavin)',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['vitamin b2', 'b2', 'riboflavin', 'supplement'],
  },
  niacin_b3: {
    displayName: 'Vitamin B3 (niacin)',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['vitamin b3', 'b3', 'niacin', 'nicotinamide', 'supplement'],
  },
  pantothenic_acid_b5: {
    displayName: 'Vitamin B5 (pantothenic acid)',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['vitamin b5', 'b5', 'pantothenic acid', 'supplement'],
  },
  biotin_b7: {
    displayName: 'Biotin (vitamin B7)',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['biotin', 'vitamin b7', 'b7', 'hair skin nails', 'supplement'],
  },
  multivitamin: {
    displayName: 'Multivitamin',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['multivitamin', 'multi vitamin', 'daily vitamin', 'supplement'],
  },
  coq10: {
    displayName: 'CoQ10',
    drugClass: 'Antioxidant supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['coq10', 'coenzyme q10', 'ubiquinol', 'ubiquinone', 'supplement'],
  },
  selenium: {
    displayName: 'Selenium',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['selenium', 'selenomethionine', 'mineral', 'supplement'],
  },
  potassium: {
    displayName: 'Potassium',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['potassium', 'potassium citrate', 'mineral', 'electrolyte', 'supplement'],
  },
  chromium: {
    displayName: 'Chromium',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['chromium', 'chromium picolinate', 'mineral', 'glucose', 'supplement'],
  },
  iodine: {
    displayName: 'Iodine',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mcg',
    searchTerms: ['iodine', 'kelp', 'thyroid', 'mineral', 'supplement'],
  },
  magnesium_citrate: {
    displayName: 'Magnesium citrate',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['magnesium citrate', 'magnesium', 'mag citrate', 'mineral', 'supplement'],
  },
  magnesium_glycinate: {
    displayName: 'Magnesium glycinate',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['magnesium glycinate', 'mag glycinate', 'magnesium', 'mineral', 'sleep', 'supplement'],
  },
  probiotics: {
    displayName: 'Probiotics',
    drugClass: 'Gut health supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['probiotics', 'probiotic', 'lactobacillus', 'gut health', 'supplement'],
  },
  collagen: {
    displayName: 'Collagen',
    drugClass: 'Protein supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['collagen', 'collagen peptides', 'joints', 'skin', 'supplement'],
  },
  glucosamine: {
    displayName: 'Glucosamine',
    drugClass: 'Joint supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['glucosamine', 'joint', 'arthritis', 'supplement'],
  },
  chondroitin: {
    displayName: 'Chondroitin',
    drugClass: 'Joint supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['chondroitin', 'joint', 'glucosamine chondroitin', 'supplement'],
  },
  creatine: {
    displayName: 'Creatine',
    drugClass: 'Performance supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['creatine', 'creatine monohydrate', 'supplement'],
  },
  curcumin: {
    displayName: 'Turmeric / curcumin',
    drugClass: 'Botanical supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['turmeric', 'curcumin', 'inflammation', 'supplement'],
  },
  l_theanine: {
    displayName: 'L-theanine',
    drugClass: 'Amino acid supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['l-theanine', 'theanine', 'calm', 'sleep', 'supplement'],
  },
  valerian_root: {
    displayName: 'Valerian root',
    drugClass: 'Herbal supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['valerian', 'valerian root', 'sleep', 'herbal', 'supplement'],
  },
  ashwagandha: {
    displayName: 'Ashwagandha',
    drugClass: 'Adaptogen supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['ashwagandha', 'adaptogen', 'stress', 'supplement'],
  },
  evening_primrose_oil: {
    displayName: 'Evening primrose oil',
    drugClass: 'Botanical supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['evening primrose', 'epo', 'gamma linolenic', 'supplement'],
  },
  psyllium_husk: {
    displayName: 'Psyllium husk',
    drugClass: 'Fibre supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['psyllium', 'fibre', 'fiber', 'ispaghula', 'gut', 'supplement'],
  },
  berberine: {
    displayName: 'Berberine',
    drugClass: 'Botanical supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['berberine', 'glucose', 'metabolic', 'supplement'],
  },
  nac: {
    displayName: 'NAC',
    drugClass: 'Amino acid supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['nac', 'n-acetylcysteine', 'n acetyl cysteine', 'supplement'],
  },
  alpha_lipoic_acid: {
    displayName: 'Alpha-lipoic acid',
    drugClass: 'Antioxidant supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['alpha lipoic acid', 'ala', 'antioxidant', 'supplement'],
  },
  milk_thistle: {
    displayName: 'Milk thistle',
    drugClass: 'Herbal supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['milk thistle', 'silymarin', 'liver', 'supplement'],
  },
  electrolytes: {
    displayName: 'Electrolytes',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['electrolytes', 'electrolyte', 'hydration', 'mineral', 'supplement'],
  },
  boron: {
    displayName: 'Boron',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['boron', 'mineral', 'bones', 'supplement'],
  },
  copper: {
    displayName: 'Copper',
    drugClass: 'Mineral supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['copper', 'mineral', 'supplement'],
  },
  five_htp: {
    displayName: '5-HTP',
    drugClass: 'Amino acid supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['5-htp', '5 htp', 'serotonin', 'sleep', 'mood', 'supplement'],
  },
  sam_e: {
    displayName: 'SAM-e',
    drugClass: 'Methyl donor supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['sam-e', 'sam e', 's-adenosyl methionine', 'mood', 'joints', 'supplement'],
  },
  msm: {
    displayName: 'MSM',
    drugClass: 'Sulfur supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['msm', 'methylsulfonylmethane', 'joints', 'supplement'],
  },
  vitamin_d2: {
    displayName: 'Vitamin D2',
    drugClass: 'Vitamin supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'iu',
    searchTerms: ['vitamin d2', 'd2', 'ergocalciferol', 'vitamin d', 'supplement'],
  },
  iron_bisglycinate: {
    displayName: 'Iron bisglycinate',
    drugClass: 'Iron supplement',
    clusterId: 'supplements',
    itemType: 'supplement',
    doseUnit: 'mg',
    searchTerms: ['iron bisglycinate', 'iron', 'gentle iron', 'anaemia', 'anemia', 'supplement'],
  },
  levodopa: {
    displayName: 'Levodopa',
    drugClass: 'Dopamine precursor',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['levodopa', 'madopar', 'sinemet', 'parkinsons'],
  },
  carbamazepine: {
    displayName: 'Carbamazepine',
    drugClass: 'Anticonvulsant',
    clusterId: 'other',
    doseUnit: 'mg',
    searchTerms: ['carbamazepine', 'tegretol', 'epilepsy', 'nerve pain'],
  },
}

function buildOptimisedEntry(code: MedicationCode): MedicationCatalogEntry {
  const timing = MEDICATION_TIMINGS[code]
  const meta = OPTIMISED_META[code]
  const sharedTerms =
    meta.itemType === 'supplement' ? (['supplement', 'supp'] as const) : ([] as const)

  return {
    code,
    displayName: timing.displayName,
    drugClass: timing.drugClass,
    timingTier: 'optimised',
    clusterId: meta.clusterId,
    itemType: meta.itemType,
    searchTerms: [
      code.replace(/_/g, ' '),
      timing.displayName.toLowerCase(),
      ...meta.searchTerms,
      ...sharedTerms,
    ],
    doseUnit: meta.doseUnit,
    evidenceGrade: timing.evidenceGrade,
    rationale: timing.rationale,
    timing,
  }
}

function buildTrackedEntry(code: string, def: TrackedMedDef): MedicationCatalogEntry {
  const itemType = def.itemType ?? 'prescription'
  const sharedTerms =
    itemType === 'supplement' ? (['supplement', 'supp'] as const) : ([] as const)

  return {
    code,
    displayName: def.displayName,
    drugClass: def.drugClass,
    timingTier: 'tracked',
    clusterId: def.clusterId,
    itemType,
    searchTerms: [
      code.replace(/_/g, ' '),
      def.displayName.toLowerCase(),
      ...def.searchTerms,
      ...sharedTerms,
    ],
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

  if (
    (q === 'supp' || q === 'supplement' || q === 'supplements') &&
    entry.itemType === 'supplement'
  ) {
    return 45
  }
  if ((q === 'vitamin' || q === 'vitamins') && entry.drugClass.toLowerCase().includes('vitamin')) {
    return 55
  }
  if ((q === 'mineral' || q === 'minerals') && entry.drugClass.toLowerCase().includes('mineral')) {
    return 55
  }

  if (entry.code.replace(/_/g, ' ') === q) return 100
  if (entry.displayName.toLowerCase() === q) return 95
  if (entry.displayName.toLowerCase().startsWith(q)) return 80
  if (entry.code.replace(/_/g, ' ').startsWith(q)) return 75

  for (const term of entry.searchTerms) {
    const t = term.toLowerCase()
    if (t === q) return 90
    if (t.startsWith(q)) return 70
    if (q.length >= 3 && t.includes(q)) return 50
  }

  if (entry.displayName.toLowerCase().includes(q)) return 40
  if (entry.drugClass.toLowerCase().includes(q)) return 35

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
