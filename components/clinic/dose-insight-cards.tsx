import { InsightCard, InsightCardLink } from '@/components/dashboard/insight-card'
import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { DemoPatientInsight } from '@/lib/clinic/demo-patient-twin'
import { CLINIC_ROUTES } from '@/lib/auth/routes'

type DoseInsightCardsProps = {
  patientId: string
  insights: DemoPatientInsight[]
}

export function DoseInsightCards({ patientId, insights }: DoseInsightCardsProps) {
  return (
    <section className="mt-8">
      <h2 className={SECTION_LABEL}>Dose insights</h2>

      <ul className="mt-4 space-y-4">
        {insights.map((insight) => (
          <li key={`${insight.drugName}-${insight.headline}`}>
            <InsightCard
              eyebrow={insight.drugName}
              badge={insight.confidenceScore !== null ? `${insight.confidenceScore}%` : 'PENDING'}
              headline={insight.headline}
              body={insight.body}
              standardGuidance={insight.standardGuidance}
              diosRecommendation={insight.diosRecommendation}
              cta={
                <InsightCardLink href={CLINIC_ROUTES.consult(patientId)}>
                  Generate patient instruction →
                </InsightCardLink>
              }
              footer={
                insight.confidenceScore !== null
                  ? `Confidence score · ${insight.confidenceScore}%`
                  : 'Confidence score · Pending'
              }
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
