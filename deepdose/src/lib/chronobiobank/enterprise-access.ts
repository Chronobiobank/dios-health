import type { SupabaseClient } from '@supabase/supabase-js'

export type DataLicense = {
  id: string
  org_id: string | null
  license_type: 'icb_population' | 'pharma_rd' | 'academic' | null
  cohort_filter: unknown
  purpose_codes: string[] | null
  start_date: string
  end_date: string | null
  annual_fee_gbp: number | null
  status: 'active' | 'expired' | 'suspended'
  created_at: string
}

export type EnterpriseOrg = {
  id: string
  name: string
  org_type: string
}

export type EnterpriseContext = {
  userId: string
  orgs: EnterpriseOrg[]
  licenses: DataLicense[]
  hasActiveLicense: boolean
}

function isLicenseActive(license: DataLicense): boolean {
  if (license.status !== 'active') return false
  if (license.end_date && new Date(license.end_date) <= new Date()) return false
  return true
}

/**
 * Resolve the enterprise context for the current user: their organisations and
 * any data licenses. Returns null for non-enterprise tiers (caller redirects).
 */
export async function resolveEnterpriseContext(
  supabase: SupabaseClient,
  userId: string
): Promise<EnterpriseContext | null> {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier')
    .eq('id', userId)
    .maybeSingle()

  if (!profile || profile.tier !== 'enterprise') {
    return null
  }

  const { data: memberships } = await supabase
    .from('org_members')
    .select('org_id, organisations(id, name, org_type)')
    .eq('user_id', userId)

  const orgs: EnterpriseOrg[] = []
  const orgIds: string[] = []
  for (const row of memberships ?? []) {
    const rel = (row as { organisations: EnterpriseOrg | EnterpriseOrg[] | null }).organisations
    const org = Array.isArray(rel) ? rel[0] : rel
    if (org && !orgIds.includes(org.id)) {
      orgs.push(org)
      orgIds.push(org.id)
    }
  }

  let licenses: DataLicense[] = []
  if (orgIds.length > 0) {
    const { data: licenseRows } = await supabase
      .from('data_licenses')
      .select(
        'id, org_id, license_type, cohort_filter, purpose_codes, start_date, end_date, annual_fee_gbp, status, created_at'
      )
      .in('org_id', orgIds)
      .order('created_at', { ascending: false })
    licenses = (licenseRows ?? []) as DataLicense[]
  }

  return {
    userId,
    orgs,
    licenses,
    hasActiveLicense: licenses.some(isLicenseActive),
  }
}

export function activeLicenses(context: EnterpriseContext): DataLicense[] {
  return context.licenses.filter(isLicenseActive)
}
