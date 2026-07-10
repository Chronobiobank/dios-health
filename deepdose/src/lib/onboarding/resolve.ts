import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
  hasCompletedRequiredConsents,
} from '@/lib/consent/dynamic-consent'

export const ONBOARDING_STEPS = ['Consent', 'Meds', 'Rhythm'] as const

export type OnboardingStepId = 'medications' | 'consent' | 'chronotype' | 'complete'

export const ONBOARDING_PATHS = {
  consent: '/patient/onboarding/consent',
  medications: '/patient/onboarding/medications',
  chronotype: '/patient/onboarding/chronotype',
  complete: '/connect',
} as const

export interface OnboardingStatus {
  medsCompleted: boolean
  consentCompleted: boolean
  chronotypeCompleted: boolean
}

export async function getOnboardingStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<OnboardingStatus> {
  const [{ data: profile }, { data: chronotype }, { framework }] = await Promise.all([
    supabase
      .from('patient_profiles')
      .select('onboarding_meds_completed_at')
      .eq('id', userId)
      .maybeSingle(),
    supabase.from('chronotype_profiles').select('id').eq('patient_id', userId).limit(1),
    getCurrentFramework(supabase),
  ])

  let consentCompleted = true
  if (framework) {
    const { purposes } = await getConsentPurposes(supabase, framework.id)
    const { consents } = await getPatientConsents(supabase, userId)
    consentCompleted = hasCompletedRequiredConsents(purposes, consents)
  }

  return {
    medsCompleted: Boolean(profile?.onboarding_meds_completed_at),
    consentCompleted,
    chronotypeCompleted: Boolean(chronotype?.length),
  }
}

export async function resolveOnboardingStep(
  supabase: SupabaseClient,
  userId: string
): Promise<OnboardingStepId> {
  const status = await getOnboardingStatus(supabase, userId)

  if (!status.consentCompleted) return 'consent'
  if (!status.medsCompleted) return 'medications'
  if (!status.chronotypeCompleted) return 'chronotype'
  return 'complete'
}

export function onboardingPathForStep(step: OnboardingStepId): string {
  return ONBOARDING_PATHS[step]
}

export function onboardingStepNumber(step: Exclude<OnboardingStepId, 'complete'>): 1 | 2 | 3 {
  switch (step) {
    case 'consent':
      return 1
    case 'medications':
      return 2
    case 'chronotype':
      return 3
  }
}
