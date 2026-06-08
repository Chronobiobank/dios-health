/** Clinical proof landing detail — evidence tiles with inline sources */

import { GRANT_MUNRO_FOUNDER_ORIGIN } from '@/lib/pitch/grant-munro-founder'

export type ClinicalProofTile = {
  id: string
  title: string
  body: string
  sources: readonly { label: string; href: string }[]
}

export const CLINICAL_PROOF_PAGE = {
  eyebrow: 'Clinical proof',
  title: 'Personal timing beats standard dose.',
  subtitle:
    'Major heart, metabolism, and safety studies back timed dosing — the same biology DIOS tracks with bloods, TipTraQ sleep, and your phone.',
  founderBridge: GRANT_MUNRO_FOUNDER_ORIGIN.paragraphs[2],
  tiles: [
    {
      id: 'cardiovascular',
      title: 'Cardiovascular',
      body: 'Bedtime versus morning antihypertensive dosing changes event rates in the Hygia trial — timing is a modifiable lever in blood-pressure pathways, not a convenience choice.',
      sources: [
        {
          label: 'Hermida et al. — EHJ Hygia chronotherapy trial',
          href: 'https://doi.org/10.1093/eurheartj/ehz754',
        },
      ],
    },
    {
      id: 'metabolic',
      title: 'Metabolic',
      body: 'Circadian disruption from light–dark misalignment links to insulin resistance and type 2 diabetes risk — the same clock biology DIOS reads from light and sleep baselines.',
      sources: [
        {
          label: 'Lancet Regional Health — Europe 2024 metabolic risk',
          href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
        },
      ],
    },
    {
      id: 'photic',
      title: 'Photic dose',
      body: 'Melanopic lux from everyday light anchors personal timing — measurable from a phone, without assuming everyone shares the same chronotype.',
      sources: [
        {
          label: 'PNAS — melanopic lux and circadian dose',
          href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120',
        },
      ],
    },
    {
      id: 'safety',
      title: 'Safety',
      body: 'Clearer timing guidance supports medication safety, adherence, and fewer avoidable treatment escalations — cutting the harm from population-default schedules.',
      sources: [
        {
          label: 'BMJ Quality & Safety — medicines safety and timing',
          href: 'https://doi.org/10.1136/bmjqs-2019-010206',
        },
      ],
    },
  ] as const satisfies readonly ClinicalProofTile[],
} as const
