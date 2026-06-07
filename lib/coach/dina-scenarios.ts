/** DINA showcase scenarios — Sean James demo stack, plain-English copy rules. */

export type DinaScenarioAction = {
  label: string
  /** Real question sent to DINA when the button is pressed */
  question: string
}

export type DinaScenario = {
  id: 'morning-window' | 'conflict-caught' | 'missed-dose'
  title: string
  job: string
  patientLabel: string
  context: string
  /** Showcase response — max three sentences, no jargon, no exclamation marks */
  dinaResponse: string
  actions: readonly DinaScenarioAction[]
}

export const DINA_PAGE_INTRO = {
  eyebrow: 'DINA',
  title: 'A companion who knows your stack.',
  lead:
    'Three moments from Sean James\'s day — morning sequencing, a caught conflict, and a missed dose handled with nuance. Tap a scenario, then ask DINA yourself.',
} as const

export const SEAN_DINA_PATIENT = {
  name: 'Sean James',
  dlmo: '22:57',
  stack: 'Thyroid tablet · D3 · magnesium · statin · blood pressure tablet',
} as const

export const DINA_SCENARIOS: readonly DinaScenario[] = [
  {
    id: 'morning-window',
    title: 'Morning window',
    job: 'Shows what daily use looks like — sequencing without being asked.',
    patientLabel: SEAN_DINA_PATIENT.name,
    context: `DLMO ${SEAN_DINA_PATIENT.dlmo}. Morning stack: thyroid tablet, D3, evening magnesium already moved.`,
    dinaResponse:
      'Good morning Sean. Your window opens at 7:15 — take your thyroid tablet first, then your D3 thirty minutes later before food. I have magnesium at 9pm tonight so it does not compete with your morning tablets.',
    actions: [
      {
        label: 'Why thyroid before D3?',
        question: 'Why do I take my thyroid tablet before my D3?',
      },
      {
        label: 'Can I take magnesium now?',
        question: 'Can I take my magnesium this morning instead of tonight?',
      },
      {
        label: "What is today's window?",
        question: 'What is my medication window this morning?',
      },
    ],
  },
  {
    id: 'conflict-caught',
    title: 'Conflict caught',
    job: 'Shows DINA protecting you — a real interaction caught in plain language.',
    patientLabel: SEAN_DINA_PATIENT.name,
    context: 'Bone tablet and calcium were both due within the same hour.',
    dinaResponse:
      'Sean, do not take calcium within two hours of your bone tablet — they compete in the gut and can cut absorption by up to 60%. Take calcium at lunch instead. It is in the prescribing guidance but rarely explained to patients.',
    actions: [
      {
        label: 'Why not together?',
        question: 'Why can I not take my bone tablet and calcium at the same time?',
      },
      {
        label: 'What should I do instead?',
        question: 'When should I take calcium if I already took my bone tablet?',
      },
      {
        label: 'How serious is this?',
        question: 'How serious is taking calcium too close to my bone tablet?',
      },
    ],
  },
  {
    id: 'missed-dose',
    title: 'Missed dose',
    job: 'Shows timing intelligence — not a generic reminder app.',
    patientLabel: SEAN_DINA_PATIENT.name,
    context: 'Sean missed his statin last night. It is now mid-morning.',
    dinaResponse:
      'Skip your statin today — last night\'s window closed and your liver is past its peak synthesis time. Resume tonight at 9:45. Your blood pressure tablet is different — take that one now because its job is overnight dipping, not liver timing.',
    actions: [
      {
        label: 'Why skip statin but not BP tablet?',
        question:
          'I missed my statin last night — why skip it today but still take my blood pressure tablet?',
      },
      {
        label: 'What if I take the statin now?',
        question: 'What happens if I take my missed statin this morning anyway?',
      },
      {
        label: "When is tonight's window?",
        question: 'When does my statin window open tonight?',
      },
    ],
  },
] as const
