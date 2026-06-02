/** Narrative content for /evidence — circadian model foundation */

export type IneffectiveMedRow = {
  name: string
  ukRank?: string
  globalNote?: string
  whyTimingFails: string
  chronotherapySignal: string
}

export const CIRCADIAN_MODEL_HERO = {
  eyebrow: 'Our circadian model',
  title: 'Medicines work on a clock. Most prescribing ignores it.',
  lead: 'DIOS maps each patient’s body-clock phase, then aligns dose timing to physiology — not population averages. That is how we recover efficacy and cut avoidable waste.',
} as const

/** Policy & waste framing — “drugs don’t work” at default population timing */
export const DRUGS_DONT_WORK_SECTION = {
  id: 'drugs-dont-work',
  eyebrow: 'The drugs don’t work',
  title: 'At the wrong time, even the right prescription underperforms.',
  intro: `Across the UK and globally, billions are spent on medicines that patients take at convenient but biologically wrong times. The problem is rarely the molecule alone — it is mismatch between dose timing and each person’s circadian phase.`,
  report: {
    title: 'National overprescribing review',
    subtitle: 'Good for you, good for us, good for everybody',
    body: `England’s national overprescribing review estimated that at least 10% of primary-care prescription items may not need to have been issued — medicines patients do not need, want, or that cause more harm than benefit. That waste sits alongside a separate, larger story: medicines that are appropriate but taken at the wrong clock phase, so they never reach full effect.`,
    href: 'https://www.england.nhs.uk/publication/good-for-you-good-for-us-good-for-everybody/',
    hrefLabel: 'NHS England — overprescribing review (2021)',
  },
  waste: {
    ukHeadline: '£300M+',
    ukLine:
      'NHS England attributes over £300 million per year to medicines waste linked to poor adherence, unused stock, and medicines not taken as intended — timing is a core part of “as intended”.',
    ukHref:
      'https://www.england.nhs.uk/wp-content/uploads/2015/06/pharmaceutical-waste-reduction.pdf',
    ukHrefLabel: 'NHS pharmaceutical waste reduction',
    globalLine:
      'WHO and health-system analyses worldwide describe the same pattern: high spend, uneven outcomes, and optimisation gaps where chronotherapy is rarely operationalised in routine care.',
  },
} as const

/** UK: highest-volume primary-care medicines where timing materially affects outcomes */
export const UK_INEFFECTIVE_TIMING_MEDS: readonly IneffectiveMedRow[] = [
  {
    name: 'Antihypertensives (amlodipine, ramipril, losartan)',
    ukRank: 'Top prescribed class in England',
    whyTimingFails:
      'Bedtime vs morning dosing changes cardiovascular event rates; population “once daily in the morning” misses non-dippers and chronotype.',
    chronotherapySignal: 'Hygia / TIME chronotype sub-study; Hermida bedtime dosing trials',
  },
  {
    name: 'Statins (atorvastatin, simvastatin)',
    ukRank: 'Among highest individual items nationally',
    whyTimingFails:
      'HMG-CoA reductase follows a circadian rhythm; evening dosing often outperforms morning for lipid control.',
    chronotherapySignal: 'Wallace et al. BMJ 2003 — evening simvastatin',
  },
  {
    name: 'Metformin',
    ukRank: 'Core type 2 diabetes therapy',
    whyTimingFails:
      'Hepatic glucose output and insulin sensitivity are clock-gated; fixed meal-time dosing ignores personal phase.',
    chronotherapySignal: 'Circadian glucose physiology; DIOS glucose node on spectrum',
  },
  {
    name: 'Levothyroxine',
    ukRank: 'Very high volume thyroid replacement',
    whyTimingFails:
      'Absorption and TSH rhythm are time-sensitive; fasting morning rules are population norms, not personal clock alignment.',
    chronotherapySignal: 'Morning fasting standard vs delayed sleep-phase patients',
  },
  {
    name: 'Proton pump inhibitors (omeprazole, lansoprazole)',
    ukRank: 'Top gastroenterology prescriptions',
    whyTimingFails:
      'Nocturnal acid breakthrough peaks before waking; once-daily morning dosing can miss the circadian acid peak.',
    chronotherapySignal: 'Evening/bedtime PPI protocols in GERD chronotherapy literature',
  },
  {
    name: 'Inhaled corticosteroids / LABAs (e.g. salmeterol)',
    ukRank: 'High respiratory volume',
    whyTimingFails:
      'Airway inflammation and bronchoconstriction peak at night; morning-only regimens under-treat nocturnal symptoms.',
    chronotherapySignal: 'Chronotherapy of asthma — evening steroid dosing',
  },
  {
    name: 'SSRIs (sertraline, fluoxetine)',
    ukRank: 'Major mental-health volume',
    whyTimingFails:
      'Alertness, sleep, and receptor sensitivity cycle; morning vs evening choice affects tolerability and adherence.',
    chronotherapySignal: 'Chronotype-informed antidepressant timing studies',
  },
  {
    name: 'Prednisolone / corticosteroids',
    ukRank: 'Widespread immunology & respiratory use',
    whyTimingFails:
      'Cortisol rhythm peaks pre-wake; fixed morning packs ignore inflammatory night peaks in many conditions.',
    chronotherapySignal: 'Smolensky chronotherapy framework — pre-dawn inflammatory peak',
  },
] as const

