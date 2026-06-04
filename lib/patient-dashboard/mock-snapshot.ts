import type { PatientDashboardProps, PatientSnapshot } from '@/lib/patient-dashboard/types'
import { formatCompletenessValue, formatOpenGapsLabel } from '@/lib/patient-dashboard/tile-copy'
import { DEFAULT_DASHBOARD_AVATAR } from '@/components/patient-dashboard/constants'
import { getPatientDashboardGreeting } from '@/lib/auth/greeting'

/** Static demo data for local design preview — matches reference dashboard numbers. */
export const MOCK_PATIENT_SNAPSHOT: PatientSnapshot = {
  chronologicalAge: 61,
  circadianAge: 64,
  yearsLost: 3.2,
  recoveryYears: 2.4,
  socialJetlag: 1.4,
  syncScore: 74,
  phaseDrift: 44,
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
    socialJetlagHours: 1.4,
    lastStudyDate: '2026-01-12',
  },
  measureTiles: [
    {
      id: 'sleep',
      value: '44 min',
      label: 'Bedtime was late',
      subtitle: 'You fell asleep 44 minutes later than your body clock expected',
      badge: 'Watch',
      badgeTone: 'watch',
      source: 'Smartphone stream',
      panelRows: [
        { key: 'Expected sleep onset', value: 'Based on DLMO estimate' },
        { key: 'Observed delay', value: '44 min' },
        { key: 'Social jetlag', value: '1.4h' },
      ],
      panelActions: [
        { label: 'Ask DIOS about sleep timing', opensCoach: true },
        { label: 'What shifts my clock?', prompt: 'What can I do tonight to shift my body clock earlier?' },
      ],
    },
    {
      id: 'vitd',
      value: 'Too low',
      label: 'Vitamin D not working',
      subtitle: 'Your body has vitamin D but is not absorbing it properly right now',
      badge: 'Act now',
      badgeTone: 'act',
      source: 'Blood panel',
      panelRows: [
        { key: 'Vitamin D', value: '42 nmol/L' },
        { key: 'VDR flag', value: 'Unresolved' },
        { key: 'Collected', value: 'Jan 2026' },
      ],
      panelActions: [
        { label: 'Explain my vitamin D', prompt: 'Why is my vitamin D not working for my body clock?' },
        { label: 'Open DIOS Coach', opensCoach: true },
      ],
    },
    {
      id: 'tiptraq',
      value: 'Moderate',
      label: 'Sleep quality',
      subtitle: 'Your heart and sleep patterns show your clock is 1.4h behind',
      badge: 'Last study: Jan 2026',
      badgeTone: 'study',
      source: 'TipTraQ',
      panelRows: [
        { key: 'Quality', value: 'Moderate' },
        { key: 'Clock lag', value: '1.4h' },
        { key: 'Last study', value: 'Jan 2026' },
      ],
      panelActions: [{ label: 'Review sleep study', prompt: 'What did my latest TipTraQ night show?' }],
    },
    {
      id: 'completeness',
      value: formatCompletenessValue(1),
      label: 'Data completeness',
      subtitle: 'One unresolved issue is reducing how precise your personalised plan can be right now',
      badge: 'Action needed',
      badgeTone: 'action',
      source: 'DIOS layers',
      panelRows: [
        { key: formatOpenGapsLabel(1), value: '1' },
        { key: 'Sync score', value: '74' },
        { key: 'Priority', value: 'Connect missing streams' },
      ],
      panelActions: [{ label: 'What should I connect?', prompt: 'Which data streams should I connect?' }],
    },
  ],
  completenessGaps: 1,
  coachOnline: true,
}

export const MOCK_DASHBOARD_PROPS: PatientDashboardProps = {
  greeting: getPatientDashboardGreeting('Alex'),
  firstName: 'Alex',
  fullName: 'Alex Morgan',
  avatarUrl: DEFAULT_DASHBOARD_AVATAR,
  snapshot: MOCK_PATIENT_SNAPSHOT,
}
