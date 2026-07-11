'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { LandingRiskAnalysis } from '@/lib/patient/landing-risk-analysis'
import { persistGpHandoffSnapshot } from '@/lib/patient/gp-handoff-storage'
import { LANDING_GP_HANDOFF_COPY } from '@/lib/deepdose-marketing/landing-content'
import { cn } from '@/lib/utils/cn'

type LandingGpHandoffPanelProps = {
  analysis: LandingRiskAnalysis
  medNames: string[]
}

const RISK_CLASS: Record<LandingRiskAnalysis['sleepDisorderRisk'], string> = {
  low: 'sw-gp-handoff--low',
  watch: 'sw-gp-handoff--watch',
  elevated: 'sw-gp-handoff--elevated',
}

export function LandingGpHandoffPanel({ analysis, medNames }: LandingGpHandoffPanelProps) {
  const router = useRouter()

  function handleShareWithGp() {
    persistGpHandoffSnapshot({ ...analysis, medNames })
    router.push('/profile/gp-summary')
  }

  return (
    <article
      className={cn('dios-glass-outer sw-gp-handoff', RISK_CLASS[analysis.sleepDisorderRisk])}
      aria-labelledby="sw-gp-handoff-title"
    >
      <header className="sw-gp-handoff__head">
        <p className="sw-dash__eyebrow">{LANDING_GP_HANDOFF_COPY.eyebrow}</p>
        <h2 id="sw-gp-handoff-title" className="sw-gp-handoff__title">
          {analysis.sleepDisorderHeadline}
        </h2>
        <p className="sw-gp-handoff__detail">{analysis.sleepDisorderDetail}</p>
      </header>

      <ul className="sw-gp-handoff__bullets">
        {analysis.gpSummaryBullets.slice(0, 4).map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className="sw-gp-handoff__actions">
        {analysis.suggestGpReview ? (
          <button type="button" className="sw-dash__cta-btn" onClick={handleShareWithGp}>
            {LANDING_GP_HANDOFF_COPY.shareCta}
          </button>
        ) : null}

        <Link href="/testkit" className="sw-gp-handoff__secondary">
          {LANDING_GP_HANDOFF_COPY.tiptraqCta}
        </Link>

        {!analysis.suggestGpReview ? (
          <button type="button" className="sw-gp-handoff__secondary" onClick={handleShareWithGp}>
            {LANDING_GP_HANDOFF_COPY.shareOptionalCta}
          </button>
        ) : null}
      </div>

      <p className="sw-gp-handoff__disclaimer">{LANDING_GP_HANDOFF_COPY.disclaimer}</p>
    </article>
  )
}
