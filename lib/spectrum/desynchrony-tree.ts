import type { ChronoimmuneZoneId } from '@/lib/chronoimmune/indication-zones'

export type DesynchronyBranchId = 'metabolic-immune' | 'classical-immune' | 'neurological'

export type DesynchronyCategory = 'metabolic' | 'immune' | 'neurological' | 'regulatory'

export type ProtocolModule =
  | 'Chronoimmune'
  | 'Sleep Architecture'
  | 'Medication timing'
  | 'Metabolic Clock'

export type DesynchronyTreeNode = {
  id: string
  label: string
  shortLabel: string
  branchId: DesynchronyBranchId | 'root' | 'trunk'
  category: DesynchronyCategory
  reclassificationNote: string
  nlrp3Mechanism: string
  diosMeasurement: string
  protocolModule: ProtocolModule
  typicalZoneId: ChronoimmuneZoneId
}

export type DesynchronyBranchSpec = {
  id: DesynchronyBranchId
  title: string
  subtitle: string
  nodes: DesynchronyTreeNode[]
}

export const DESYNCHRONY_ROOT: DesynchronyTreeNode = {
  id: 'circadian-amplitude-dampening',
  label: 'Circadian Amplitude Dampening',
  shortLabel: 'Amplitude',
  branchId: 'root',
  category: 'regulatory',
  reclassificationNote:
    'Upstream regulatory failure — driven by light, nutrition, and movement deprivation.',
  nlrp3Mechanism:
    'BMAL1 amplitude collapse reduces clock-gated repair before NLRP3 is fully engaged.',
  diosMeasurement:
    'Layer 1 — First Light MLux score, social jet lag index, autonomic circadian index.',
  protocolModule: 'Metabolic Clock',
  typicalZoneId: 1,
}

export const DESYNCHRONY_TRUNK: DesynchronyTreeNode = {
  id: 'nlrp3-inflammasome',
  label: 'NLRP3 Inflammasome Dysregulation',
  shortLabel: 'NLRP3',
  branchId: 'trunk',
  category: 'regulatory',
  reclassificationNote:
    'Convergence mechanism — released from BMAL1 suppression, unrestrained by VDR insufficiency, amplified by gut dysbiosis.',
  nlrp3Mechanism:
    'IL-1β priming when circadian gates fail — connects metabolic, classical immune, and neurological expression.',
  diosMeasurement:
    'Layer 2 — PTH position, vitamin D, hsCRP; Layer 3 — HRV and sympathetic load on TipTraQ.',
  protocolModule: 'Chronoimmune',
  typicalZoneId: 2,
}

