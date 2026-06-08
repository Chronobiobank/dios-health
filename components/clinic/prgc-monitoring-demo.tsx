import { PrgcMonitoringTable } from '@/components/clinic/prgc-monitoring-table'
import { TipTraqPractitionerBanner } from '@/components/clinic/tiptraq-practitioner-banner'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { PRGC_MONITORING_PATIENTS } from '@/lib/clinic/prgc-monitoring'
import { PRGC_CADENCE_LINE } from '@/lib/product/intelligence-cadence'
import { cn } from '@/lib/utils'

type PrgcMonitoringDemoProps = {
  /** Tab embed inside /clinicians/triage — shell provides page chrome */
  embedded?: boolean
}

export function PrgcMonitoringDemo({ embedded = false }: PrgcMonitoringDemoProps) {
  return (
    <div
      className={cn(
        embedded ? 'prgc-monitoring-demo prgc-monitoring-demo--embedded' : 'clinical-layout min-h-screen bg-white px-5 py-10 text-[#0D0D0D] sm:px-6'
      )}
    >
      <div className={cn(embedded ? 'prgc-monitoring-demo__inner' : 'mx-auto max-w-6xl')}>
        {!embedded ? (
          <>
            <p className="font-mono text-ui-label uppercase tracking-widest text-black/45">
              Coimbra / Gominak monitoring
            </p>
            <h1 className={`${DASHBOARD_HEADLINE} mt-3`}>Is the pRGC system working?</h1>
          </>
        ) : (
          <h2 className="prgc-monitoring-demo__title">Is the pRGC system working?</h2>
        )}
        <p className="prgc-monitoring-demo__lede">
          Four numbers per patient. {PRGC_CADENCE_LINE} Everything else is downstream.
        </p>

        <PrgcMonitoringTable patients={PRGC_MONITORING_PATIENTS} />
        <TipTraqPractitionerBanner />
      </div>
    </div>
  )
}
