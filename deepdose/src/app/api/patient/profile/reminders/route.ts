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

  let body: { enabled?: boolean }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof body.enabled !== 'boolean') {
    return Response.json({ error: 'enabled must be a boolean' }, { status: 400 })
  }

  const { error } = await supabase.from('patient_profiles').upsert(
    {
      id: user.id,
      reminders_enabled: body.enabled,
    },
    { onConflict: 'id' }
  )

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true, reminders_enabled: body.enabled })
}
