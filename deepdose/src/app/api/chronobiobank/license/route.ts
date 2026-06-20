import { createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { resolveEnterpriseContext, activeLicenses } from '@/lib/chronobiobank/enterprise-access'
import {
  fetchChronobiobankRecords,
  computeAggregates,
  logBiobankAccess,
  type CohortFilter,
} from '@/lib/chronobiobank/records'

const MIN_COHORT_SIZE = 5 // suppress small-cell counts to protect re-identification

function parseFilter(body: unknown): CohortFilter {
  const b = (body ?? {}) as Record<string, unknown>
  const arr = (v: unknown): string[] | undefined =>
    Array.isArray(v) && v.length ? v.map(String) : undefined
  return {
    ageBands: arr(b.ageBands),
    biologicalSex: arr(b.biologicalSex),
    chronotypeCats: arr(b.chronotypeCats),
    medicationCodes: arr(b.medicationCodes),
  }
}

// Run a licensed cohort query against the Chronobiobank. Returns aggregates only
// (never raw rows) and writes an immutable access-log entry.
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const context = await resolveEnterpriseContext(supabase, user.id)
  if (!context) {
    return Response.json({ error: 'Enterprise access required' }, { status: 403 })
  }

  const active = activeLicenses(context)
  if (active.length === 0) {
    return Response.json({ error: 'No active data license' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const filter = parseFilter(body)

  // RLS guarantees only licensed records are visible to this client.
  const records = await fetchChronobiobankRecords(supabase, filter)
  const aggregates = computeAggregates(records)

  const queryHash = createHash('sha256')
    .update(JSON.stringify(filter))
    .digest('hex')
    .slice(0, 32)

  await logBiobankAccess(adminClient, {
    licenseId: active[0].id,
    accessedBy: user.id,
    queryHash,
    recordCount: aggregates.totalRecords,
  })

  const suppressed = aggregates.totalRecords < MIN_COHORT_SIZE
  return Response.json({
    filter,
    suppressed,
    minCohortSize: MIN_COHORT_SIZE,
    aggregates: suppressed
      ? { totalRecords: aggregates.totalRecords, uniqueCohorts: aggregates.uniqueCohorts }
      : aggregates,
    queryHash,
  })
}
