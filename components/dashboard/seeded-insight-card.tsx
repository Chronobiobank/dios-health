import Link from 'next/link'

import { InsightCard, InsightCardLink } from '@/components/dashboard/insight-card'
import type { SeededInsight } from '@/lib/auth/chronotype-insight'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type SeededInsightCardProps = {
  insight: SeededInsight
}

export function SeededInsightCard({ insight }: SeededInsightCardProps) {
  return (
    <InsightCard
      headline={insight.headline}
      body={insight.body}
      standardGuidance={insight.standardGuidance}
      diosRecommendation={insight.diosRecommendation}
      cta={
        <InsightCardLink href={PATIENT_ROUTES.insights}>
          See what this means for your doses →
        </InsightCardLink>
      }
      footer={
        <>
          Connect TipTraQ to get a precise reading, not an estimate.{' '}
          <Link href={PATIENT_ROUTES.streams} className="text-black/60 underline-offset-2 hover:text-black hover:underline">
            Connect now →
          </Link>
        </>
      }
    />
  )
}
