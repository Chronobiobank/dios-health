export type EvidenceTier = {
  id: string
  title: string
  citations: EvidenceCitation[]
}

export type EvidenceCitation = {
  id: string
  source: string
  authors: string
  institution?: string
  year: string
  detail: string
  confirms: string
  doi?: string
  note?: string
}

export const EVIDENCE_TIERS: EvidenceTier[] = [
  {
    id: 'tier-1',
    title: 'Tier 1 — Foundational authority',
    citations: [
      {
        id: 'foster-2022',
        source: 'Life Time: The New Science of the Body Clock',
        authors: 'Foster, R.',
        institution: 'Sleep and Circadian Neuroscience Institute, University of Oxford',
        year: '2022',
        detail:
          'Penguin. Sunday Times bestseller. Chapter 10: "When to Take Drugs" — dedicated chapter establishing chronodosing as clinically significant across stroke, cardiovascular disease, and metabolic conditions.',
        confirms:
          'Chronodosing is Oxford-validated mainstream science, not an emerging fringe position.',
      },
      {
        id: 'pigazzani-2024',
        source:
          'Effect of timed dosing of usual antihypertensives according to patient chronotype on cardiovascular outcomes: the Chronotype sub-study cohort of the TIME study',
        authors: 'Pigazzani, F. et al.',
        institution: 'University of Dundee / University of Warwick',
        year: '2024',
        detail: 'eClinicalMedicine.',
        doi: '10.1016/j.eclinm.2024.102633',
        confirms:
          "Chronotype-informed antihypertensive dosing influences cardiovascular outcomes. Closest clinical trial to DIOS's core antihypertensive module. Used a questionnaire — DIOS replaces this with continuous wearable-derived MSFsc.",
      },
    ],
  },
  {
    id: 'tier-2',
    title: 'Tier 2 — Drug-specific evidence',
    citations: [
      {
        id: 'hermida-2020',
        source:
          'Bedtime hypertension treatment improves cardiovascular risk reduction: the Hygia Chronotherapy Trial',
        authors: 'Hermida, R.C. et al.',
        year: '2020',
        detail: 'European Heart Journal. 41(48): 4565–4576.',
        confirms:
          'Bedtime antihypertensive dosing reduces cardiovascular events.',
        note: 'Hygia reproducibility questions exist — present as supporting evidence alongside TIME study, not as standalone proof.',
      },
      {
        id: 'dallmann-2016',
        source:
          'Dosing-Time Makes the Poison: Circadian Regulation and Pharmacotherapy',
        authors: 'Dallmann, R., Okyar, A., Lévi, F.',
        year: '2016',
        detail: 'Trends in Molecular Medicine. 22(5): 430–445.',
        confirms:
          'Circadian regulation of drug metabolism affects efficacy and toxicity across drug classes.',
      },
      {
        id: 'hermida-2008',
        source:
          'Influence of time of day of blood pressure-lowering treatment on cardiovascular risk in hypertensive patients with type 2 diabetes',
        authors: 'Hermida, R.C. et al.',
        year: '2008',
        detail: 'Diabetes Care. 31(12): 2313–2318.',
        confirms:
          'Timing of antihypertensive treatment affects cardiovascular risk specifically in diabetic patients.',
      },
      {
        id: 'wallace-2003',
        source:
          'Taking simvastatin in the morning compared with in the evening: randomised controlled trial',
        authors: 'Wallace, A. et al.',
        year: '2003',
        detail: 'BMJ. 327(7418): 788. (Evening simvastatin evidence base; Preitner et al., 2002.)',
        confirms:
          'Simvastatin is consistently more effective when taken in the evening. Strongest and most actionable chronodosing evidence.',
      },
      {
        id: 'smolensky-2007',
        source: 'Chronobiology, drug delivery, and chronotherapeutics',
        authors: 'Smolensky, M.H., Peppas, N.A.',
        year: '2007',
        detail: 'Advanced Drug Delivery Reviews. 59(9–10): 828–851.',
        confirms:
          'Chronotherapy framework for anti-inflammatory and corticosteroid dosing, including pre-dawn inflammatory peak mechanism.',
      },
    ],
  },
  {
    id: 'tier-3',
    title: 'Tier 3 — Population and equity evidence',
    citations: [
      {
        id: 'roenneberg-2007',
        source: 'Epidemiology of the human circadian clock',
        authors: 'Roenneberg, T. et al.',
        year: '2007',
        detail: 'Sleep Medicine Reviews. 11(6): 429–438.',
        confirms:
          'MSFsc (mid-sleep on free days corrected for sleep debt) as the validated chronotype metric.',
        note: 'Derived primarily from Central European populations — the demographic gap DIOS corrects for.',
      },
      {
        id: 'amiama-roig-2022',
        source: 'Timing of Administration: For Commonly-Prescribed Medicines in Australia',
        authors: 'Amiama-Roig, A. et al.',
        year: '2022',
        detail: 'Pharmaceutics. 8(1): 13. PMC4932476.',
        confirms:
          'In 56% of studies reviewed, therapeutic effect varied with time of administration. Information provision to patients and health professionals about optimal timing lags behind evidence.',
      },
      {
        id: 'cajochen-2025',
        source:
          'Stuck in time: The slow march of circadian medicine and how to speed it up',
        authors: 'Cajochen, C. et al.',
        year: '2025',
        detail: 'Journal of Sleep Research.',
        confirms:
          'Clinicians do not routinely apply chronobiological approaches — the clinical translation gap DIOS exists to close.',
      },
    ],
  },
]

export const EQUITY_GAP = {
  title: "Why standard chronotherapy guidelines aren't enough",
  body: `Every major chronotherapy trial — Hygia, MAPEC, TIME, the Roenneberg chronotype normative dataset — was conducted on predominantly Northern and Southern European populations. The MSFsc norms, the dip timing thresholds, the recommended dosing windows: all calibrated to a demographic that represents a fraction of the patients GPs see in Auckland, London, or Melbourne.

DIOS is the first platform to correct for this. Skin tone-adjusted light entrainment, location-specific photoperiod, and wearable-derived chronotype mean that a Māori patient in Auckland in June and a South Asian patient in Birmingham in December receive timing recommendations calibrated to their actual body clock — not a German or Spanish population average.`,
  disclaimer: 'Statement of design intent — not a scientific claim.',
}
