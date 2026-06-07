import type { DiagnosticTier } from '@/lib/types/diagnostic-tiers'

const L1_ELIGIBLE_CLUSTERS = [
  'vd-core',
  'sleep',
  'autoimmune',
  'cardiovascular',
  'metabolic',
] as const

export function shouldPromptTierUpgrade(patient: {
  country_code: string
  current_tier: DiagnosticTier
  days_on_current_tier: number
  cluster_id: string
}): { should_prompt: boolean; target_tier: DiagnosticTier | null; message: string } {
  if (patient.current_tier === 'L3' && patient.days_on_current_tier >= 14) {
    return {
      should_prompt: true,
      target_tier: 'L2',
      message:
        'A simple blood test through your GP would make your timing windows significantly more accurate. I can tell you exactly which tests to ask for.',
    }
  }

  if (
    patient.current_tier === 'L2' &&
    patient.days_on_current_tier >= 30 &&
    patient.country_code === 'GB' &&
    L1_ELIGIBLE_CLUSTERS.includes(patient.cluster_id as (typeof L1_ELIGIBLE_CLUSTERS)[number])
  ) {
    return {
      should_prompt: true,
      target_tier: 'L1',
      message:
        'Your timing windows currently have a 60-minute uncertainty range. A TipTraQ sensor would bring that down to 18 minutes — making every recommendation significantly more precise.',
    }
  }

  return { should_prompt: false, target_tier: null, message: '' }
}
