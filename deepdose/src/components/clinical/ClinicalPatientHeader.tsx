import Link from 'next/link'
import type { ClinicalPatientHeader as HeaderData } from '@/lib/clinical/patient-chart'
import { formatDateTime24 } from '@/lib/utils/time'
import { Badge } from '@/components/ui/Layout'

export function ClinicalPatientHeader({ header }: { header: HeaderData }) {
  return (
    <header className="seco-landing__copy-stack dash-meds__page-head">
      <Link href="/clinical/dashboard" className="clinical-record-back text-accent">
        ← Triage
      </Link>
      <p className="seco-page__eyebrow">Patient record</p>
      <div className="clinical-record-title-row">
        <h1 className="seco-page__title dash-meds__page-title">{header.displayName}</h1>
        {header.isPremiumTier && (
          <span className="clinical-record-badge" title="Verified Clinical-Grade Data via TipTraQ">
            🛡️ Verified Clinical-Grade Data via TipTraQ
          </span>
        )}
        {header.deviceAlertTriggered && <Badge tone="warning">Device sync alert</Badge>}
      </div>
      {header.lastDeviceSyncAt && (
        <p className="clinical-record-meta text-ink-muted">
          Last device sync: {formatDateTime24(header.lastDeviceSyncAt)}
        </p>
      )}
    </header>
  )
}