export const DESYNCHRONY_BRANCHES: DesynchronyBranchSpec[] = [
  {
    id: 'metabolic-immune',
    title: 'Metabolic Immune',
    subtitle: 'Metabolic conditions reclassified as immune-inflammatory expression',
    nodes: [
      {
        id: 'type-2-diabetes',
        label: 'Type 2 diabetes',
        shortLabel: 'T2DM',
        branchId: 'metabolic-immune',
        category: 'metabolic',
        reclassificationNote: 'Immune reclassification — IL-1β mediated β-cell stress, NLRP3 islet activation.',
        nlrp3Mechanism: 'NLRP3 inflammasome in islets drives IL-1β mediated β-cell destruction.',
        diosMeasurement: 'Layer 2 — fasting insulin, HbA1c; Layer 1 — morning MLux and meal timing.',
        protocolModule: 'Metabolic Clock',
        typicalZoneId: 2,
      },
      {
        id: 'obesity',
        label: 'Obesity',
        shortLabel: 'Obesity',
        branchId: 'metabolic-immune',
        category: 'metabolic',
        reclassificationNote: 'Adipose tissue as dysregulated immune organ — M1 macrophage infiltration.',
        nlrp3Mechanism: 'Adipose NLRP3 activation sustains low-grade IL-1β signalling.',
        diosMeasurement: 'Layer 1 — movement and light entrainment; Layer 2 — inflammatory panel.',
        protocolModule: 'Metabolic Clock',
        typicalZoneId: 2,
      },
      {
        id: 'nafld-nash',
        label: 'NAFLD and NASH',
        shortLabel: 'NAFLD',
        branchId: 'metabolic-immune',
        category: 'metabolic',
        reclassificationNote: 'Hepatic immune-metabolic overlap — steatosis to fibrosis on inflammatory axis.',
        nlrp3Mechanism: 'Hepatic macrophage NLRP3 activation and T-cell infiltration.',
        diosMeasurement: 'Layer 2 — liver panel and hsCRP; Layer 3 — sleep fragmentation index.',
        protocolModule: 'Metabolic Clock',
        typicalZoneId: 3,
      },
      {
        id: 'atherosclerosis',
        label: 'Atherosclerosis',
        shortLabel: 'CVD',
        branchId: 'metabolic-immune',
        category: 'metabolic',
        reclassificationNote: 'Immune plaque formation — JUPITER trial hsCRP evidence.',
        nlrp3Mechanism: 'Vascular NLRP3 drives inflammatory plaque remodelling.',
        diosMeasurement: 'Layer 2 — hsCRP, lipids; Layer 3 — non-dipping BP pattern on TipTraQ.',
        protocolModule: 'Medication timing',
        typicalZoneId: 2,
      },
      {
        id: 'hypertension',
        label: 'Hypertension',
        shortLabel: 'BP',
        branchId: 'metabolic-immune',
        category: 'metabolic',
        reclassificationNote: 'Vascular inflammatory remodelling — chronotherapy-sensitive.',
        nlrp3Mechanism: 'Autonomic-inflammatory coupling when circadian dipping fails.',
        diosMeasurement: 'Layer 3 — overnight dipping; Layer 1 — evening chronotype flag.',
        protocolModule: 'Medication timing',
        typicalZoneId: 2,
      },
      {
        id: 'pcos',
        label: 'PCOS',
        shortLabel: 'PCOS',
        branchId: 'metabolic-immune',
        category: 'metabolic',
        reclassificationNote: 'Upstream immune-hormonal dysregulation — elevated TNF-α, IL-6, CRP.',
        nlrp3Mechanism: 'Ovarian-inflammatory signalling amplified when VDR and clock amplitude fall.',
        diosMeasurement: 'Layer 2 — inflammatory and androgen panel; Layer 1 — light-meal alignment.',
        protocolModule: 'Metabolic Clock',
        typicalZoneId: 2,
      },
    ],
  },
  {
    id: 'classical-immune',
    title: 'Classical Immune',
    subtitle: 'Autoimmune and atopic conditions on the NLRP3 trunk',
    nodes: [
      {
        id: 'psoriasis',
        label: 'Psoriasis',
        shortLabel: 'Psoriasis',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 2 Chronoimmune indication — dermatological autoimmune.',
        nlrp3Mechanism: 'Keratinocyte IL-1β loop when VDR signalling is insufficient.',
        diosMeasurement: 'Layer 1 — morning UVB proxy MLux; Layer 2 — D3, PTH, calcium panel.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 2,
      },
      {
        id: 'rheumatoid-arthritis',
        label: 'Rheumatoid arthritis',
        shortLabel: 'RA',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 3 — established autoimmune with inflammatory burden.',
        nlrp3Mechanism: 'Synovial NLRP3-IL-1β axis drives joint destruction timing.',
        diosMeasurement: 'Layer 2 — full Coimbra panel; Layer 3 — flare HRV suppression.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 3,
      },
      {
        id: 'lupus',
        label: 'Lupus',
        shortLabel: 'SLE',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 3 — systemic autoimmune, mild to moderate.',
        nlrp3Mechanism: 'Type I interferon and NLRP3 crosstalk when circadian VDR gates fail.',
        diosMeasurement: 'Layer 2 — D3, complement, inflammatory markers.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 3,
      },
      {
        id: 'hashimotos',
        label: "Hashimoto's thyroiditis",
        shortLabel: 'Hashimoto',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 2 to 3 — euthyroid autoimmune overlap common.',
        nlrp3Mechanism: 'Thyroid autoimmunity amplified by gut-thyroid inflammatory axis.',
        diosMeasurement: 'Layer 2 — TSH, antibodies, D3; Layer 1 — sleep regularity.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 2,
      },
      {
        id: 'graves',
        label: "Graves' disease",
        shortLabel: 'Graves',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 2 to 3 — hyperthyroid autoimmune spectrum.',
        nlrp3Mechanism: 'Thyroid-stimulating immune surge when clock amplitude is low.',
        diosMeasurement: 'Layer 2 — thyroid panel with D3 titration monitoring.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 2,
      },
      {
        id: 'crohns-uc',
        label: "Crohn's and ulcerative colitis",
        shortLabel: 'IBD',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 3 — gut immune axis, remission and flare cycles.',
        nlrp3Mechanism: 'Gut NLRP3 and dysbiosis reinforce mucosal IL-1β release.',
        diosMeasurement: 'Layer 2 — inflammatory markers; Layer 3 — sleep stress load.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 3,
      },
      {
        id: 'multiple-sclerosis',
        label: 'Multiple sclerosis',
        shortLabel: 'MS',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 4 — severe neurological-autoimmune overlap.',
        nlrp3Mechanism: 'CNS inflammasome activity gates demyelination timing.',
        diosMeasurement: 'Layer 3 — REM and sympathetic load; Layer 2 — supervised D3 panel.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 4,
      },
      {
        id: 'atopic-conditions',
        label: 'Atopic conditions',
        shortLabel: 'Atopy',
        branchId: 'classical-immune',
        category: 'immune',
        reclassificationNote: 'Zone 2 — eczema, asthma, food allergy as circadian immune conditions.',
        nlrp3Mechanism: 'Barrier and mast-cell priming when Th2-IL-1β balance shifts.',
        diosMeasurement: 'Layer 1 — light and sleep regularity; Layer 2 — D3 and ferritin.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 2,
      },
    ],
  },
  {
    id: 'neurological',
    title: 'Neurological',
    subtitle: 'Brain, sleep, and surveillance failure downstream of NLRP3',
    nodes: [
      {
        id: 'sleep-architecture',
        label: 'Sleep architecture degradation',
        shortLabel: 'Sleep',
        branchId: 'neurological',
        category: 'neurological',
        reclassificationNote: 'REM insufficiency and brainstem nuclei dysfunction — not primary insomnia alone.',
        nlrp3Mechanism: 'Inflammatory tone disrupts REM initiation and glymphatic clearance windows.',
        diosMeasurement: 'Layer 3 — TipTraQ REM efficiency, AHI, micro-arousals.',
        protocolModule: 'Sleep Architecture',
        typicalZoneId: 2,
      },
      {
        id: 'cognitive-decline',
        label: 'Cognitive decline',
        shortLabel: 'Cognition',
        branchId: 'neurological',
        category: 'neurological',
        reclassificationNote: 'Early memory and executive function loss — prodromal, not age alone.',
        nlrp3Mechanism: 'Microglial NLRP3 activation impairs synaptic repair timing.',
        diosMeasurement: 'Layer 3 — REM duration; Layer 2 — B12, D3, omega-3 index.',
        protocolModule: 'Sleep Architecture',
        typicalZoneId: 5,
      },
      {
        id: 'affective-dysregulation',
        label: 'Affective dysregulation',
        shortLabel: 'Mood',
        branchId: 'neurological',
        category: 'neurological',
        reclassificationNote: 'Depression and anxiety as circadian immune conditions — reclassified in current literature.',
        nlrp3Mechanism: 'IL-1β and kynurenine pathway shift when amplitude dampening persists.',
        diosMeasurement: 'Layer 1 — phase delay; Layer 3 — sleep architecture fragmentation.',
        protocolModule: 'Medication timing',
        typicalZoneId: 2,
      },
      {
        id: 'neurodegeneration-risk',
        label: 'Neurodegeneration risk',
        shortLabel: 'Neuro',
        branchId: 'neurological',
        category: 'neurological',
        reclassificationNote: "Alzheimer's and Parkinson's prodrome — Zone 5 surveillance.",
        nlrp3Mechanism: 'Sustained NLRP3 microglial activation precedes proteinopathy spread.',
        diosMeasurement: 'Layer 3 — REM and slow-wave metrics from TipTraQ overnight readings.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 5,
      },
      {
        id: 'cancer-risk',
        label: 'Cancer risk',
        shortLabel: 'Cancer',
        branchId: 'neurological',
        category: 'neurological',
        reclassificationNote: 'Immune surveillance failure — circadian DNA repair timing disrupted.',
        nlrp3Mechanism: 'Clock-gated repair and apoptosis fail when BMAL1 amplitude collapses.',
        diosMeasurement: 'Layer 1 — nocturnal light score; Layer 3 — shift-pattern confirmation.',
        protocolModule: 'Metabolic Clock',
        typicalZoneId: 3,
      },
      {
        id: 'brancaccio-referral',
        label: 'Brancaccio referral pathway',
        shortLabel: 'Referral',
        branchId: 'neurological',
        category: 'neurological',
        reclassificationNote: 'Zone 5 escalation — astrocyte-GABA metronome failure, neurodegeneration research pathway.',
        nlrp3Mechanism: 'SCN astrocyte amplitude collapse downstream of VDR insufficiency — Brancaccio mechanism.',
        diosMeasurement: 'Layer 3 — retinal circadian index flagged; CircadiAgeing referral gate.',
        protocolModule: 'Chronoimmune',
        typicalZoneId: 5,
      },
    ],
  },
]

