import { SECOPUTIC_PILOT_PATH } from '@/lib/secopeutic/site'

export const SECOPEUTIC_CLINICS_PAGE = {
  eyebrow: 'Clinic directory',
  headline: 'Find colleagues running high-dose D3.',
  support:
    'Secopeutic certified practices opt in and run on our safety ledger. UK directory listings are verified references to start.',
  verifiedTitle: 'Secopeutic certified practices',
  verifiedSupport: 'Opt-in only. PTH and sleep signals on one timeline.',
  verifiedEmpty: 'No UK certified listings yet. Pilot practices join here first.',
  directoryTitle: 'UK high-dose D3 directory',
  directorySupport: 'Injection pathways with medical oversight. Not full PTH-protocol certification.',
  optInTitle: 'List your practice',
  optInSupport: 'Run three patients on Secopeutic free for six months.',
  optInCta: { label: 'Claim free pilot', href: SECOPUTIC_PILOT_PATH },
} as const

export const SECOPEUTIC_CLINIC_PATHWAY_LABELS = {
  injection: {
    label: 'High-dose injection',
    detail: 'IM bolus pathway for deficiency correction.',
  },
  'pth-led': {
    label: 'PTH-led protocol',
    detail: 'Daily dosing titrated to PTH floor.',
  },
  'sleep-led': {
    label: 'Sleep-led practice',
    detail: 'Timing gates between lab panels.',
  },
} as const
