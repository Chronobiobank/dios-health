'use client'

import Link from 'next/link'

import { vitaminD3NmolToNgMl } from '@/lib/retinomic/photic-dose'
import type { RetinomicTier } from '@/lib/retinomic/types'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type MetabolicDosePanelProps = {
  tier: RetinomicTier
  vitaminD3NmolL: number | null
  vitaminB5UmolL: number | null
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function MetabolicDosePanel({ tier, vitaminD3NmolL, vitaminB5UmolL }: MetabolicDosePanelProps) {
  const isLocked = tier === 'FREE_SCREENING'
  const d3Ng = vitaminD3NmolL != null ? vitaminD3NmolToNgMl(vitaminD3NmolL) : null
  const d3Display = d3Ng != null ? `${d3Ng}` : '—'
  const b5Display = vitaminB5UmolL != null ? `${vitaminB5UmolL}` : '—'

  return (
    <section
      className="dios-glass-outer retinomic-panel retinomic-panel--metabolic"
      aria-labelledby="metabolic-panel-title"
    >
      <p id="metabolic-panel-title" className="retinomic-panel__label">
        Blood fuel
      </p>
      <div className={isLocked ? 'premium-locked' : 'relative'}>
        <div className="premium-locked__content">
          <div className="retinomic-metric-row">
            <div className="dios-glass-inner retinomic-metric">
              <p className="retinomic-metric__name">Vitamin D3</p>
              <p className="retinomic-metric__value">
                {d3Display}
                <span className="dash-sub text-sm font-normal"> ng/mL</span>
              </p>
              <p className="retinomic-metric__target">Target 60–80 ng/mL</p>
            </div>
            <div className="dios-glass-inner retinomic-metric">
              <p className="retinomic-metric__name">Vitamin B5</p>
              <p className="retinomic-metric__value">
                {b5Display}
                <span className="dash-sub text-sm font-normal"> μmol/L</span>
              </p>
              <p className="retinomic-metric__target">Pantothenate coenzyme pool</p>
            </div>
          </div>
        </div>
        {isLocked ? (
          <div className="premium-locked__overlay premium-locked__glass retinomic-locked-overlay">
            <LockIcon />
            <Link href={PATIENT_ROUTES.streamsBloods} className="dios-btn-on-light">
              Unlock quarterly labs
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
