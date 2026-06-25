'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { buildMedicationRecommendation, searchMedicationCatalog } from '@/lib/medications/catalog'
import { buildPatientLandingPath } from '@/lib/medications/home-to-onboarding'
import {
  CALLOUT_CLASS,
  RISK_RANK,
  VERDICT_LABEL,
  getPolyMedMeta,
  type RiskLevel,
} from '@/lib/medications/polypharmacy-timing'

interface RiskResultProps {
  medCodes: string[]
  wake: string
}

export function RiskResult({ medCodes, wake }: RiskResultProps) {
  const meds = useMemo(() =>
    medCodes.map(code => {
      const results = searchMedicationCatalog(code, { limit: 1 })
      const rec = results.length ? buildMedicationRecommendation(results[0], 0) : null
      const meta = getPolyMedMeta(code)
      const name = rec?.displayName ?? (code.charAt(0).toUpperCase() + code.slice(1))
      return { code, name, meta }
    }),
  [medCodes])

  const worstRisk = meds.reduce<RiskLevel>((worst, m) =>
    RISK_RANK[m.meta.risk] > RISK_RANK[worst] ? m.meta.risk : worst,
  'low')

  const sorted = [...meds].sort((a, b) => RISK_RANK[b.meta.risk] - RISK_RANK[a.meta.risk])

  const landingHref = buildPatientLandingPath({ medCodes, wake })

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CALLOUT_CLASS[worstRisk]} inline-flex rounded-full px-5 py-3 font-medium`}>
        {VERDICT_LABEL[worstRisk]}
      </div>

      <ul className="flex flex-col gap-3 list-none p-0 m-0">
        {sorted.map(({ code, name, meta }) => (
          <li key={code} className="dios-card overflow-hidden p-0">
            <details>
              <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none hover:bg-surface-muted transition-colors">
                <span className="text-sm font-medium text-ink">{name}</span>
                <span className="shrink-0 text-xs text-ink-faint ml-auto" aria-hidden>+</span>
              </summary>
              <div className="border-t border-border px-5 py-4 bg-surface-muted space-y-3">
                <p className="text-sm font-medium text-ink leading-snug">{meta.instruction}</p>
                {meta.evidence && (
                  <p className="text-sm text-ink-muted leading-relaxed">{meta.evidence}</p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>

      <Link href={landingHref} className="dios-btn-primary w-full justify-center">
        See your timing plan →
      </Link>
    </div>
  )
}