/** Global: same classes dominate spend where timing evidence exists but guidelines stay generic */
export const GLOBAL_INEFFECTIVE_TIMING_MEDS: readonly IneffectiveMedRow[] = [
  {
    name: 'Antihypertensives',
    globalNote: 'Leading cause-specific drug spend globally',
    whyTimingFails: 'International guidelines rarely specify chronotype-adjusted windows.',
    chronotherapySignal: '56% of reviewed drug classes show time-of-day effect (Amiama-Roig 2022)',
  },
  {
    name: 'Statins',
    globalNote: 'Lipid-lowering backbone in US, EU, and LMIC systems',
    whyTimingFails: 'Evening superiority established for several agents but not deployed at scale.',
    chronotherapySignal: 'Dallmann & Lévi — circadian regulation of pharmacotherapy',
  },
  {
    name: 'Oral hypoglycaemics & insulin',
    globalNote: 'Diabetes epidemic driving formulary growth',
    whyTimingFails: 'Meal-linked dosing ignores hepatic clock and sleep timing.',
    chronotherapySignal: 'CLOCK/BMAL1 glucose output — spectrum node',
  },
  {
    name: 'Anticoagulants & antiplatelets',
    globalNote: 'Cardiovascular prevention worldwide',
    whyTimingFails: 'Thrombotic risk is circadian; fixed morning rituals miss peak-risk windows.',
    chronotherapySignal: 'Evening aspirin timing trials in vascular prevention',
  },
  {
    name: 'Bronchodilators & inhaled steroids',
    globalNote: 'Asthma/COPD global burden',
    whyTimingFails: 'Night symptoms drive admissions; day-time prescribing norms persist.',
    chronotherapySignal: 'NIH chronotherapy summaries for asthma',
  },
  {
    name: 'Proton pump inhibitors',
    globalNote: 'High-volume ambulatory care globally',
    whyTimingFails: 'Acid secretion rhythm not aligned to patient sleep phase.',
    chronotherapySignal: 'Bedtime dosing improves nocturnal control in selected cohorts',
  },
] as const

export const PERSONALISATION_PAYOFF = {
  eyebrow: 'Personalise to body clocks',
  title: 'Same drug. Different clock. Different outcome.',
  bullets: [
    'MSFsc / MLux phase from smartphone and wearables replaces questionnaire-only chronotype.',
    'Seven-node circadian spectrum scores where drift is breaking down before disease labels.',
    'Per-medication windows (e.g. statins, antihypertensives, steroids) anchored to phase — not “8am for everyone”.',
    'Documented timing guidance patients can follow; clinicians review before any change to prescribed medicines.',
  ],
  savings: {
    title: 'Efficacy and money move together',
    body: 'When timing aligns with physiology, patients need fewer escalations, switches, and wasted packs. NHS medicines waste and overprescribing reviews both point to the same lever DIOS targets: take fewer wrong doses, and make the right doses work at the right time.',
  },
  citations: [
    {
      label: 'Foster — Life Time, Ch.10 “When to Take Drugs”',
      href: 'https://www.penguin.co.uk/books/439028/life-time-by-russell-foster/9780241529232',
    },
    {
      label: 'Amiama-Roig — timing of commonly prescribed medicines (2022)',
      href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4932476/',
    },
    {
      label: 'Pigazzani et al. — TIME chronotype sub-study (2024)',
      href: 'https://doi.org/10.1016/j.eclinm.2024.102633',
    },
  ],
} as const
