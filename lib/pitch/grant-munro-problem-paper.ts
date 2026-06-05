/** Founder position paper — displayed in full on /pitch/problem */

import {
  GRANT_MUNRO_FOUNDER,
  GRANT_MUNRO_FOUNDER_ORIGIN,
  GRANT_MUNRO_PAPER_TITLE,
} from '@/lib/pitch/grant-munro-founder'

export type ProblemPaperSection = {
  id: string
  title: string
  paragraphs: readonly string[]
  bullets?: readonly string[]
}

export type ProblemPaperReference = {
  label: string
  href: string
}

export const GRANT_MUNRO_PROBLEM_PAPER = {
  slug: 'problem',
  eyebrow: 'Founder paper',
  title: GRANT_MUNRO_PAPER_TITLE,
  subtitle:
    'Why default medicine timing leaves clinical outcomes and system efficiency on the table — and what dose intelligence infrastructure must fix.',
  author: {
    name: GRANT_MUNRO_FOUNDER.name,
    role: GRANT_MUNRO_FOUNDER.role,
    affiliation: GRANT_MUNRO_FOUNDER.affiliationShort,
  },
  published: '2026',
  /** Drop the official PDF at this path in /public */
  pdfPath: '/papers/grant-munro-population-dosing-misses-biology.pdf',
  pdfFilename: 'Grant-Munro-Precision-Chronotherapy-2026.pdf',
  abstract: `Modern prescribing optimises what to take and how much — but rarely when. Dose timing is still governed by population convenience: morning statins, bedtime antihypertensives only where a trial happened to prove it, meal-linked metformin regardless of personal phase. Circadian pharmacology shows that the same molecule can differ materially in efficacy, tolerability, and safety depending on clock phase. Yet clinical pathways, formularies, and patient instructions remain generic.

This paper frames the problem DIOS was built to solve: the gap between chronotherapy evidence and routinised care. It connects patient-level biology to system-level waste — including NHS medicines optimisation and avoidable hospital load — and argues that precision timing requires infrastructure, not another adherence pamphlet.`,
  founderOrigin: GRANT_MUNRO_FOUNDER_ORIGIN,
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction — the missing variable',
      paragraphs: [
        'Medicine works on a clock. Receptor expression, drug absorption, hepatic metabolism, and target-organ sensitivity all cycle across the 24-hour day. Chronotherapy — aligning administration with those cycles — is not speculative fringe science. Decades of trials in cardiovascular, metabolic, respiratory, and psychiatric care show that time of day can change outcomes for the same approved dose.',
        'Despite that evidence, the default clinical instruction remains population-average timing: once daily in the morning, with evening or bedtime dosing reserved for agents where a landmark trial forced the question. Individual chronotype, sleep timing, shift work, and seasonal light exposure are rarely captured before a dose schedule is fixed.',
        'DIOS treats this as an infrastructure failure, not a patient behaviour failure. Until timing is measured, scored, and documented with the same seriousness as dose strength, avoidable variability will persist in every health system that prescribes at scale.',
      ],
    },
    {
      id: 'population-vs-biology',
      title: '2. Population averages vs circadian biology',
      paragraphs: [
        'Guidelines encode what worked in trial populations — often morning dosing for operational simplicity. That design choice made sense when measurement was expensive. It makes less sense when passive circadian signal can be captured from a smartphone, refined with home sleep monitoring, and linked to formulary decisions.',
        'The mismatch is structural: we personalise drug choice and increasingly dose strength, but we still hand the same clock instruction to a delayed sleep-phase patient, a night-shift worker, and a strict early-type retiree.',
      ],
      bullets: [
        'Antihypertensives: bedtime vs morning regimens change event rates in identifiable subgroups.',
        'Statins: HMG-CoA reductase rhythm favours evening dosing for several agents — yet morning convenience dominates.',
        'Metformin and insulin: hepatic glucose output is clock-gated; meal-linked timing ignores personal phase.',
        'Respiratory and PPI regimens: nocturnal symptom peaks are poorly served by morning-only defaults.',
      ],
    },
    {
      id: 'clinical-impact',
      title: '3. Clinical impact on patients',
      paragraphs: [
        'When timing is wrong, patients experience the failure as poor tolerability, weak effect, or unnecessary switches — not as a clock problem. That drives non-adherence, duplicated reviews, and therapeutic escalation that might have been avoided with a better-timed first regimen.',
        'The clinical cost is not only suboptimal disease control. It is trust: patients who "fail" on paper-adherent timing may be labelled resistant or non-compliant when the schedule was never aligned to their biology.',
      ],
    },
    {
      id: 'system-impact',
      title: '4. System and economic burden',
      paragraphs: [
        'In the NHS alone, poor medication timing contributes to over £300 million in wasted medicines annually — alongside reduced efficacy and avoidable hospital admissions. England’s national overprescribing review estimated that at least 10% of primary-care prescription items may not need to have been issued; a separate and larger story is medicines that are appropriate but taken at the wrong clock phase.',
        'Medicines optimisation, cardiovascular prevention, metabolic risk, and medication safety all intersect with timing. Systems that ignore the when inherit repeat workload: switches, escalations, medicines reviews, and unused packs.',
      ],
    },
    {
      id: 'deployment-gap',
      title: '5. Why deployment has stalled',
      paragraphs: [
        'Chronotherapy evidence has rarely been operationalised because measurement, consent, governance, and workflow integration were missing. Clinicians cannot act on timing intelligence they do not receive in the record. Patients cannot follow guidance they are never given in personal, actionable form.',
        'Point solutions — single-disease apps, static leaflets, or trial-specific bedtime rules — do not scale across formulary breadth. What is required is dose intelligence infrastructure: capture circadian signal, score confidence, produce schedule-ready output, and escalate to deeper diagnostics when risk is flagged.',
      ],
    },
    {
      id: 'dose-intelligence',
      title: '6. The case for dose intelligence',
      paragraphs: [
        'DIOS begins with scan, score, and schedule — free at the point of use for patients and clinicians — then escalates through blood panels and FDA-cleared home sleep monitoring when indicated. The objective is not to replace prescriber judgement but to supply it with patient-specific timing evidence inside existing pathways.',
        'Population dosing misses biology. Dose intelligence closes that gap — one patient, one clock, one schedule at a time.',
      ],
    },
  ] as const satisfies readonly ProblemPaperSection[],
  references: [
    {
      label: 'NHS England — pharmaceutical waste reduction',
      href: 'https://www.england.nhs.uk/wp-content/uploads/2015/06/pharmaceutical-waste-reduction.pdf',
    },
    {
      label: 'NHS England — Good for you, good for us, good for everybody (overprescribing review)',
      href: 'https://www.england.nhs.uk/publication/good-for-you-good-for-us-good-for-everybody/',
    },
    {
      label: 'Ruben et al. — Factors associated with medicine timing effects (meta-analysis)',
      href: 'https://www.medrxiv.org/content/10.1101/2021.10.24.21265348v1',
    },
    {
      label: 'Hermida et al. — Bedtime hypertension chronotherapy (Hygia)',
      href: 'https://doi.org/10.1093/eurheartj/ehz754',
    },
    {
      label: 'NHS medicines optimisation',
      href: 'https://www.england.nhs.uk/medicines-2/medicines-optimisation/',
    },
  ] as const satisfies readonly ProblemPaperReference[],
} as const

export type GrantMunroProblemPaper = typeof GRANT_MUNRO_PROBLEM_PAPER
