import { createClient } from '@/lib/supabase/server'
import { patientHasRequiredConsents } from '@/lib/consent/dynamic-consent'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { loadActivePatientMedications } from '@/lib/medications/patient-meds'
import { buildMedicationRecommendations } from '@/lib/medications/recommendations'
import {
  defaultTimingForEntry,
  getCatalogEntry,
  isCatalogCode,
} from '@/lib/medications/catalog'

export interface MedicationSelection {
  code: string
  dose_mg?: number
  current_timing?: string
}

function timeToDb(time: string): string {
  return time.length === 5 ? `${time}:00` : time
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const scope = new URL(request.url).searchParams.get('scope')

  if (scope === 'active') {
    try {
      const { context, medications } = await loadActivePatientMedications(supabase, user.id)
      return Response.json({ context, medications })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load medications'
      return Response.json({ error: message }, { status: 500 })
    }
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  const { data: medications, error: medsError } = await supabase
    .from('medications')
    .select('code, display_name, drug_class, evidence_grade')
    .order('display_name')

  if (medsError) {
    return Response.json({ error: medsError.message }, { status: 500 })
  }

  const recommendations = buildMedicationRecommendations(
    medications ?? [],
    context.phaseOffsetMinutes
  )

  return Response.json({ context, medications: recommendations })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { medications?: MedicationSelection[] }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const selections = body.medications ?? []

  const { granted, error: consentError } = await patientHasRequiredConsents(supabase, user.id)
  if (consentError) {
    return Response.json({ error: consentError }, { status: 500 })
  }
  if (!granted) {
    return Response.json(
      { error: 'Required consents must be granted before saving medicines.' },
      { status: 403 }
    )
  }

  for (const sel of selections) {
    if (!isCatalogCode(sel.code)) {
      return Response.json({ error: `Unknown medication: ${sel.code}` }, { status: 400 })
    }
    if (sel.dose_mg !== undefined && sel.dose_mg <= 0) {
      return Response.json({ error: 'Dose must be positive' }, { status: 400 })
    }
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  const { error: profileError } = await supabase
    .from('patient_profiles')
    .upsert(
      { id: user.id, onboarding_meds_completed_at: new Date().toISOString() },
      { onConflict: 'id' }
    )

  if (profileError) {
    return Response.json({ error: profileError.message }, { status: 500 })
  }

  const { error: deactivateError } = await supabase
    .from('patient_medications')
    .update({ is_active: false, ended_at: new Date().toISOString().slice(0, 10) })
    .eq('patient_id', user.id)
    .eq('is_active', true)

  if (deactivateError) {
    return Response.json({ error: deactivateError.message }, { status: 500 })
  }

  const today = new Date().toISOString().slice(0, 10)

  for (const sel of selections) {
    const entry = getCatalogEntry(sel.code)!
    const defaultTiming =
      sel.current_timing ??
      (entry.timingTier === 'optimised' && entry.timing
        ? entry.timing.populationWindowStart
        : defaultTimingForEntry(entry, context.phaseOffsetMinutes))

    const { error: insertError } = await supabase.from('patient_medications').insert({
      patient_id: user.id,
      medication_code: sel.code,
      dose_mg: sel.dose_mg ?? null,
      current_timing: timeToDb(defaultTiming),
      started_at: today,
      is_active: true,
    })

    if (insertError) {
      return Response.json({ error: insertError.message, code: sel.code }, { status: 500 })
    }
  }

  const { error: scoreError } = await supabase.from('circadian_scores').insert({
    patient_id: user.id,
    score: context.circadianScore,
    components: {
      dlmoEstimateHours: context.dlmoEstimateHours,
      sjlHours: context.sjlHours,
      chronotypeCat: context.chronotypeCat,
      phaseOffsetMinutes: context.phaseOffsetMinutes,
    },
    version: process.env.CIRCADIAN_SCORE_VERSION ?? 'v1',
  })

  if (scoreError) {
    return Response.json({ error: scoreError.message }, { status: 500 })
  }

  return Response.json({ ok: true, saved: selections.length, circadianScore: context.circadianScore })
}
