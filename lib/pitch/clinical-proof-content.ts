/** Clinical proof landing detail — three evidence tiles with inline sources */

export type ClinicalProofTile = {
  id: string
  title: string
  body: string
  sources: readonly { label: string; href: string }[]
}

export const CLINICAL_PROOF_PAGE = {
  eyebrow: 'Strong clinical proof',
  title: 'Evidence converges.',
  subtitle:
    'Dose timing shapes cardiovascular, metabolic, and safety outcomes; evidence now supports clinical deployment.',
  tiles: [
    {
      id: 'cardiovascular',
      title: 'Cardiovascular',
      body: 'Bedtime versus morning antihypertensive dosing can change event rates — timing is a modifiable lever in BP pathways.',
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
      body: 'Circadian disruption from light–dark misalignment links to insulin resistance and type 2 diabetes risk.',
      sources: [
        {
          label: 'Lancet Regional Health — Europe 2024 metabolic risk',
          href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
        },
      ],
    },
    {
      id: 'safety',
      title: 'Safety',
      body: 'Clearer timing guidance supports medication safety, adherence, and fewer avoidable treatment escalations.',
      sources: [
        {
          label: 'BMJ Quality & Safety — medicines safety and timing',
          href: 'https://doi.org/10.1136/bmjqs-2019-010206',
        },
      ],
    },
  ] as const satisfies readonly ClinicalProofTile[],
} as const
