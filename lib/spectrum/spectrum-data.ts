export const SPECTRUM_COLOURS = {
  highRisk: '#1A365D',
  optimal: '#ED8936',
  spotAlert: '#D53F8C',
  nodes: [
    '#C4B5D9',
    '#A99BC9',
    '#8E82B9',
    '#7468A9',
    '#5A4F99',
    '#403589',
    '#2D1B69',
  ],
  neutralLine: '#888880',
  gridLine: 'rgba(136,135,128,0.18)',
  nodeGuide: 'rgba(136,135,128,0.35)',
  optimalZone: 'rgba(237,137,54,0.08)',
  riskZone: 'rgba(26,54,93,0.08)',
  alertRed: '#DC2626',
  alertGreen: '#16A34A',
} as const

export type SpectrumNodeSpec = {
  id: string
  label: string
  shortLabel: string
  nodeColor: string
  mechanism: string
  drugCluster: string[]
  micronutrients: string[]
  differentials: string[]
  clinicalScript: string
  layer1Signal: string
  layer2Signal: string
  layer3Signal: string
}

export const SPECTRUM_NODES: SpectrumNodeSpec[] = [
  {
    id: 'body-clock',
    label: 'Body clock',
    shortLabel: 'Clock',
    nodeColor: '#C4B5D9',
    mechanism:
      'SCN entrainment via ipRGC melanopsin pathway — MLux is the primary zeitgeber',
    drugCluster: ['Melatonin', 'Ramelteon', 'Tasimelteon'],
    micronutrients: ['Magnesium glycinate', 'Vitamin B12', 'Tryptophan'],
    differentials: ['DSPD', 'ASPD', 'Shift work disorder', 'Jet lag'],
    clinicalScript:
      'Evening chronotype with delayed MLux phase — consider morning bright light protocol and melatonin 0.5mg at target bedtime minus 5h',
    layer1Signal: 'MLux phase time from DIOS Coach camera session',
    layer2Signal: 'Melatonin metabolites (6-sulphatoxymelatonin) in Gominak panel',
    layer3Signal: 'TipTraQ sleep onset / MSFsc chronotype confirmation',
  },
  {
    id: 'sleep-quality',
    label: 'Sleep quality',
    shortLabel: 'Sleep',
    nodeColor: '#A99BC9',
    mechanism:
      'Circadian gating of NREM/REM — disrupted MLux suppresses slow-wave initiation',
    drugCluster: ['Zolpidem', 'Zopiclone', 'Melatonin PR'],
    micronutrients: ['Magnesium threonate', 'Glycine', 'L-theanine'],
    differentials: ['OSA', 'Insomnia disorder', 'REM behaviour disorder', 'PLMD'],
    clinicalScript:
      'Low nocturnal dark exposure reducing sleep pressure — evening light curfew 21:15, blackout protocol, review OSA risk',
    layer1Signal: 'Nocturnal MLux adequacy from DIOS Coach session',
    layer2Signal:
      'Vitamin D status — Gominak 60-80ng/ml optimal for sleep architecture',
    layer3Signal: 'TipTraQ REM latency, sleep efficiency, AHI proxy',
  },
  {
    id: 'blood-sugar',
    label: 'Blood sugar',
    shortLabel: 'Glucose',
    nodeColor: '#8E82B9',
    mechanism:
      'CLOCK/BMAL1 drive hepatic glucose output and peripheral insulin sensitivity — both circadian',
    drugCluster: ['Metformin', 'GLP-1 agonists', 'SGLT2 inhibitors'],
    micronutrients: ['Chromium', 'Berberine', 'Alpha-lipoic acid', 'Magnesium'],
    differentials: ['T2DM', 'Metabolic syndrome', 'Insulin resistance', 'NAFLD'],
    clinicalScript:
      'Evening chronotype doubles T2DM risk independently (UK Biobank, 84,790 participants, Lancet). Metformin optimal at breakfast — align with peripheral clock phase',
    layer1Signal: 'Chronotype + morning MLux adequacy from DIOS Coach',
    layer2Signal: 'HbA1c, fasting insulin, Gominak panel metabolic markers',
    layer3Signal:
      'TipTraQ sleep duration — <6h doubles insulin resistance independently',
  },
  {
    id: 'blood-pressure',
    label: 'Blood pressure',
    shortLabel: 'BP',
    nodeColor: '#7468A9',
    mechanism:
      'Circadian BP dipping driven by autonomic clock — non-dipping pattern doubles MACE risk',
    drugCluster: ['Ramipril', 'Amlodipine', 'Losartan', 'Bisoprolol'],
    micronutrients: ['CoQ10', 'Magnesium', 'Potassium', 'Taurine'],
    differentials: ['Non-dipping HTN', 'AF', 'Morning MACE risk', 'White coat HTN'],
    clinicalScript:
      'Hygia trial: bedtime antihypertensives reduce MACE 45% vs morning dosing (n=19,084). Move ramipril to DLMO+1h — typically 22:00-24:00 for evening types',
    layer1Signal: 'Evening chronotype flag from DIOS Coach + MLux phase time',
    layer2Signal: 'Renin-aldosterone ratio, potassium, magnesium in blood panel',
    layer3Signal: 'TipTraQ non-dipping confirmation — autonomic overnight pattern',
  },
  {
    id: 'immune-flare',
    label: 'Immune flare risk',
    shortLabel: 'Immune',
    nodeColor: '#5A4F99',
    mechanism:
      'VDR nuclear receptor activation gates inflammatory cytokine cascades — Coimbra protocol',
    drugCluster: ['Prednisolone', 'Hydroxychloroquine', 'DMARDs', 'Biologics'],
    micronutrients: ['Vitamin D3 (Coimbra high dose)', 'Vitamin K2', 'Magnesium', 'Omega-3'],
    differentials: ['MS', 'RA', 'SLE', 'Psoriasis', "Crohn's", 'UC'],
    clinicalScript:
      'Coimbra protocol: VDR resistance corrected by high-dose D3 + low-protein diet + hydration. Morning UVB exposure critical for endogenous D3 synthesis — MLux morning score is the proxy',
    layer1Signal:
      'Morning MLux adequacy (UVB proxy) + melanin calibration from DIOS Coach',
    layer2Signal: 'Vitamin D 25-OH, PTH, calcium, magnesium — full Gominak/Coimbra panel',
    layer3Signal: 'TipTraQ HRV — autonomic suppression precedes flare by 48-72h',
  },
  {
    id: 'brain-health',
    label: 'Brain health',
    shortLabel: 'Brain',
    nodeColor: '#403589',
    mechanism:
      'Glymphatic clearance of amyloid and tau is circadian — peaks during NREM slow-wave sleep',
    drugCluster: ['Sertraline', 'Escitalopram', 'Donepezil', 'Memantine'],
    micronutrients: ["Omega-3 DHA", "Lion's mane", 'Phosphatidylserine', 'B vitamins'],
    differentials: ['MCI', "Alzheimer's", 'MDD', 'Generalised anxiety', 'ADHD'],
    clinicalScript:
      "SSRI optimal timing at DLMO+2h for evening types — aligns with peak serotonin reuptake inhibition during circadian nadir. Donepezil at bedtime — Alzheimer's trials confirm nocturnal cholinergic advantage",
    layer1Signal: 'Phase delay + evening light exposure from DIOS Coach session',
    layer2Signal: 'Vitamin D, omega-3 index, B12, folate in Gominak panel',
    layer3Signal: 'TipTraQ REM duration — REM is the primary amyloid clearance window',
  },
  {
    id: 'cancer-risk',
    label: 'Cancer risk',
    shortLabel: 'Cancer',
    nodeColor: '#2D1B69',
    mechanism:
      'CLOCK genes (PER1, PER2, BMAL1) regulate DNA repair, apoptosis, and cell cycle — disruption enables oncogenesis',
    drugCluster: ['Tamoxifen', 'Letrozole', 'Capecitabine', 'Irinotecan'],
    micronutrients: [
      'Vitamin D3',
      'Selenium',
      'Melatonin (high dose oncology)',
      'Quercetin',
    ],
    differentials: ['Breast', 'Colorectal', 'Prostate', 'NHL', 'Melanoma'],
    clinicalScript:
      'Night shift work classified IARC Group 2A carcinogen. Chrono-oncology trials show 50% reduction in chemotherapy toxicity with circadian-timed dosing (Lévi et al). MLux night score is the sentinel biomarker',
    layer1Signal: 'Nocturnal light exposure score from DIOS Coach — night-shift flag',
    layer2Signal: 'Vitamin D, melatonin metabolites, inflammatory markers',
    layer3Signal: 'TipTraQ shift pattern confirmation + sleep fragmentation',
  },
]
