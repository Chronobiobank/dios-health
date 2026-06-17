import { createClient } from '@/lib/supabase/server'
import { scoreMCTQ, type MCTQInput } from '@/lib/circadian/mctq'

function decimalHoursToTime(hours: number): string {
  const h = Math.floor(hours) % 24
  const m = Math.round((hours % 1) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: MCTQInput
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const required: (keyof MCTQInput)[] = [
    'workSleepOnset', 'workSleepEnd', 'freeSleepOnset', 'freeSleepEnd', 'workdaysPerWeek',
  ]
  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === '') {
      return Response.json({ error: `Missing field: ${key}` }, { status: 400 })
    }
  }

  if (body.workdaysPerWeek < 0 || body.workdaysPerWeek > 7) {
    return Response.json({ error: 'workdaysPerWeek must be 0–7' }, { status: 400 })
  }

  const result = scoreMCTQ(body)

  const { error: profileError } = await supabase
    .from('patient_profiles')
    .upsert({ id: user.id }, { onConflict: 'id' })

  if (profileError) {
    return Response.json({ error: profileError.message }, { status: 500 })
  }

  const { error: chronotypeError } = await supabase.from('chronotype_profiles').insert({
    patient_id: user.id,
    mctq_version: 'standard',
    msf_sc: result.msfSc,
    sjl_hours: result.sjlHours,
    chronotype_cat: result.chronotypeCat,
  })

  if (chronotypeError) {
    return Response.json({ error: chronotypeError.message }, { status: 500 })
  }

  const { error: dlmoError } = await supabase.from('dlmo_estimates').insert({
    patient_id: user.id,
    method: 'smartphone_l3',
    dlmo_time: decimalHoursToTime(result.dlmoEstimateHours),
    confidence: 0.65,
    phase_offset: null,
    raw_data: { mctq: body, result },
  })

  if (dlmoError) {
    return Response.json({ error: dlmoError.message }, { status: 500 })
  }

  return Response.json({ ok: true, result })
}
