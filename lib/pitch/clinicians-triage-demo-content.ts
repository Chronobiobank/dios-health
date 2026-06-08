export const CLINICIANS_TRIAGE_DEMO = {
  eyebrow: 'Clinician demo',
  headline: 'Queue first. Drill down second.',
  lede: 'The cohort queue sorts who needs attention this week. The pRGC table shows why — sleep, REM, PTH, and D3 timing read together.',
  bridge:
    'Same patients, two views. Red on the queue usually means a timing or blood mismatch in the four-column readout.',
  tabs: {
    queue: {
      id: 'queue' as const,
      label: 'Cohort queue',
      detail: 'Twelve patients — red, amber, green',
    },
    prgc: {
      id: 'prgc' as const,
      label: 'pRGC drill-down',
      detail: 'Four columns — is the protocol working?',
    },
  },
} as const

export type CliniciansTriageTabId = (typeof CLINICIANS_TRIAGE_DEMO.tabs)[keyof typeof CLINICIANS_TRIAGE_DEMO.tabs]['id']