export const ALL_DESYNCHRONY_BRANCH_NODES: DesynchronyTreeNode[] = DESYNCHRONY_BRANCHES.flatMap(
  (branch) => branch.nodes
)

export function getDesynchronyNode(id: string): DesynchronyTreeNode | undefined {
  if (id === DESYNCHRONY_ROOT.id) return DESYNCHRONY_ROOT
  if (id === DESYNCHRONY_TRUNK.id) return DESYNCHRONY_TRUNK
  return ALL_DESYNCHRONY_BRANCH_NODES.find((node) => node.id === id)
}

export function zoneStyleForNode(zoneId: ChronoimmuneZoneId): {
  fill: string
  border: string
  borderWidth: number
  size: number
} {
  const map: Record<ChronoimmuneZoneId, { fill: string; border: string; borderWidth: number; size: number }> =
    {
      1: { fill: '#DCFCE7', border: '#16A34A', borderWidth: 1.5, size: 11 },
      2: { fill: '#FEF3C7', border: '#D97706', borderWidth: 2, size: 13 },
      3: { fill: '#FFEDD5', border: '#EA580C', borderWidth: 2, size: 14 },
      4: { fill: '#FEE2E2', border: '#DC2626', borderWidth: 2, size: 15 },
      5: { fill: '#FECACA', border: '#7F1D1D', borderWidth: 2.5, size: 16 },
    }
  return map[zoneId]
}

/** Demo — Sean James active on metabolic + classical immune branches simultaneously. */
export const SEAN_JAMES_ACTIVE_DESYNCHRONY_NODES = ['psoriasis', 'type-2-diabetes'] as const

/** Map legacy chronosomatic linear nodes to branch tree node ids. */
export function desynchronyNodesFromSpectrumSeverity(
  nodes: { id: string; severity: string }[]
): string[] {
  const elevated = new Set(
    nodes.filter((n) => n.severity !== 'weak').map((n) => n.id)
  )
  const mapped: string[] = []
  if (elevated.has('blood-sugar')) mapped.push('type-2-diabetes')
  if (elevated.has('blood-pressure')) mapped.push('hypertension')
  if (elevated.has('immune-system')) mapped.push('psoriasis')
  if (elevated.has('brain-health')) mapped.push('cognitive-decline')
  if (elevated.has('sleep-rhythm') || elevated.has('sleep-apnoea')) mapped.push('sleep-architecture')
  if (elevated.has('cancer-risk')) mapped.push('cancer-risk')
  return mapped
}
