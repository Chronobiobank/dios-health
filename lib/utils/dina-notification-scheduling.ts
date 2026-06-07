import { shouldPromptTierUpgrade } from '@/lib/utils/dina-upgrade-prompts'

export type DinaTierUpgradePrompt = ReturnType<typeof shouldPromptTierUpgrade>

/** DINA notification scheduling — tier upgrade prompts (L3→L2 at 14d, L2→L1 at 30d UK). */
export function scheduleDinaTierUpgradePrompt(
  patient: Parameters<typeof shouldPromptTierUpgrade>[0]
): DinaTierUpgradePrompt {
  return shouldPromptTierUpgrade(patient)
}
