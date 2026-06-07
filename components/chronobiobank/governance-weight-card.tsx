import { calculateGovernanceWeight } from '@/lib/chronobiobank/governance-weight'
import type { GovernanceContributions } from '@/lib/chronobiobank/types'

type GovernanceWeightCardProps = {
  contributions: GovernanceContributions
}

export function GovernanceWeightCard({ contributions }: GovernanceWeightCardProps) {
  const weight = calculateGovernanceWeight(contributions)

  return (
    <div className="chronobiobank-governance-card dios-glass-inner rounded-2xl p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
        Chronobiobank governance weight
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-black">{weight.totalWeight}</p>
      <p className="mt-1 text-sm text-black/65">{weight.votingLabel}</p>
      <dl className="mt-4 grid gap-2 text-xs text-black/55">
        <div className="flex justify-between gap-3">
          <dt>DINA dose confirmation days</dt>
          <dd className="font-mono">{contributions.firstLightScanDays} · {weight.basePoints} pts</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>City Labs verified panel</dt>
          <dd className="font-mono">×{weight.cityLabsMultiplier}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>TipTraQ blocks completed</dt>
          <dd className="font-mono">
            {contributions.tiptraqNightsContributed} · ×{weight.tiptraqMultiplier}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-relaxed text-black/45">
        Voting weight on data access proposals — proportional to data fidelity, not payment.
      </p>
    </div>
  )
}
