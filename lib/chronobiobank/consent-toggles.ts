import type { ChronobiobankConsentDimension, ChronobiobankConsentState } from '@/lib/chronobiobank/types'

export const CHRONOBIOBANK_CONSENT_TOGGLES: {
  dimension: ChronobiobankConsentDimension
  key: keyof Pick<
    ChronobiobankConsentState,
    'academicResearch' | 'pharmaDiscovery' | 'aiTraining' | 'openSourceChallenges'
  >
  column: string
  label: string
  description: string
}[] = [
  {
    dimension: 'academic_research',
    key: 'academicResearch',
    column: 'consent_academic_research',
    label: 'Academic non-profit research',
    description:
      'Allow anonymised cohort data for university and non-profit circadian research. Revocable at any time.',
  },
  {
    dimension: 'pharma_discovery',
    key: 'pharmaDiscovery',
    column: 'consent_pharma_discovery',
    label: 'Pharmaceutical discovery',
    description:
      'Allow verified cohort queries for drug discovery. Community veto applies before any access (Phase 3).',
  },
  {
    dimension: 'ai_training',
    key: 'aiTraining',
    column: 'consent_ai_training',
    label: 'Independent AI model training',
    description:
      'Allow de-identified data for independent AI models that advance circadian medicine. Not sold to ad networks.',
  },
  {
    dimension: 'open_source_challenges',
    key: 'openSourceChallenges',
    column: 'consent_open_source_challenges',
    label: 'Open source data challenges',
    description:
      'Allow your anonymised contribution to open science hackathons and reproducibility challenges.',
  },
]

export function consentStateFromRow(row: {
  consent_academic_research?: boolean | null
  consent_pharma_discovery?: boolean | null
  consent_ai_training?: boolean | null
  consent_open_source_challenges?: boolean | null
  consent_version?: string | null
  updated_at?: string | null
} | null): ChronobiobankConsentState {
  return {
    academicResearch: row?.consent_academic_research ?? false,
    pharmaDiscovery: row?.consent_pharma_discovery ?? false,
    aiTraining: row?.consent_ai_training ?? false,
    openSourceChallenges: row?.consent_open_source_challenges ?? false,
    consentVersion: row?.consent_version ?? 'v1.0',
    updatedAt: row?.updated_at ?? new Date().toISOString(),
  }
}

export const SEAN_JAMES_CHRONOBIOBANK_CONSENT: ChronobiobankConsentState = {
  academicResearch: true,
  pharmaDiscovery: false,
  aiTraining: true,
  openSourceChallenges: true,
  consentVersion: 'v2.0',
  updatedAt: '2026-06-01T08:00:00.000Z',
}
