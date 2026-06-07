import { PrgcMonitoringTable } from '@/components/clinic/prgc-monitoring-table'
import { TipTraqPractitionerBanner } from '@/components/clinic/tiptraq-practitioner-banner'
import { DASHBOARD_HEADLINE } from '@/components/dashboard/dashboard-styles'
import { PRGC_MONITORING_PATIENTS } from '@/lib/clinic/prgc-monitoring'
import { PRGC_CADENCE_LINE } from '@/lib/product/intelligence-cadence'

export function PrgcMonitoringDemo() {
  return (
    <div className="clinical-layout min-h-screen bg-white px-5 py-10 text-[#0D0D0D] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-ui-label uppercase tracking-widest text-black/45">
          Coimbra / Gominak monitoring
        </p>
        <h1 className={`${DASHBOARD_HEADLINE} mt-3`}>Is the pRGC system working?</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/70">
          Four numbers per patient. {PRGC_CADENCE_LINE} Everything else is downstream.
        </p>

        <PrgcMonitoringTable patients={PRGC_MONITORING_PATIENTS} />
        <TipTraqPractitionerBanner />
      </div>
    </div>
  )
}
