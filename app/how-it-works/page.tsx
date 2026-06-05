import { RetinomicDashboardClient } from '@/components/retinomic/retinomic-dashboard-client'
import { MOCK_RETINOMIC_DASHBOARD } from '@/lib/retinomic/mock-dashboard-props'

export const dynamic = 'force-dynamic'

/** Public demo of the Retinomic tiered dashboard — linked from landing Dose Intelligence tile. */
export default function HowItWorksPage() {
  return (
    <>
      <p
        className="type-medical-dense mx-auto max-w-3xl px-4 pt-4 text-center text-xs text-white/50"
        role="status"
      >
        Public preview · sample Retinomic protocol data ·{' '}
        <a href="/auth/signup" className="text-photic-300 underline-offset-2 hover:underline">
          sign up
        </a>{' '}
        to connect your devices
      </p>
      <RetinomicDashboardClient {...MOCK_RETINOMIC_DASHBOARD} />
    </>
  )
}
