import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { displayName?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const displayName = body.displayName?.trim()
  if (!displayName) {
    return Response.json({ ok: true, skipped: true })
  }

  const { data: profile, error: readError } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle()

  if (readError) {
    return Response.json({ error: readError.message }, { status: 500 })
  }

  const existing = profile?.display_name?.trim()
  if (existing) {
    return Response.json({ ok: true, skipped: true, reason: 'already_set' })
  }

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ display_name: displayName })
    .eq('id', user.id)

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  await supabase.from('patient_profiles').upsert({ id: user.id }, { onConflict: 'id' })

  return Response.json({ ok: true, display_name: displayName })
}
