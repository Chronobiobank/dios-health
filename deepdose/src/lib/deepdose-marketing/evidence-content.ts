/** Evidence page — compressed theme tiles for patients, clinicians, and investors. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  DEEPDOSE_RESEARCH_CLUSTERS,
  DEEPDOSE_RESEARCH_INTRO,
  DEEPDOSE_RESEARCH_SCHOLARS,
} from '@/lib/deepdose-marketing/research-content'

export const EVIDENCE_PAGE_META = {
  title: `Chronotherapy sources · ${DEEPDOSE_NAME}`,
  description:
    'Peer-reviewed science on why when you take a medicine can matter as much as what you take.',
} as const

export const EVIDENCE_PAGE_INTRO = {
  eyebrow: 'Evidence',
  titleWhite: 'Timing',
  titleAccent: 'really matters',
} as const

export type EvidenceThemeLink = {
  href: string
  label: string
  meta: string
  external?: boolean
}

export type EvidenceTheme = {
  id: string
  cue: string
  label: string
  title: string
  body: string
  links: readonly EvidenceThemeLink[]
}

const CLUSTER_CUES: Record<string, string> = {
  foundational: '#c9b6f2',
  'drug-specific': '#f2b8a2',
  population: '#acd3de',
}

const CLUSTER_LABELS: Record<string, string> = {
  foundational: 'Science',
  'drug-specific': 'Trials',
  population: 'Population',
}

const CLUSTER_TITLES: Record<string, string> = {
  foundational: 'Body-clock foundations',
  'drug-specific': 'Same drug, different hour',
  population: 'Clocks at scale',
}

export const EVIDENCE_STAKES_THEME: EvidenceTheme = {
  id: 'stakes',
  cue: '#8b9cf8',
  label: 'Why now',
  title: 'Wrong hour, wrong dose',
  body: 'Mis-timed medicines and disrupted light–dark cycles compound into harm — night after night.',
  links: [
    {
      href: DEEPDOSE_RESEARCH_INTRO.human.href,
      label: 'Brighter nights predict higher mortality',
      meta: 'UK Biobank · PNAS 2024',
      external: true,
    },
    {
      href: DEEPDOSE_RESEARCH_INTRO.cost.href,
      label: 'NHS medicines optimisation',
      meta: 'England · Avoidable harm',
      external: true,
    },
  ],
} as const

export const EVIDENCE_CLUSTER_THEMES: EvidenceTheme[] = DEEPDOSE_RESEARCH_CLUSTERS.map(
  (cluster) => ({
    id: cluster.id,
    cue: CLUSTER_CUES[cluster.id] ?? '#8b9cf8',
    label: CLUSTER_LABELS[cluster.id] ?? cluster.tier,
    title: CLUSTER_TITLES[cluster.id] ?? cluster.tier,
    body: cluster.summary,
    links: cluster.papers.map((paper) => ({
      href: paper.href,
      label: paper.title,
      meta: `${paper.authors} · ${paper.year}`,
      external: true,
    })),
  })
)

export const EVIDENCE_SCHOLARS_THEME: EvidenceTheme = {
  id: 'scholars',
  cue: '#f2b8a2',
  label: 'Lineage',
  title: 'Who proved timing matters',
  body: 'From Halberg’s chronobiology to population-scale chronotype — the science behind personalised timing.',
  links: DEEPDOSE_RESEARCH_SCHOLARS.map(({ clinician, href, sourceLabel }) => ({
    href,
    label: clinician.name,
    meta: sourceLabel,
    external: true,
  })),
} as const

export const EVIDENCE_APPLY_THEME: EvidenceTheme = {
  id: 'apply',
  cue: '#acd3de',
  label: 'Deepdose',
  title: 'How we use this science',
  body: 'Published timing research powers your personal dosing windows — explore the platform or talk to your clinician.',
  links: [
    { href: '/technology', label: 'Technology overview', meta: 'How timing is computed' },
    { href: '/technology/dlmo-proxy', label: 'Body-clock estimation', meta: 'Proxy DLMO · Free tier' },
    { href: '/patient-landing', label: 'Patient dashboard', meta: 'Your daily dose cues' },
    { href: '/clinician-landing', label: 'Clinician panel', meta: 'Triage · Home validation' },
  ],
} as const

export const EVIDENCE_THEMES: EvidenceTheme[] = [
  EVIDENCE_STAKES_THEME,
  ...EVIDENCE_CLUSTER_THEMES,
  EVIDENCE_SCHOLARS_THEME,
  EVIDENCE_APPLY_THEME,
]
