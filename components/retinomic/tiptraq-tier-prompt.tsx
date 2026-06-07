'use client'

import { useMemo } from 'react'

import { DIAGNOSTIC_TIERS, getTierLabel } from '@/lib/types/diagnostic-tiers'
import { getMaxTier, isTipTraQAvailable } from '@/lib/utils/tiptraq-availability'

type TipTraQTierPromptProps = {
  countryCode?: string
  className?: string
}

export function TipTraQTierPrompt({ countryCode = 'GB', className }: TipTraQTierPromptProps) {
  const tipTraqAvailable = useMemo(() => isTipTraQAvailable(countryCode), [countryCode])
  const maxTier = useMemo(() => getMaxTier(countryCode), [countryCode])

  const l2 = DIAGNOSTIC_TIERS.L2
  const l1 = DIAGNOSTIC_TIERS.L1

  return (
    <div className={className}>
      <p className="font-mono text-ui-label uppercase tracking-widest text-black/45">
        Diagnostic tier · {getTierLabel('L3')} today
      </p>
      <p className="mt-2 font-ui text-ui-sm leading-relaxed text-[var(--text-secondary)]">
        {l2.description}
      </p>
      {tipTraqAvailable ? (
        <div className="mt-4 rounded-lg border border-teal-light bg-teal-light px-3 py-3">
          <p className="font-ui text-ui-sm font-medium text-teal-dark">
            UK patients — upgrade to {l1.name}
          </p>
          <p className="mt-1 font-ui text-ui-sm text-black/70">
            {l1.description} Maximum tier: {getTierLabel(maxTier)}.
          </p>
        </div>
      ) : (
        <p className="mt-4 font-ui text-ui-sm text-black/55">
          TipTraQ is available in the UK through DIOS only. Your highest tier outside the UK is{' '}
          {getTierLabel('L2')} ({l2.device}).
        </p>
      )}
    </div>
  )
}
