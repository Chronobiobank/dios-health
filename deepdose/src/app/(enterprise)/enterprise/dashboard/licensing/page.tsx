import { requireEnterprise } from '@/lib/chronobiobank/require-enterprise'
import { LicensingStatus, type AccessLogEntry } from '@/components/enterprise/LicensingStatus'

export const dynamic = 'force-dynamic'

export default async function EnterpriseLicensingPage() {
  const { supabase, context } = await requireEnterprise('/enterprise/dashboard/licensing')

  const licenseIds = context.licenses.map((l) => l.id)
  let accessLog: AccessLogEntry[] = []
  if (licenseIds.length > 0) {
    const { data } = await supabase
      .from('biobank_access_log')
      .select('id, query_hash, record_count, accessed_at')
      .in('license_id', licenseIds)
      .order('accessed_at', { ascending: false })
      .limit(50)
    accessLog = (data ?? []) as AccessLogEntry[]
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Chronobiobank</p>
        <h1 className="seco-app-section-title">Licensing &amp; audit</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your data licenses and the immutable record of every cohort query run against them.
        </p>
      </header>

      <LicensingStatus licenses={context.licenses} accessLog={accessLog} />
    </div>
  )
}
