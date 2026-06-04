import type { PatientDashboardProps, PatientSnapshot } from '@/lib/patient-dashboard/types'
import { formatCompletenessValue, formatOpenGapsLabel } from '@/lib/patient-dashboard/tile-copy'
import { DEFAULT_DASHBOARD_AVATAR } from '@/components/patient-dashboard/constants'
import { getPatientDashboardGreeting } from '@/lib/auth/greeting'

/** Static demo data for local design preview — matches reference dashboard numbers. */
export const MOCK_PATIENT_SNAPSHOT: PatientSnapshot = {
  chronologicalAge: 61,
  chronosomaticAge: 64,
  darkYears: 3.2,
  recoveryYears: 2.4,
  darkYearsHours: 1.4,
  lightAlignment: 74,
  clockDrift: 44,
  dlmoEstimate: '21:20',
  medications: [
    {
      name: 'Metformin',
      dose: '500 mg',
      time: '21:30',
      reason: 'Evening dose aligned to your DLMO window for better glycaemic control.',
      status: 'tonight',
      colour: 'var(--researcher-avatar-text)',
    },
    {
      name: 'Atorvastatin',
      dose: '20 mg',
      time: '21:45',
      reason: 'Night timing matches cholesterol synthesis rhythm in your chronotype.',
      status: 'tonight',
      colour: 'var(--color-brand)',
    },
  ],
  medicationsDueTonight: 2,
  bloodPanel: {
    vitaminDLabel: 'Too low',
    vitaminDValue: '42 nmol/L',
    vdrFlagUnresolved: true,
    collectedAt: '2026-01-15',
  },
  tiptraqSummary: {
    sleepOnsetDelayMinutes: 44,
    qualityLabel: 'Moderate',
    darkYearsHours: 1.4,
    lastStudyDate: '2026-01-12',
  },
  measureTiles: [
    {
      id: 'sleep',
      value: '44 min',
      label: 'Clock slipped last night',
      subtitle: 'You fell asleep 44 minutes later than your body clock expected',
      badge: 'Adding Dark Years',
      badgeTone: 'watch',
      source: 'Smartphone stream',
      panelRows: [
        { key: 'Your body clock target', value: 'Based on DLMO estimate' },
        { key: 'How far your clock slipped', value: '44 min' },
        { key: 'Dark Years added this week', value: '1.4h' },
      ],
      panelActions: [
        { label: 'How to recover ↗', prompt: 'How can I reduce my Dark Years and recover my clock tonight?' },
      ],
    },
    {
      id: 'vitd',
      value: 'Too low',
      label: 'Vitamin D not working',
      subtitle:
        'Your body has vitamin D but is not using it properly. This keeps your body clock genes suppressed — adding Dark Years even when you sleep well.',
      badge: 'Act now',
      badgeTone: 'act',
      source: 'Blood panel',
      panelRows: [
        { key: 'Vitamin D', value: '42 nmol/L' },
        { key: 'VDR flag', value: 'Unresolved' },
        { key: 'Dark Years contribution', value: '+0.8 Dark Years' },
      ],
      panelActions: [
        {
          label: 'Explain my vitamin D',
          prompt: 'Why is my vitamin D adding Dark Years to my Chronosomatic Age?',
        },
        {
          label: 'Show this to your GP — could recover 1.1 Dark Years in 90 days',
          prompt: 'What should I ask my GP about vitamin D and iron to reduce my Dark Years?',
        },
      ],
    },
    {
      id: 'tiptraq',
      value: 'Moderate',
      label: 'Sleep quality',
      subtitle:
        'You wore a TipTraQ sensor for 7 nights in May. It measured when your body clock thinks day and night are — the foundation of your Dark Years calculation.',
      badge: 'Last study: Jan 2026',
      badgeTone: 'study',
      source: 'TipTraQ',
      panelRows: [
        { key: 'Quality', value: 'Moderate' },
        { key: 'Clock drift this week', value: '1.4h' },
        { key: 'Last study', value: 'Jan 2026' },
      ],
      panelActions: [
        {
          label: 'Review sleep study',
          prompt: 'What did my latest TipTraQ night show about my Dark Years?',
        },
      ],
    },
    {
      id: 'completeness',
      value: formatCompletenessValue(2),
      label: 'Data completeness',
      subtitle:
        'Two gaps are reducing the precision of your Dark Years calculation and your medication timing plan.',
      badge: 'Action needed',
      badgeTone: 'action',
      source: 'DIOS layers',
      panelRows: [
        { key: formatOpenGapsLabel(2), value: '2' },
        { key: 'Light alignment', value: '74' },
        {
          key: 'Gap 1 — vitamin D',
          value: 'Ask your GP about a higher vitamin D dose and retest in 90 days — could recover 0.8 Dark Years',
        },
        {
          key: 'Gap 2 — iron',
          value: 'Ask your GP about an iron supplement at your next blood test — could recover 0.3 Dark Years',
        },
      ],
      panelActions: [{ label: 'Fix both gaps ↗', prompt: 'Which gaps should I fix first to reduce my Dark Years?' }],
    },
  ],
  completenessGaps: 2,
  coachOnline: true,
}

export const MOCK_DASHBOARD_PROPS: PatientDashboardProps = {
  greeting: getPatientDashboardGreeting('Alex'),
  firstName: 'Alex',
  fullName: 'Alex Morgan',
  avatarUrl: DEFAULT_DASHBOARD_AVATAR,
  snapshot: MOCK_PATIENT_SNAPSHOT,
}
