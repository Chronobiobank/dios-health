import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import {
  MEDICATION_CLUSTERS,
  getMedicationCatalog,
  searchMedicationCatalog,
  buildMedicationRecommendation,
  type ClusterId,
} from '@/lib/medications/catalog'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''
  const cluster = searchParams.get('cluster') as ClusterId | null
  const limit = Math.min(Number(searchParams.get('limit') ?? 12), 30)

  const context = await getPatientCircadianContext(supabase, user.id)

  const entries = searchMedicationCatalog(query, {
    clusterId: cluster ?? undefined,
    limit,
  })

  const results = entries.map((entry) =>
    buildMedicationRecommendation(entry, context.phaseOffsetMinutes)
  )

  return Response.json({
    query,
    cluster,
    count: results.length,
    optimisedCount: getMedicationCatalog().filter((e) => e.timingTier === 'optimised').length,
    totalCount: getMedicationCatalog().length,
    clusters: MEDICATION_CLUSTERS,
    results,
  })
}
