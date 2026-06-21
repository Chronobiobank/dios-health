import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import {
  MEDICATION_CLUSTERS,
  getMedicationCatalog,
  buildMedicationRecommendation,
} from '@/lib/medications/catalog'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const context = await getPatientCircadianContext(supabase, user.id)
  const catalog = getMedicationCatalog().map((entry) =>
    buildMedicationRecommendation(entry, context.phaseOffsetMinutes)
  )

  return Response.json({
    phaseOffsetMinutes: context.phaseOffsetMinutes,
    clusters: MEDICATION_CLUSTERS,
    catalog,
    optimisedCount: catalog.filter((c) => c.timingTier === 'optimised').length,
    totalCount: catalog.length,
  })
}
