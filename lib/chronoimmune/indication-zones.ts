export type ChronoimmuneZoneId = 1 | 2 | 3 | 4 | 5

export type ChronoimmuneZoneColour = 'green' | 'amber' | 'orange' | 'red' | 'deep-red'

export type MicronutrientItemId =
  | 'd3-k2'
  | 'b5'
  | 'b12'
  | 'magnesium-glycinate'
  | 'ferritin-support'
  | 'omega-3'
  | 'riboflavin-b2'
  | 'magnesium-citrate'
  | 'zinc'
  | 'selenium'
  | 'chromium'
  | 'alpha-lipoic-acid'
  | 'supervised-cofactors'

export type ChronoimmuneZoneSpec = {
  id: ChronoimmuneZoneId
  shortLabel: string
  title: string
  indication: string
  d3Guidance: string
  pthExpectation: string
  micronutrients: MicronutrientItemId[]
  labReviewFrequency: string
  safetyGateLevel: 'passive' | 'active' | 'maximum'
  colour: ChronoimmuneZoneColour
  neurodegenerationFlag?: boolean
}

export const CHRONOIMMUNE_ZONES: ChronoimmuneZoneSpec[] = [
  {
    id: 1,
    shortLabel: 'Optimise',
    title: 'Metabolic and Circadian Optimisation',
    indication:
      'General chronopenic burden, social jet lag, metabolic clock misalignment, preventive optimisation. Early insulin resistance, pre-diabetes, mild NAFLD, subclinical hypothyroidism, mild PCOS, elevated hsCRP without diagnosis.',
    d3Guidance: 'Gominak range 60 to 80 ng/mL serum 25(OH)D.',
    pthExpectation: 'Mid-range — lower third not yet targeted.',
    micronutrients: ['d3-k2', 'b5', 'b12', 'magnesium-glycinate', 'ferritin-support'],
    labReviewFrequency: 'Every six months',
    safetyGateLevel: 'passive',
    colour: 'green',
  },
  {
    id: 2,
    shortLabel: 'Derm / mild',
    title: 'Dermatological and Mild Autoimmune',
    indication:
      'Psoriasis, eczema, mild inflammatory autoimmune, early metabolic syndrome. Type 2 diabetes — immune reclassification, mild PCOS with inflammatory markers, early atherosclerosis elevated hsCRP, Hashimoto euthyroid, atopic eczema, mild asthma.',
    d3Guidance: 'Approximately 10,000 to 30,000 IU daily, weight-adjusted.',
    pthExpectation: 'Lower third of reference range.',
    micronutrients: [
      'd3-k2',
      'b5',
      'b12',
      'magnesium-glycinate',
      'ferritin-support',
      'omega-3',
      'riboflavin-b2',
      'chromium',
      'alpha-lipoic-acid',
    ],
    labReviewFrequency: 'Every three to six months',
    safetyGateLevel: 'passive',
    colour: 'amber',
  },
  {
    id: 3,
    shortLabel: 'Moderate',
    title: 'Moderate Autoimmune',
    indication:
      'Rheumatoid arthritis, lupus, Hashimoto, Crohn, moderate inflammatory burden. Established type 2 diabetes with complications, NASH, moderate PCOS, rheumatoid arthritis, lupus mild to moderate, Crohn in remission, Graves disease.',
    d3Guidance: 'Approximately 30,000 to 60,000 IU daily, weight-adjusted.',
    pthExpectation: 'Lower third — monitored monthly initially.',
    micronutrients: [
      'd3-k2',
      'b5',
      'b12',
      'magnesium-glycinate',
      'ferritin-support',
      'omega-3',
      'riboflavin-b2',
      'magnesium-citrate',
      'zinc',
      'selenium',
    ],
    labReviewFrequency: 'Every three months',
    safetyGateLevel: 'active',
    colour: 'orange',
  },
  {
    id: 4,
    shortLabel: 'Severe',
    title: 'Severe Neurological and Autoimmune',
    indication:
      'MS, ALS, Parkinson, severe lupus, treatment-resistant autoimmune. Severe NASH with fibrosis, morbid obesity with metabolic syndrome, treatment resistant type 2 diabetes.',
    d3Guidance: 'Approximately 60,000 to 100,000 IU daily — 1,000 IU per kg body weight starting calculation.',
    pthExpectation: 'Lower third mandatory — dual boundary alerts active.',
    micronutrients: [
      'd3-k2',
      'b5',
      'b12',
      'magnesium-glycinate',
      'ferritin-support',
      'omega-3',
      'riboflavin-b2',
      'magnesium-citrate',
      'zinc',
      'selenium',
      'supervised-cofactors',
    ],
    labReviewFrequency: 'Every one to three months',
    safetyGateLevel: 'maximum',
    colour: 'red',
  },
  {
    id: 5,
    shortLabel: 'Neuro risk',
    title: 'Neurodegeneration Risk',
    indication:
      'Early cognitive decline, Alzheimer risk, Parkinson prodrome, elevated Chronopenic Burden Score with retinal GCL-IPL thinning.',
    d3Guidance: 'Zone 4 dose range with CircadiAgeing referral pathway flagged.',
    pthExpectation: 'Lower third mandatory — dual boundary alerts active.',
    micronutrients: [
      'd3-k2',
      'b5',
      'b12',
      'magnesium-glycinate',
      'ferritin-support',
      'omega-3',
      'riboflavin-b2',
      'magnesium-citrate',
      'zinc',
      'selenium',
      'supervised-cofactors',
    ],
    labReviewFrequency: 'Every month',
    safetyGateLevel: 'maximum',
    colour: 'deep-red',
    neurodegenerationFlag: true,
  },
]

export const MICRONUTRIENT_LABELS: Record<MicronutrientItemId, string> = {
  'd3-k2': 'Vitamin D3 with K2',
  b5: 'Vitamin B5 (pantothenic acid)',
  b12: 'Vitamin B12 (methylcobalamin)',
  'magnesium-glycinate': 'Magnesium glycinate',
  'ferritin-support': 'Ferritin support',
  'omega-3': 'Omega-3 high dose',
  'riboflavin-b2': 'Riboflavin B2',
  'magnesium-citrate': 'Magnesium citrate',
  zinc: 'Zinc',
  selenium: 'Selenium',
  chromium: 'Chromium',
  'alpha-lipoic-acid': 'Alpha-lipoic acid',
  'supervised-cofactors': 'Supervised cofactor titration',
}

export function getChronoimmuneZone(id: ChronoimmuneZoneId): ChronoimmuneZoneSpec {
  const zone = CHRONOIMMUNE_ZONES.find((z) => z.id === id)
  if (!zone) throw new Error(`Unknown chronoimmune zone: ${id}`)
  return zone
}

export const ZONE_COLOUR_STYLES: Record<
  ChronoimmuneZoneColour,
  { fill: string; border: string; borderWidth: number; size: number }
> = {
  green: { fill: '#DCFCE7', border: '#16A34A', borderWidth: 1.5, size: 11 },
  amber: { fill: '#FEF3C7', border: '#D97706', borderWidth: 2, size: 13 },
  orange: { fill: '#FFEDD5', border: '#EA580C', borderWidth: 2, size: 14 },
  red: { fill: '#FEE2E2', border: '#DC2626', borderWidth: 2, size: 15 },
  'deep-red': { fill: '#FECACA', border: '#7F1D1D', borderWidth: 2.5, size: 16 },
}
