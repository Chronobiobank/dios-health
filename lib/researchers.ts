export type Researcher = {
  id: string
  initials: string
  name: string
  institution: string
  role: string
  keyWork: string
  diosRelevance: string
}

export const RESEARCHERS: Researcher[] = [
  {
    id: 'foster',
    initials: 'RF',
    name: 'Prof. Russell Foster FRS',
    institution: 'University of Oxford',
    role:
      'Director, Sleep and Circadian Neuroscience Institute (SCNi) / Head, Nuffield Laboratory of Ophthalmology',
    keyWork:
      '*Life Time* (Penguin, 2022) — Sunday Times bestseller. Chapter 10: "When to Take Drugs." Discovered photosensitive retinal ganglion cells (pRGCs) — the biological mechanism underlying light-driven circadian entrainment.',
    diosRelevance:
      'The leading UK authority on circadian neuroscience. *Life Time* establishes chronodosing as mainstream Oxford science and argues directly for the clinical tool DIOS has built.',
  },
  {
    id: 'manfredini',
    initials: 'RM',
    name: 'Prof. Roberto Manfredini',
    institution: 'University of Ferrara, Italy',
    role: 'Chronobiologist, cardiovascular chronotherapy researcher',
    keyWork:
      'Co-author, TIME Chronotype sub-study (eClinicalMedicine, 2024). Extensive publication record on circadian cardiovascular risk.',
    diosRelevance:
      "Core investigator on the closest clinical trial to DIOS's antihypertensive module — chronotype-informed dosing of antihypertensives and cardiovascular outcomes.",
  },
  {
    id: 'pigazzani',
    initials: 'FP',
    name: 'Prof. Filippo Pigazzani',
    institution: 'University of Dundee (MEMO Research)',
    role: 'Lead author, TIME Chronotype sub-study',
    keyWork:
      'Pigazzani et al. (2024). "Effect of timed dosing of usual antihypertensives according to patient chronotype on cardiovascular outcomes." eClinicalMedicine. DOI: 10.1016/j.eclinm.2024.102633',
    diosRelevance:
      'Used a questionnaire to assess chronotype. DIOS replaces the questionnaire with continuous wearable-derived MSFsc — the next step this trial pointed towards.',
  },
  {
    id: 'levi',
    initials: 'FL',
    name: 'Prof. Francis Lévi',
    institution: 'Warwick Medical School / INSERM Paris',
    role:
      'Pioneer of cancer chronotherapy, founder of the Warwick Cancer Chronotherapy Unit',
    keyWork:
      'inCASA European Project — first home-based multidrug chronotherapy delivery platform for metastatic cancer patients. Over 30 years of clinical chronotherapy trials.',
    diosRelevance:
      'Established the clinical feasibility of wearable-monitored chronotherapy delivery at home. DIOS extends this model from oncology into primary care.',
  },
  {
    id: 'roenneberg',
    initials: 'TR',
    name: 'Prof. Till Roenneberg',
    institution: 'Ludwig Maximilian University of Munich',
    role: 'Chronobiologist, developer of the Munich Chronotype Questionnaire (MCTQ)',
    keyWork:
      'Roenneberg et al. (2007). "Epidemiology of the human circadian clock." Sleep Medicine Reviews. 11(6): 429–438. Coined "social jet lag." Developed MSFsc as the validated chronotype metric.',
    diosRelevance:
      "DIOS uses MSFsc — Roenneberg's validated metric — derived continuously from wearable data rather than a one-time questionnaire. His normative dataset was European; DIOS corrects for non-European populations.",
  },
  {
    id: 'hermida',
    initials: 'RH',
    name: 'Prof. Ramon Hermida',
    institution: 'University of Vigo, Spain',
    role: 'Lead investigator, Hygia Chronotherapy Trial and MAPEC study',
    keyWork:
      'Hermida et al. (2020). "Bedtime hypertension treatment improves cardiovascular risk reduction: the Hygia Chronotherapy Trial." European Heart Journal. 41(48): 4565–4576.',
    diosRelevance:
      "Established bedtime antihypertensive dosing as superior for cardiovascular outcomes — the core evidence for DIOS's non-dipper detection module. Note: reproducibility questions exist around Hygia; DIOS cites alongside the TIME study for balance.",
  },
  {
    id: 'smolensky',
    initials: 'MS',
    name: 'Prof. Michael Smolensky',
    institution: 'University of Texas, Houston',
    role: 'Chronobiologist, founding figure of clinical chronotherapy',
    keyWork:
      'Smolensky, M.H., Peppas, N.A. (2007). "Chronobiology, drug delivery, and chronotherapeutics." Advanced Drug Delivery Reviews. 59(9–10): 828–851.',
    diosRelevance:
      "Established the chronotherapy framework for anti-inflammatory and corticosteroid dosing — the evidence base for DIOS's prednisolone and NSAID module.",
  },
  {
    id: 'cajochen',
    initials: 'CC',
    name: 'Prof. Christian Cajochen',
    institution: 'University of Basel, Centre for Chronobiology',
    role: 'Chronobiologist, circadian medicine translation researcher',
    keyWork:
      'Cajochen et al. (2025). "Stuck in time: The slow march of circadian medicine and how to speed it up." Journal of Sleep Research.',
    diosRelevance:
      'Documented precisely the clinical translation gap DIOS exists to close — chronobiological approaches exist but clinicians do not routinely apply them. DIOS is the workflow tool that removes that friction.',
  },
]

/** Homepage condensed grid: Foster · Pigazzani · Hermida */
export const HOMEPAGE_RESEARCHER_IDS = ['foster', 'pigazzani', 'hermida'] as const

export function getHomepageResearchers(): Researcher[] {
  return HOMEPAGE_RESEARCHER_IDS.map((id) => RESEARCHERS.find((r) => r.id === id)!)
}

/** Plain-English relevance lines for the GP homepage only — two matched lines each */
export const HOMEPAGE_RESEARCHER_RELEVANCE: Record<string, readonly [string, string]> = {
  foster: [
    'Wrote the book on when to take medication.',
    '*Life Time*, Chapter 10. Oxford, 2022.',
  ],
  manfredini: [
    'His trials show when you take',
    'blood pressure pills changes heart outcomes.',
  ],
  pigazzani: [
    'Proved live timing beats a',
    'one-off sleep questionnaire.',
  ],
  levi: [
    'Showed timed care at home works.',
    'DIOS brings that to GP care.',
  ],
  roenneberg: [
    'Defined natural sleep timing.',
    'DIOS tracks it from the wrist.',
  ],
  hermida: [
    'Found bedtime blood pressure pills',
    'can cut stroke risk.',
  ],
  smolensky: [
    'Mapped why arthritis and steroid',
    'pills work better at night.',
  ],
  cajochen: [
    'Named the gap between published',
    'science and what GPs actually do.',
  ],
}

export const RESEARCHERS_INTRO =
  'Chronodosing is not a startup idea. It is the conclusion of decades of work by some of the world\'s leading circadian scientists. DIOS is the clinical tool they argued should exist.'
